from __future__ import annotations

from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_async_session
from core.dependencies import require_agent_or_admin
from core.config import settings
from models import Project, Developer
from schemas.projects import ProjectRead, PaginatedProjects, ProjectCU


router = APIRouter(prefix="/api/v1/projects", tags=["Projects"])


@router.get("/", response_model=PaginatedProjects)
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
    conditions = []
    if developer_id is not None:
        conditions.append(Project.developer_id == developer_id)
    if min_price is not None:
        conditions.append(Project.from_price >= min_price)
    if max_price is not None:
        conditions.append(Project.from_price <= max_price)
    if bedrooms_min is not None:
        conditions.append(Project.bedrooms_min >= bedrooms_min)
    if bedrooms_max is not None:
        conditions.append(Project.bedrooms_max <= bedrooms_max)
    if badge is not None:
        conditions.append(Project.badges[f"{badge}"] == True)

    last_id = None
    if cursor:
        import base64, json
        try:
            payload = json.loads(base64.urlsafe_b64decode(cursor.encode()).decode())
            last_id = int(payload.get("last_id"))
        except Exception:
            last_id = None
    if last_id is not None:
        conditions.append(Project.id > last_id)

    stmt = select(Project).where(and_(*conditions)).order_by(Project.created_at.desc()).limit(page_size + 1)
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

    return PaginatedProjects(items=items, cursor=encode_cursor(projects[-1].id) if projects and has_more else None, has_more=has_more)


@router.get("/{slug}", response_model=ProjectRead)
async def get_project(slug: str, session: AsyncSession = Depends(get_async_session)):
    p = (await session.execute(select(Project).where(Project.slug == slug))).scalar_one_or_none()
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


@router.post("/", response_model=ProjectRead)
async def upsert_project(payload: ProjectCU, session: AsyncSession = Depends(get_async_session), _: object = Depends(require_agent_or_admin)):
    # ensure developer exists
    if (await session.execute(select(Developer).where(Developer.id == payload.developer_id))).scalar_one_or_none() is None:
        raise HTTPException(status_code=400, detail="Invalid developer_id")
    if payload.id == 0:
        slug = payload.slug or payload.name.lower().replace(" ", "-")
        if (await session.execute(select(Project).where(Project.slug == slug))).scalar_one_or_none() is not None:
            raise HTTPException(status_code=409, detail="Slug already exists")
        proj = Project(
            slug=slug,
            developer_id=payload.developer_id,
            name=payload.name,
            from_price=payload.from_price,
            handover_quarter=payload.handover_quarter,
            bedrooms_min=payload.bedrooms_min,
            bedrooms_max=payload.bedrooms_max,
            location=payload.location,
            latitude=payload.latitude,
            longitude=payload.longitude,
            payment_plan=payload.payment_plan,
            badges=payload.badges,
            media=payload.media,
        )
        session.add(proj)
        await session.commit()
        await session.refresh(proj)
        return proj
    proj = (await session.execute(select(Project).where(Project.id == payload.id))).scalar_one_or_none()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    if payload.slug and payload.slug != proj.slug:
        if (await session.execute(select(Project).where(Project.slug == payload.slug))).scalar_one_or_none() is not None:
            raise HTTPException(status_code=409, detail="Slug already exists")
        proj.slug = payload.slug
    proj.developer_id = payload.developer_id
    proj.name = payload.name
    proj.from_price = payload.from_price
    proj.handover_quarter = payload.handover_quarter
    proj.bedrooms_min = payload.bedrooms_min
    proj.bedrooms_max = payload.bedrooms_max
    proj.location = payload.location
    proj.latitude = payload.latitude
    proj.longitude = payload.longitude
    proj.payment_plan = payload.payment_plan
    proj.badges = payload.badges
    proj.media = payload.media
    await session.commit()
    await session.refresh(proj)
    return proj


@router.get("/{id}/delete", response_model=dict)
async def delete_project(id: int, session: AsyncSession = Depends(get_async_session), _: object = Depends(require_agent_or_admin)):
    proj = (await session.execute(select(Project).where(Project.id == id))).scalar_one_or_none()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    await session.delete(proj)
    await session.commit()
    return {"detail": "Project deleted"}



