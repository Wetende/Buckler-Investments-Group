"""User profile endpoints (view & update own profile)."""
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from core.database import get_async_session
from core.dependencies import current_active_user
from models.user import User
from schemas.user import UserRead, UserUpdate

router = APIRouter(prefix="/api/v1/profile", tags=["Profile"])


@router.get("/", response_model=UserRead)
async def get_my_profile(user: User = Depends(current_active_user)):
    """Return the currently authenticated user's profile."""
    return user


@router.post("/", response_model=UserRead)
async def update_my_profile(
    payload: UserUpdate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user),
):
    """Update current user's profile following POST convention."""
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(user, field, value)

    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user
