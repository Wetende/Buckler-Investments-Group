"""Media upload endpoints for agents/landlords following GET/POST CRUD convention."""
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_async_session
from core.dependencies import require_agent_or_admin
from models import Property, Media
from models.user import User, UserRole
from schemas.media import MediaCreate, MediaResponse

router = APIRouter(prefix="/api/v1/media", tags=["Media"])


@router.post("/", response_model=MediaResponse, status_code=status.HTTP_201_CREATED)
async def create_or_update_media(
    payload: MediaCreate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(require_agent_or_admin),
):
    """Create (`id==0`) or update a Media record for a property the current agent owns.

    For simplicity, we receive the public URL directly in the payload rather than handling file storage.
    """
    # Validate property belongs to user unless admin
    stmt = select(Property).where(Property.id == payload.property_id)
    res = await session.execute(stmt)
    prop: Optional[Property] = res.scalar_one_or_none()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    if user.role != UserRole.ADMIN and prop.agent_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    if payload.id == 0:
        media = Media(
            property_id=payload.property_id,
            url=str(payload.url),
            type=payload.type,
        )
        session.add(media)
        await session.commit()
        await session.refresh(media)
        return media

    # Update existing
    stmt_media = select(Media).where(Media.id == payload.id)
    res_media = await session.execute(stmt_media)
    media: Optional[Media] = res_media.scalar_one_or_none()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    if user.role != UserRole.ADMIN and media.property.agent_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    media.url = str(payload.url)
    media.type = payload.type
    await session.commit()
    await session.refresh(media)
    return media


@router.get("/{media_id}/delete", response_model=dict)
async def delete_media(
    media_id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(require_agent_or_admin),
):
    # Eagerly load the property relationship to avoid lazy loading issues
    stmt = select(Media).options(selectinload(Media.property)).where(Media.id == media_id)
    res = await session.execute(stmt)
    media: Optional[Media] = res.scalar_one_or_none()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    if user.role != UserRole.ADMIN and media.property.agent_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    await session.delete(media)
    await session.commit()
    return {"detail": "Media deleted"}
