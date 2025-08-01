"""Admin dashboard statistics endpoints."""
from __future__ import annotations

from typing import Dict

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_async_session
from core.dependencies import require_admin
from models.user import User
from models.property import Property, PropertyStatus
from models.article import Article

router = APIRouter(prefix="/api/v1/admin/dashboard", tags=["Dashboard (Admin)"])


@router.get("/stats", response_model=Dict[str, int])
async def get_stats(
    session: AsyncSession = Depends(get_async_session),
    _: User = Depends(require_admin),
):
    """Return aggregate counts for dashboard cards."""
    user_count = await session.scalar(select(func.count()).select_from(User))
    property_count = await session.scalar(select(func.count()).select_from(Property))
    approved_count = await session.scalar(
        select(func.count()).select_from(Property).where(Property.status == PropertyStatus.APPROVED)
    )
    article_count = await session.scalar(select(func.count()).select_from(Article))

    return {
        "users": user_count or 0,
        "properties": property_count or 0,
        "approved_properties": approved_count or 0,
        "articles": article_count or 0,
    }
