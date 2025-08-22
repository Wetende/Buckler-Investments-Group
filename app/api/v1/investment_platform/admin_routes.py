"""
Admin investment routes - requires admin authentication.

Consolidated from:
- invest.py (admin endpoints)
"""
from __future__ import annotations

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from infrastructure.config.database import get_async_session
from infrastructure.config.dependencies import require_admin
from infrastructure.database.models import InvProduct, InvNavSnapshot
from infrastructure.database.models.user import User
from application.dto.invest import ProductCU, ProductRead, NavSnapshotRead

router = APIRouter()

# Product management
@router.post("/products", response_model=ProductRead)
async def create_or_update_product(
    payload: ProductCU,
    session: AsyncSession = Depends(get_async_session),
    _: User = Depends(require_admin),
):
    """Create (id==0) or update (id>0) an investment product - admin only."""
    if payload.id == 0:
        new_product = InvProduct(**payload.model_dump(exclude={"id"}))
        session.add(new_product)
        await session.commit()
        await session.refresh(new_product)
        return new_product
    
    product = (await session.execute(select(InvProduct).where(InvProduct.id == payload.id))).scalar_one_or_none()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    for field, value in payload.model_dump(exclude={"id"}).items():
        if value is not None:
            setattr(product, field, value)
    
    await session.commit()
    await session.refresh(product)
    return product

# Delete product
@router.get("/products/{id}/delete", response_model=dict)
async def delete_product(
    id: int,
    session: AsyncSession = Depends(get_async_session),
    _: User = Depends(require_admin),
):
    """Delete an investment product - admin only."""
    product = (await session.execute(select(InvProduct).where(InvProduct.id == id))).scalar_one_or_none()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    await session.delete(product)
    await session.commit()
    return {"detail": "Product deleted"}

# NAV snapshot management
@router.post("/nav-snapshots", response_model=NavSnapshotRead)
async def create_nav_snapshot(
    payload: NavSnapshotRead,
    session: AsyncSession = Depends(get_async_session),
    _: User = Depends(require_admin),
):
    """Create a NAV snapshot - admin only."""
    new_snapshot = InvNavSnapshot(**payload.model_dump(exclude={"id"}))
    session.add(new_snapshot)
    await session.commit()
    await session.refresh(new_snapshot)
    return new_snapshot

# List NAV snapshots
@router.get("/nav-snapshots", response_model=List[NavSnapshotRead])
async def list_nav_snapshots(
    session: AsyncSession = Depends(get_async_session),
    _: User = Depends(require_admin),
):
    """List NAV snapshots - admin only."""
    stmt = select(InvNavSnapshot).order_by(InvNavSnapshot.created_at.desc())
    res = await session.execute(stmt)
    return res.scalars().all()

