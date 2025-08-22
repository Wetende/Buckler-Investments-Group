"""
Admin property routes - requires authentication and admin/agent permissions.

Consolidated from:
- properties_all.py (admin endpoints)
- property/routes.py (create functionality)
"""
from __future__ import annotations

from typing import List
from fastapi import APIRouter, Body, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from dependency_injector.wiring import inject, Provide

from infrastructure.config.database import get_async_session
from infrastructure.config.dependencies import require_agent_or_admin
from infrastructure.database.models import Property, PropertyStatusLog
from infrastructure.database.models.user import User, UserRole
from application.dto.property_schemas import (
    PropertyDetailResponse,
    PropertyCreateUpdate as AdminPropertyCU,
)
from application.dto.property import (
    PropertyResponseDTO, 
    CreatePropertyRequestDTO
)
from application.use_cases.property.create_property import CreatePropertyUseCase
from api.containers import AppContainer

router = APIRouter()

# Create property using use case pattern
@router.post("/", status_code=status.HTTP_201_CREATED)
@inject
async def create_property(
    request: dict = Body(...),
    use_case: CreatePropertyUseCase = Depends(Provide[AppContainer.property_use_cases.create_property_use_case]),
):
    """Create a new property using business use case."""
    # Convert dict to DTO for the use case
    create_dto = CreatePropertyRequestDTO(**request)
    return await use_case.execute(create_dto)

# Admin create or update property
@router.post("/manage", response_model=PropertyDetailResponse)
async def create_or_update_property_admin(
    payload: AdminPropertyCU,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(require_agent_or_admin),
):
    """Create (id==0) or update (id>0) a property - admin/agent only."""
    if payload.id == 0:
        slug = (payload.title or "").lower().replace(" ", "-")
        # Ensure unique slug
        base_slug, slug_candidate, n = slug, slug, 1
        while True:
            if (await session.execute(select(Property).where(Property.slug == slug_candidate))).scalar_one_or_none() is None:
                break
            slug_candidate = f"{base_slug}-{n}"
            n += 1
        new_prop = Property(
            **payload.model_dump(exclude={"id"}, exclude_none=True),
            agent_id=user.id if user.role == UserRole.AGENT else getattr(payload, "agent_id", None) or user.id,
            slug=slug_candidate,
        )
        session.add(new_prop)
        await session.commit()
        await session.refresh(new_prop)
        return new_prop

    prop = (await session.execute(select(Property).where(Property.id == payload.id))).scalar_one_or_none()
    if prop is None:
        raise HTTPException(status_code=404, detail="Property not found")
    if user.role != UserRole.ADMIN and prop.agent_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")
    old_status = prop.status
    for field, value in payload.model_dump(exclude_unset=True, exclude={"id"}).items():
        setattr(prop, field, value)
    if getattr(payload, "status", None) and payload.status != old_status:
        log = PropertyStatusLog(property_id=prop.id, old_status=old_status, new_status=payload.status, changed_by_user_id=user.id)
        session.add(log)
    await session.commit()
    await session.refresh(prop)
    return prop

# Delete property
@router.get("/{property_id}/delete", response_model=dict)
async def delete_property_admin(
    property_id: int, 
    session: AsyncSession = Depends(get_async_session), 
    user: User = Depends(require_agent_or_admin)
):
    """Delete a property - admin/agent only."""
    prop = (await session.execute(select(Property).where(Property.id == property_id))).scalar_one_or_none()
    if prop is None:
        raise HTTPException(status_code=404, detail="Property not found")
    if user.role != UserRole.ADMIN and prop.agent_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")
    await session.delete(prop)
    await session.commit()
    return {"detail": "Property deleted"}
