"""Agent property CRUD routes following GET/POST convention."""
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_async_session
from core.dependencies import require_agent_or_admin
from models import Property, PropertyStatusLog, PropertyStatus
from schemas.property import PropertyCreateUpdate, PropertyDetailResponse
from models.user import User, UserRole

router = APIRouter(prefix="/api/v1/properties", tags=["Properties (Agent)"])

async def _generate_unique_slug(title: str, session: AsyncSession) -> str:
    """Generate a unique, URL-friendly slug from a title."""
    base_slug = title.lower().replace(' ', '-').strip()
    slug = base_slug
    counter = 1
    while True:
        stmt = select(Property).where(Property.slug == slug)
        res = await session.execute(stmt)
        if res.scalar_one_or_none() is None:
            return slug
        slug = f"{base_slug}-{counter}"
        counter += 1

@router.post("/", response_model=PropertyDetailResponse)
async def create_or_update_property_agent(
    payload: PropertyCreateUpdate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(require_agent_or_admin),
):
    """Create (id==0) or update property restricted to owner agent or admin."""
    if payload.id == 0:
        slug = await _generate_unique_slug(payload.title, session)
        new_prop = Property(
            **payload.model_dump(exclude={"id", "slug"}, exclude_none=True),
            agent_id=user.id if user.role == UserRole.AGENT else payload.agent_id or user.id,
            slug=slug,
        )
        session.add(new_prop)
        await session.commit()
        await session.refresh(new_prop)
        return new_prop

    stmt = select(Property).where(Property.id == payload.id)
    res = await session.execute(stmt)
    prop: Optional[Property] = res.scalar_one_or_none()
    if prop is None:
        raise HTTPException(status_code=404, detail="Property not found")

    if user.role != UserRole.ADMIN and prop.agent_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    old_status = prop.status
    for field, value in payload.model_dump(exclude={"id"}).items():
        if value is not None:
            setattr(prop, field, value)

    await session.commit()
    await session.refresh(prop)

    if payload.status and payload.status != old_status:
        log = PropertyStatusLog(
            property_id=prop.id,
            old_status=old_status,
            new_status=payload.status,
            changed_by_user_id=user.id,
        )
        session.add(log)
        await session.commit()
    return prop


@router.get("/{property_id}/delete", response_model=dict)
async def delete_property_agent(
    property_id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(require_agent_or_admin),
):
    stmt = select(Property).where(Property.id == property_id)
    res = await session.execute(stmt)
    prop: Optional[Property] = res.scalar_one_or_none()
    if prop is None:
        raise HTTPException(status_code=404, detail="Property not found")
    if user.role != UserRole.ADMIN and prop.agent_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    await session.delete(prop)
    await session.commit()
    return {"detail": "Property deleted"}
