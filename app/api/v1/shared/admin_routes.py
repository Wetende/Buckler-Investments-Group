"""Admin system routes - consolidated from various admin files"""
from __future__ import annotations

from typing import Dict, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from infrastructure.config.database import get_async_session
from infrastructure.config.dependencies import current_active_user, require_admin
from infrastructure.database.models.user import User, UserRole
from infrastructure.database.models import Property, InvOrder, StBooking
from application.dto.user import AdminUserCreateUpdate, UserRead
from application.dto.settings import SystemSettingsOut

router = APIRouter()

# Dashboard stats
@router.get("/dashboard/stats", response_model=Dict[str, int])
async def get_dashboard_stats(
    session: AsyncSession = Depends(get_async_session),
    _: User = Depends(require_admin)
):
    """Get admin dashboard statistics."""
    # Count various entities
    property_count = await session.scalar(select(func.count(Property.id)))
    user_count = await session.scalar(select(func.count(User.id)))
    order_count = await session.scalar(select(func.count(InvOrder.id)))
    booking_count = await session.scalar(select(func.count(StBooking.id)))
    
    return {
        "total_properties": property_count or 0,
        "total_users": user_count or 0, 
        "total_orders": order_count or 0,
        "total_bookings": booking_count or 0,
    }

# User management (moved from admin/user_routes.py)
@router.get("/users", response_model=List[UserRead])
async def list_users(
    session: AsyncSession = Depends(get_async_session),
    _: User = Depends(require_admin),
):
    """List all users - admin only."""
    res = await session.execute(select(User))
    return res.scalars().all()

@router.get("/users/{user_id}", response_model=UserRead)
async def get_user(
    user_id: int,
    session: AsyncSession = Depends(get_async_session),
    _: User = Depends(require_admin),
):
    """Get user by ID - admin only."""
    res = await session.execute(select(User).where(User.id == user_id))
    user = res.scalar_one_or_none()
    if user is None:
        raise HTTPException(404, "User not found")
    return user

@router.post("/users", response_model=UserRead)
async def create_or_update_user(
    payload: AdminUserCreateUpdate,
    session: AsyncSession = Depends(get_async_session),
    _: User = Depends(require_admin),
):
    """Create (id==0) or update (id>0) a user - admin only."""
    if payload.id == 0:
        new_user = User(
            email=payload.email,
            hashed_password=payload.password,  # should be hashed upstream in user manager
            role=payload.role or UserRole.BUYER,
            name=payload.name,
            phone=payload.phone,
        )
        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)
        return new_user

    stmt = select(User).where(User.id == payload.id)
    res = await session.execute(stmt)
    user = res.scalar_one_or_none()
    if user is None:
        raise HTTPException(404, "User not found")

    for field, value in payload.model_dump(exclude={"id"}).items():
        if value is not None:
            setattr(user, field, value)

    await session.commit()
    await session.refresh(user)
    return user

@router.get("/users/{user_id}/deactivate", response_model=dict)
async def deactivate_user(
    user_id: int,
    session: AsyncSession = Depends(get_async_session),
    _: User = Depends(require_admin),
):
    """Deactivate a user - admin only."""
    from sqlalchemy import update
    stmt = update(User).where(User.id == user_id).values(is_active=False)
    res = await session.execute(stmt)
    if res.rowcount == 0:
        raise HTTPException(404, "User not found")
    await session.commit()
    return {"detail": "User deactivated"}

# System settings (placeholder - would need actual settings model)
@router.get("/settings", response_model=dict)
async def get_settings(
    _: User = Depends(require_admin)
):
    """Get system settings - admin only."""
    return {"message": "Settings functionality to be implemented"}

@router.post("/settings", response_model=dict)
async def update_settings(
    settings: dict,
    _: User = Depends(require_admin)
):
    """Update system settings - admin only."""
    return {"message": "Settings updated", "settings": settings}

# GDPR compliance
@router.get("/gdpr/export/{user_id}", response_model=dict)
async def export_user_data(
    user_id: int,
    session: AsyncSession = Depends(get_async_session),
    _: User = Depends(require_admin)
):
    """Export all user data for GDPR compliance - admin only."""
    user = await session.get(User, user_id)
    if not user:
        raise HTTPException(404, "User not found")
    
    # In a real implementation, this would collect all user data
    # from across the system
    return {
        "user_id": user_id,
        "message": "User data export would be generated here",
        "data": {
            "profile": {"email": user.email, "name": getattr(user, 'name', None)},
            "properties": "List of user's properties would be here",
            "bookings": "List of user's bookings would be here",
            "investments": "List of user's investments would be here"
        }
    }

@router.get("/gdpr/delete/{user_id}", response_model=dict)
async def delete_user_data(
    user_id: int,
    session: AsyncSession = Depends(get_async_session),
    _: User = Depends(require_admin)
):
    """Delete all user data for GDPR compliance - admin only."""
    user = await session.get(User, user_id)
    if not user:
        raise HTTPException(404, "User not found")
    
    # In a real implementation, this would delete/anonymize all user data
    # This is a dangerous operation and should have additional safeguards
    return {
        "user_id": user_id,
        "message": "User data deletion would be performed here (with proper safeguards)",
        "warning": "This is a destructive operation"
    }
