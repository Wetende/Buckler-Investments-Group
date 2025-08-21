"""User GDPR endpoints (export and delete)."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select

from infrastructure.config.database import get_async_session
from infrastructure.config.dependencies import current_active_user
from infrastructure.database.models.user import User

router = APIRouter(prefix="/api/v1/gdpr", tags=["GDPR"])


@router.get("/export", response_model=dict)
async def export_user_data(
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user),
):
    # Eager load relationships
    stmt = select(User).options(selectinload(User.favorites), selectinload(User.listings)).where(User.id == user.id)
    res = await session.execute(stmt)
    user = res.scalar_one()

    """Return user's data in JSON for portability."""
    # Gather data (basic example)
    data = {
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "phone": user.phone,
            "role": user.role,
        },
        "favorites": [f.property_id for f in user.favorites],  # loaded via relationship
        "properties": [p.id for p in user.listings],
    }
    return {"data": data}


@router.get("/delete", response_model=dict)
async def delete_account(
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user),
):
    """Deletes user and cascades (hard delete)."""
    await session.delete(user)
    await session.commit()
    return {"detail": "Account deleted"}
