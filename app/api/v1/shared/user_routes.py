"""
User management routes - Administrative user management endpoints.

Note: User registration and profile management have been moved to /auth endpoints.
This module now focuses on administrative user management functions.
"""
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from application.dto.user import UserRead
from infrastructure.config.database import get_async_session
from infrastructure.config.dependencies import current_active_user
from domain.entities.user import User

router = APIRouter()

# Note: The following endpoints have been moved to /auth for better organization:
# - POST / (user registration) -> moved to POST /auth/register
# - GET /me (current user profile) -> moved to GET /auth/me

@router.get("/profile", response_model=UserRead)
async def get_profile(
    user: User = Depends(current_active_user)
):
    """Get user profile (legacy endpoint - consider using /auth/me instead)."""
    return user

@router.post("/profile", response_model=UserRead)
async def update_profile(
    payload: UserRead,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """Update user profile (legacy endpoint)."""
    for field, value in payload.model_dump(exclude={"id"}).items():
        if value is not None:
            setattr(user, field, value)
    await session.commit()
    await session.refresh(user)
    return user

# TODO: Add administrative user management endpoints here
# - List all users (admin only)
# - Update user roles (admin only)  
# - Deactivate/reactivate users (admin only)
# - User search and filtering (admin only)
