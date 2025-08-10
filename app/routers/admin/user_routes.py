"""Admin user management routes.

All CRUD handled via GET/POST as per project conventions:
- POST /users (id==0) -> create
- POST /users (id>0) -> update
- GET /users -> list
- GET /users/{id} -> retrieve
- GET /users/{id}/deactivate -> deactivate
"""
from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_async_session
from core.dependencies import require_admin
from models.user import User, UserRole
from schemas.user import AdminUserCreateUpdate, UserRead

router = APIRouter(prefix="/api/v1/admin/users", tags=["Users"])


@router.get("/", response_model=List[UserRead])
async def list_users(
    session: AsyncSession = Depends(get_async_session),
    _: User = Depends(require_admin),
):
    res = await session.execute(select(User))
    return res.scalars().all()


@router.get("/{user_id}", response_model=UserRead)
async def get_user(
    user_id: int,
    session: AsyncSession = Depends(get_async_session),
    _: User = Depends(require_admin),
):
    res = await session.execute(select(User).where(User.id == user_id))
    user = res.scalar_one_or_none()
    if user is None:
        raise HTTPException(404, "User not found")
    return user


@router.post("/", response_model=UserRead)
async def create_or_update_user(
    payload: AdminUserCreateUpdate,
    session: AsyncSession = Depends(get_async_session),
    _: User = Depends(require_admin),
):
    """Create (id==0) or update (id>0) a user."""
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


@router.get("/{user_id}/deactivate", response_model=dict)
async def deactivate_user(
    user_id: int,
    session: AsyncSession = Depends(get_async_session),
    _: User = Depends(require_admin),
):
    stmt = update(User).where(User.id == user_id).values(is_active=False)
    res = await session.execute(stmt)
    if res.rowcount == 0:
        raise HTTPException(404, "User not found")
    await session.commit()
    return {"detail": "User deactivated"}
