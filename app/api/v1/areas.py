from __future__ import annotations

from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from infrastructure.config.database import get_async_session
from infrastructure.config.dependencies import require_admin
from infrastructure.database.models import AreaProfile
from application.dto.areas import AreaRead, AreaCU


router = APIRouter(prefix="/api/v1/areas", tags=["Areas"])


@router.get("/", response_model=List[AreaRead])
async def list_areas(
    q: Optional[str] = Query(None, description="Search by name"),
    limit: int = Query(50, ge=1, le=100),
    session: AsyncSession = Depends(get_async_session),
):
    stmt = select(AreaProfile)
    if q:
        stmt = stmt.where(AreaProfile.name.ilike(f"%{q}%"))
    stmt = stmt.order_by(AreaProfile.name.asc()).limit(limit)
    res = await session.execute(stmt)
    return res.scalars().all()


@router.get("/{slug}", response_model=AreaRead)
async def get_area(slug: str, session: AsyncSession = Depends(get_async_session)):
    stmt = select(AreaProfile).where(AreaProfile.slug == slug)
    res = await session.execute(stmt)
    area = res.scalar_one_or_none()
    if not area:
        raise HTTPException(status_code=404, detail="Area not found")
    return area


@router.post("/", response_model=AreaRead)
async def create_or_update_area(
    payload: AreaCU,
    session: AsyncSession = Depends(get_async_session),
    _: object = Depends(require_admin),
):
    if payload.id == 0:
        slug = payload.slug or payload.name.lower().replace(" ", "-")
        exists = await session.execute(select(AreaProfile).where(AreaProfile.slug == slug))
        if exists.scalar_one_or_none() is not None:
            raise HTTPException(status_code=409, detail="Slug already exists")
        area = AreaProfile(
            slug=slug,
            name=payload.name,
            summary=payload.summary,
            hero_image_url=payload.hero_image_url,
            stats=payload.stats,
        )
        session.add(area)
        await session.commit()
        await session.refresh(area)
        return area

    res = await session.execute(select(AreaProfile).where(AreaProfile.id == payload.id))
    area: Optional[AreaProfile] = res.scalar_one_or_none()
    if not area:
        raise HTTPException(status_code=404, detail="Area not found")
    if payload.slug and payload.slug != area.slug:
        exists = await session.execute(select(AreaProfile).where(AreaProfile.slug == payload.slug))
        if exists.scalar_one_or_none() is not None:
            raise HTTPException(status_code=409, detail="Slug already exists")
        area.slug = payload.slug
    area.name = payload.name
    area.summary = payload.summary
    area.hero_image_url = payload.hero_image_url
    area.stats = payload.stats
    await session.commit()
    await session.refresh(area)
    return area


@router.get("/{id}/delete", response_model=dict)
async def delete_area(
    id: int,
    session: AsyncSession = Depends(get_async_session),
    _: object = Depends(require_admin),
):
    res = await session.execute(select(AreaProfile).where(AreaProfile.id == id))
    area = res.scalar_one_or_none()
    if not area:
        raise HTTPException(status_code=404, detail="Area not found")
    await session.delete(area)
    await session.commit()
    return {"detail": "Area deleted"}



