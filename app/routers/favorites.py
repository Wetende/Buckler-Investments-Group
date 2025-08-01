from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_async_session
from core.dependencies import current_active_user
from models.favorite import Favorite
from models.property import Property
from models.user import User
from schemas.user import FavoriteCreate, FavoriteResponse  # Assume schemas exist or create simple ones
from typing import List

router = APIRouter(prefix="/api/v1/favorites", tags=["Favorites"])

@router.post("/", response_model=FavoriteResponse, status_code=status.HTTP_201_CREATED)
async def add_favorite(
    payload: FavoriteCreate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    # Check if property exists
    stmt = select(Property).where(Property.id == payload.property_id)
    res = await session.execute(stmt)
    prop = res.scalar_one_or_none()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")

    # Check if already favorited
    stmt_fav = select(Favorite).where(Favorite.user_id == user.id, Favorite.property_id == payload.property_id)
    res_fav = await session.execute(stmt_fav)
    if res_fav.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Already favorited")

    favorite = Favorite(user_id=user.id, property_id=payload.property_id)
    session.add(favorite)
    await session.commit()
    await session.refresh(favorite)
    return favorite 

@router.get("/", response_model=List[FavoriteResponse])
async def list_favorites(
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    stmt = select(Favorite).where(Favorite.user_id == user.id).order_by(Favorite.created_at.desc())
    res = await session.execute(stmt)
    favorites = res.scalars().all()
    return favorites

@router.get("/{property_id}/delete", response_model=dict)
async def delete_favorite(
    property_id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    stmt = select(Favorite).where(Favorite.user_id == user.id, Favorite.property_id == property_id)
    res = await session.execute(stmt)
    favorite = res.scalar_one_or_none()
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found")
    await session.delete(favorite)
    await session.commit()
    return {"detail": "Favorite removed"} 