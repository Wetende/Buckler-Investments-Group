from __future__ import annotations

from decimal import Decimal
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_, select, func
from sqlalchemy.ext.asyncio import AsyncSession

from infrastructure.config.config import settings
from infrastructure.config.database import get_async_session
from infrastructure.database.models import AreaProfile, Developer, Project, Property
from application.dto.areas import AreaRead
from application.dto.developers import DeveloperRead
from application.dto.projects import ProjectRead, PaginatedProjects
from application.dto.property_schemas import (
    PaginatedPropertyResponse,
    PropertySummaryResponse,
    PropertyDetailResponse,
)
from infrastructure.database.models import Property as PropertyModel, PropertyStatus


router = APIRouter(tags=["Catalog"])


# Areas -----------------------------------------------------------------------
@router.get("/api/v1/public/areas", response_model=List[AreaRead])
async def list_areas(q: Optional[str] = Query(None), limit: int = Query(50, ge=1, le=100), session: AsyncSession = Depends(get_async_session)):
    stmt = select(AreaProfile)
    if q:
        stmt = stmt.where(AreaProfile.name.ilike(f"%{q}%"))
    stmt = stmt.order_by(AreaProfile.name.asc()).limit(limit)
    res = await session.execute(stmt)
    return res.scalars().all()


@router.get("/api/v1/public/areas/{slug}", response_model=AreaRead)
async def get_area(slug: str, session: AsyncSession = Depends(get_async_session)):
    stmt = select(AreaProfile).where(AreaProfile.slug == slug)
    res = await session.execute(stmt)
    area = res.scalar_one_or_none()
    if not area:
        raise HTTPException(status_code=404, detail="Area not found")
    return area


# Developers ------------------------------------------------------------------
@router.get("/api/v1/public/developers", response_model=List[DeveloperRead])
async def list_developers(session: AsyncSession = Depends(get_async_session)):
    res = await session.execute(select(Developer).order_by(Developer.name.asc()))
    devs = res.scalars().all()
    results: list[DeveloperRead] = []
    for d in devs:
        proj_count = (await session.execute(select(func.count()).select_from(Project).where(Project.developer_id == d.id))).scalar()
        prop_count = (await session.execute(select(func.count()).select_from(Property).where(Property.project_id.is_not(None)))).scalar()
        results.append(DeveloperRead.model_validate({
            "id": d.id,
            "slug": d.slug,
            "name": d.name,
            "logo_url": d.logo_url,
            "website_url": d.website_url,
            "bio": d.bio,
            "projects_count": int(proj_count or 0),
            "properties_count": int(prop_count or 0),
        }))
    return results


@router.get("/api/v1/public/developers/{slug}", response_model=DeveloperRead)
async def get_developer(slug: str, session: AsyncSession = Depends(get_async_session)):
    d = (await session.execute(select(Developer).where(Developer.slug == slug))).scalar_one_or_none()
    if not d:
        raise HTTPException(status_code=404, detail="Developer not found")
    proj_count = (await session.execute(select(func.count()).select_from(Project).where(Project.developer_id == d.id))).scalar()
    prop_count = (await session.execute(select(func.count()).select_from(Property).where(Property.project_id.is_not(None)))).scalar()
    return DeveloperRead.model_validate({
        "id": d.id,
        "slug": d.slug,
        "name": d.name,
        "logo_url": d.logo_url,
        "website_url": d.website_url,
        "bio": d.bio,
        "projects_count": int(proj_count or 0),
        "properties_count": int(prop_count or 0),
    })


# Projects --------------------------------------------------------------------
@router.get("/api/v1/public/projects", response_model=PaginatedProjects)
async def list_projects(
    page_size: int = Query(20, ge=1, le=100),
    cursor: Optional[str] = Query(None),
    developer_id: Optional[int] = None,
    min_price: Optional[Decimal] = None,
    max_price: Optional[Decimal] = None,
    bedrooms_min: Optional[int] = None,
    bedrooms_max: Optional[int] = None,
    badge: Optional[str] = Query(None, pattern="^(HOT|UPCOMING|BEST_VALUE)$"),
    session: AsyncSession = Depends(get_async_session),
):
    # Already imported at top
    conditions = []
    if developer_id is not None:
        conditions.append(ProjectModel.developer_id == developer_id)
    if min_price is not None:
        conditions.append(ProjectModel.from_price >= min_price)
    if max_price is not None:
        conditions.append(ProjectModel.from_price <= max_price)
    if bedrooms_min is not None:
        conditions.append(ProjectModel.bedrooms_min >= bedrooms_min)
    if bedrooms_max is not None:
        conditions.append(ProjectModel.bedrooms_max <= bedrooms_max)
    if badge is not None:
        conditions.append(ProjectModel.badges[f"{badge}"] == True)

    last_id = None
    if cursor:
        import base64, json
        try:
            payload = json.loads(base64.urlsafe_b64decode(cursor.encode()).decode())
            last_id = int(payload.get("last_id"))
        except Exception:
            last_id = None
    if last_id is not None:
        conditions.append(ProjectModel.id > last_id)

    stmt = select(ProjectModel).where(and_(*conditions)).order_by(ProjectModel.created_at.desc()).limit(page_size + 1)
    res = await session.execute(stmt)
    projects = res.scalars().all()

    has_more = len(projects) > page_size
    if has_more:
        projects = projects[:-1]

    kes_per_usd = Decimal(str(getattr(settings, "KES_PER_USD", 130.0)))
    items: list[ProjectRead] = []
    for p in projects:
        from_price_usd = (p.from_price / kes_per_usd).quantize(Decimal("0.01")) if p.from_price else None
        items.append(ProjectRead(
            id=p.id,
            slug=p.slug,
            name=p.name,
            developer_id=p.developer_id,
            from_price=p.from_price,
            from_price_usd=from_price_usd,
            handover_quarter=p.handover_quarter,
            bedrooms_min=p.bedrooms_min,
            bedrooms_max=p.bedrooms_max,
            location=p.location,
            latitude=p.latitude,
            longitude=p.longitude,
            payment_plan=p.payment_plan,
            badges=p.badges,
            media=p.media,
            created_at=p.created_at,
            updated_at=p.updated_at,
        ))

    def encode_cursor(last_id: int) -> str:
        import base64, json
        return base64.urlsafe_b64encode(json.dumps({"last_id": last_id}).encode()).decode()

    return PaginatedProjects(
        items=items,
        cursor=encode_cursor(projects[-1].id) if projects and has_more else None,
        has_more=has_more,
    )


@router.get("/api/v1/public/projects/{slug}", response_model=ProjectRead)
async def get_project(slug: str, session: AsyncSession = Depends(get_async_session)):
    # Already imported at top
    p = (await session.execute(select(ProjectModel).where(ProjectModel.slug == slug))).scalar_one_or_none()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    kes_per_usd = Decimal(str(getattr(settings, "KES_PER_USD", 130.0)))
    from_price_usd = (p.from_price / kes_per_usd).quantize(Decimal("0.01")) if p.from_price else None
    return ProjectRead(
        id=p.id,
        slug=p.slug,
        name=p.name,
        developer_id=p.developer_id,
        from_price=p.from_price,
        from_price_usd=from_price_usd,
        handover_quarter=p.handover_quarter,
        bedrooms_min=p.bedrooms_min,
        bedrooms_max=p.bedrooms_max,
        location=p.location,
        latitude=p.latitude,
        longitude=p.longitude,
        payment_plan=p.payment_plan,
        badges=p.badges,
        media=p.media,
        created_at=p.created_at,
        updated_at=p.updated_at,
    )



