"""
Property catalog routes - areas, developers, projects related to properties.

Consolidated from:
- catalog.py (areas, developers, projects)
- areas.py 
- developers.py
- projects_unified.py
"""
from __future__ import annotations

from decimal import Decimal
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_, select, func
from sqlalchemy.ext.asyncio import AsyncSession

from infrastructure.config.config import settings
from infrastructure.config.database import get_async_session
from infrastructure.config.dependencies import require_admin
from infrastructure.database.models import AreaProfile, Developer, Project, Property
from infrastructure.database.models.user import User
from application.dto.areas import AreaRead
from application.dto.developers import DeveloperRead  
from application.dto.projects import ProjectRead, PaginatedProjects
from application.dto.property_schemas import (
    PaginatedPropertyResponse,
    PropertySummaryResponse,
)
from infrastructure.database.models import Property as PropertyModel, PropertyStatus

router = APIRouter()

# Areas -----------------------------------------------------------------------
@router.get("/areas", response_model=List[AreaRead])
async def list_areas(
    q: Optional[str] = Query(None), 
    limit: int = Query(50, ge=1, le=100), 
    session: AsyncSession = Depends(get_async_session)
):
    """List property areas with optional search."""
    stmt = select(AreaProfile)
    if q:
        stmt = stmt.where(AreaProfile.name.ilike(f"%{q}%"))
    stmt = stmt.order_by(AreaProfile.name.asc()).limit(limit)
    res = await session.execute(stmt)
    return res.scalars().all()

@router.get("/areas/{slug}", response_model=AreaRead)
async def get_area(slug: str, session: AsyncSession = Depends(get_async_session)):
    """Get area details by slug."""
    stmt = select(AreaProfile).where(AreaProfile.slug == slug)
    res = await session.execute(stmt)
    area = res.scalar_one_or_none()
    if not area:
        raise HTTPException(status_code=404, detail="Area not found")
    return area

@router.post("/areas", response_model=AreaRead)
async def create_or_update_area(
    payload: AreaRead,
    session: AsyncSession = Depends(get_async_session),
    _: User = Depends(require_admin),
):
    """Create (id==0) or update (id>0) an area - admin only."""
    if payload.id == 0:
        new_area = AreaProfile(**payload.model_dump(exclude={"id"}))
        session.add(new_area)
        await session.commit()
        await session.refresh(new_area)
        return new_area
    
    area = (await session.execute(select(AreaProfile).where(AreaProfile.id == payload.id))).scalar_one_or_none()
    if area is None:
        raise HTTPException(status_code=404, detail="Area not found")
    
    for field, value in payload.model_dump(exclude={"id"}).items():
        if value is not None:
            setattr(area, field, value)
    
    await session.commit()
    await session.refresh(area)
    return area

@router.get("/areas/{id}/delete", response_model=dict)
async def delete_area(
    id: int,
    session: AsyncSession = Depends(get_async_session),
    _: User = Depends(require_admin),
):
    """Delete an area - admin only."""
    area = (await session.execute(select(AreaProfile).where(AreaProfile.id == id))).scalar_one_or_none()
    if area is None:
        raise HTTPException(status_code=404, detail="Area not found")
    await session.delete(area)
    await session.commit()
    return {"detail": "Area deleted"}

# Developers ------------------------------------------------------------------
@router.get("/developers", response_model=List[DeveloperRead])
async def list_developers(session: AsyncSession = Depends(get_async_session)):
    """List property developers."""
    stmt = select(Developer).order_by(Developer.name.asc())
    res = await session.execute(stmt)
    return res.scalars().all()

@router.get("/developers/{slug}", response_model=DeveloperRead)
async def get_developer(slug: str, session: AsyncSession = Depends(get_async_session)):
    """Get developer details by slug."""
    stmt = select(Developer).where(Developer.slug == slug)
    res = await session.execute(stmt)
    developer = res.scalar_one_or_none()
    if not developer:
        raise HTTPException(status_code=404, detail="Developer not found")
    return developer

@router.post("/developers", response_model=DeveloperRead)
async def create_or_update_developer(
    payload: DeveloperRead,
    session: AsyncSession = Depends(get_async_session),
    _: User = Depends(require_admin),
):
    """Create (id==0) or update (id>0) a developer - admin only."""
    if payload.id == 0:
        new_developer = Developer(**payload.model_dump(exclude={"id"}))
        session.add(new_developer)
        await session.commit()
        await session.refresh(new_developer)
        return new_developer
    
    developer = (await session.execute(select(Developer).where(Developer.id == payload.id))).scalar_one_or_none()
    if developer is None:
        raise HTTPException(status_code=404, detail="Developer not found")
    
    for field, value in payload.model_dump(exclude={"id"}).items():
        if value is not None:
            setattr(developer, field, value)
    
    await session.commit()
    await session.refresh(developer)
    return developer

@router.get("/developers/{id}/delete", response_model=dict)
async def delete_developer(
    id: int,
    session: AsyncSession = Depends(get_async_session),
    _: User = Depends(require_admin),
):
    """Delete a developer - admin only."""
    developer = (await session.execute(select(Developer).where(Developer.id == id))).scalar_one_or_none()
    if developer is None:
        raise HTTPException(status_code=404, detail="Developer not found")
    await session.delete(developer)
    await session.commit()
    return {"detail": "Developer deleted"}

# Projects --------------------------------------------------------------------
@router.get("/projects", response_model=PaginatedProjects)
async def list_projects(
    page_size: int = Query(20, ge=1, le=100),
    cursor: Optional[str] = Query(None),
    developer_id: Optional[int] = None,
    area_id: Optional[int] = None,
    session: AsyncSession = Depends(get_async_session),
):
    """List property projects with filtering and pagination."""
    conditions = []
    if developer_id:
        conditions.append(Project.developer_id == developer_id)
    if area_id:
        conditions.append(Project.area_id == area_id)

    def decode_cursor(cursor: Optional[str]) -> Optional[int]:
        if not cursor:
            return None
        import base64, json
        try:
            payload = json.loads(base64.urlsafe_b64decode(cursor.encode()).decode())
            return int(payload.get("last_id"))
        except Exception:
            return None

    last_id = decode_cursor(cursor)
    if last_id is not None:
        conditions.append(Project.id > last_id)

    stmt = select(Project)
    if conditions:
        stmt = stmt.where(and_(*conditions))
    stmt = stmt.order_by(Project.created_at.desc()).limit(page_size + 1)
    
    res = await session.execute(stmt)
    projects = res.scalars().all()
    
    has_more = len(projects) > page_size
    if has_more:
        projects = projects[:-1]

    def encode_cursor(last_id: int) -> str:
        import base64, json
        return base64.urlsafe_b64encode(json.dumps({"last_id": last_id}).encode()).decode()

    return PaginatedProjects(
        items=projects,
        cursor=encode_cursor(projects[-1].id) if projects and has_more else None,
        has_more=has_more,
    )

@router.get("/projects/{slug}", response_model=ProjectRead)
async def get_project(slug: str, session: AsyncSession = Depends(get_async_session)):
    """Get project details by slug."""
    stmt = select(Project).where(Project.slug == slug)
    res = await session.execute(stmt)
    project = res.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("/projects", response_model=ProjectRead)
async def create_or_update_project(
    payload: ProjectRead,
    session: AsyncSession = Depends(get_async_session),
    _: User = Depends(require_admin),
):
    """Create (id==0) or update (id>0) a project - admin only."""
    if payload.id == 0:
        new_project = Project(**payload.model_dump(exclude={"id"}))
        session.add(new_project)
        await session.commit()
        await session.refresh(new_project)
        return new_project
    
    project = (await session.execute(select(Project).where(Project.id == payload.id))).scalar_one_or_none()
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    for field, value in payload.model_dump(exclude={"id"}).items():
        if value is not None:
            setattr(project, field, value)
    
    await session.commit()
    await session.refresh(project)
    return project

@router.get("/projects/{id}/delete", response_model=dict)
async def delete_project(
    id: int,
    session: AsyncSession = Depends(get_async_session),
    _: User = Depends(require_admin),
):
    """Delete a project - admin only."""
    project = (await session.execute(select(Project).where(Project.id == id))).scalar_one_or_none()
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    await session.delete(project)
    await session.commit()
    return {"detail": "Project deleted"}

