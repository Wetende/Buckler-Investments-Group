"""Admin & Agent property management routes."""
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.encoders import jsonable_encoder
import json

from core.database import get_async_session
from core.dependencies import require_agent_or_admin
from models import Property, PropertyStatusLog, PropertyStatus
from schemas.property_schemas import PropertyCreateUpdate, PropertyDetailResponse
from models.user import User, UserRole

router = APIRouter(prefix="/api/v1/admin/properties", tags=["Properties (Admin)"])


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
async def create_or_update_property(
    payload: PropertyCreateUpdate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(require_agent_or_admin),
):
    """Create (id==0) or update (id>0) a property. Ownership or admin enforced."""

    if payload.id == 0:
        # Create new property
        slug = await _generate_unique_slug(payload.title, session)
        new_prop = Property(
            **payload.model_dump(exclude={"id"}, exclude_none=True),
            agent_id=user.id if user.role == UserRole.AGENT else payload.agent_id or user.id,
            slug=slug,
        )
        session.add(new_prop)
        await session.commit()
        await session.refresh(new_prop)
        return Response(status_code=status.HTTP_201_CREATED, content=json.dumps(jsonable_encoder(new_prop)))

    # Update existing property
    stmt = select(Property).where(Property.id == payload.id)
    res = await session.execute(stmt)
    prop: Optional[Property] = res.scalar_one_or_none()
    if prop is None:
        raise HTTPException(status_code=404, detail="Property not found")

    # Authorization: admin or owner agent
    if user.role != UserRole.ADMIN and prop.agent_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    old_status = prop.status

    # update fields
    update_data = payload.model_dump(exclude_unset=True, exclude={"id"})
    for field, value in update_data.items():
        setattr(prop, field, value)

    # Audit status change
    if 'status' in update_data and update_data['status'] != old_status:
        log = PropertyStatusLog(
            property_id=prop.id,
            old_status=old_status,
            new_status=update_data['status'],
            changed_by_user_id=user.id,
        )
        session.add(log)

    await session.commit()
    await session.refresh(prop)
    return prop


@router.get("/{property_id}/delete", response_model=dict)
async def delete_property(
    property_id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(require_agent_or_admin),
):
    """Delete a property (soft delete not spec'd, so hard delete)."""
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
