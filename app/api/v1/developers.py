from __future__ import annotations

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from infrastructure.config.database import get_async_session
from infrastructure.config.dependencies import require_admin
from infrastructure.database.models import Developer, Project, Property
from application.dto.developers import DeveloperRead, DeveloperCU


router = APIRouter(prefix="/api/v1/developers", tags=["Developers"])


@router.get("/", response_model=List[DeveloperRead])
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


@router.get("/{slug}", response_model=DeveloperRead)
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


@router.post("/", response_model=DeveloperRead)
async def create_or_update_developer(payload: DeveloperCU, session: AsyncSession = Depends(get_async_session), _: object = Depends(require_admin)):
    if payload.id == 0:
        slug = payload.slug or payload.name.lower().replace(" ", "-")
        exists = await session.execute(select(Developer).where(Developer.slug == slug))
        if exists.scalar_one_or_none() is not None:
            raise HTTPException(status_code=409, detail="Slug already exists")
        dev = Developer(slug=slug, name=payload.name, logo_url=payload.logo_url, website_url=payload.website_url, bio=payload.bio)
        session.add(dev)
        await session.commit()
        await session.refresh(dev)
        return dev
    dev = (await session.execute(select(Developer).where(Developer.id == payload.id))).scalar_one_or_none()
    if not dev:
        raise HTTPException(status_code=404, detail="Developer not found")
    if payload.slug and payload.slug != dev.slug:
        exists = await session.execute(select(Developer).where(Developer.slug == payload.slug))
        if exists.scalar_one_or_none() is not None:
            raise HTTPException(status_code=409, detail="Slug already exists")
        dev.slug = payload.slug
    dev.name = payload.name
    dev.logo_url = payload.logo_url
    dev.website_url = payload.website_url
    dev.bio = payload.bio
    await session.commit()
    await session.refresh(dev)
    return dev


@router.get("/{id}/delete", response_model=dict)
async def delete_developer(id: int, session: AsyncSession = Depends(get_async_session), _: object = Depends(require_admin)):
    dev = (await session.execute(select(Developer).where(Developer.id == id))).scalar_one_or_none()
    if not dev:
        raise HTTPException(status_code=404, detail="Developer not found")
    await session.delete(dev)
    await session.commit()
    return {"detail": "Developer deleted"}



