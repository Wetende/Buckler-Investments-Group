from __future__ import annotations

from decimal import Decimal
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from infrastructure.config.database import get_async_session
from infrastructure.config.dependencies import current_active_user, require_admin
from infrastructure.database.models import (
    InvProduct,
    InvNavSnapshot,
    InvOrder,
    InvPosition,
    KycRecord,
)
from infrastructure.database.models.investment import OrderStatus, KycStatus
from infrastructure.database.models.user import User
from application.dto.invest import (
    ProductRead,
    ProductCU,
    NavSnapshotRead,
    OrderCU,
    OrderRead,
    PositionRead,
    KycCU,
    KycRead,
)


router = APIRouter(tags=["Investment"])


# Public catalog ---------------------------------------------------------------
@router.get("/api/v1/public/invest/products", response_model=List[ProductRead])
async def list_products(
    active: Optional[bool] = Query(None),
    max_min_invest: Optional[Decimal] = None,
    session: AsyncSession = Depends(get_async_session),
):
    stmt = select(InvProduct)
    if active is not None:
        stmt = stmt.where(InvProduct.is_active == active)
    if max_min_invest is not None:
        stmt = stmt.where(InvProduct.min_invest <= max_min_invest)
    stmt = stmt.order_by(InvProduct.created_at.desc())
    res = await session.execute(stmt)
    return res.scalars().all()


@router.get("/api/v1/public/invest/products/{slug}", response_model=ProductRead)
async def get_product(slug: str, session: AsyncSession = Depends(get_async_session)):
    res = await session.execute(select(InvProduct).where(InvProduct.slug == slug))
    product = res.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# Investor flows ---------------------------------------------------------------
@router.post("/api/v1/invest/orders", response_model=OrderRead)
async def place_or_update_order(
    payload: OrderCU,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user),
):
    kyc = (await session.execute(select(KycRecord).where(KycRecord.user_id == user.id))).scalar_one_or_none()
    if not kyc or kyc.status != KycStatus.APPROVED:
        raise HTTPException(status_code=403, detail="KYC not approved")

    product = (await session.execute(select(InvProduct).where(InvProduct.id == payload.product_id))).scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=400, detail="Invalid product")

    if payload.id == 0:
        order = InvOrder(
            user_id=user.id,
            product_id=payload.product_id,
            amount=payload.amount,
            currency=payload.currency,
            side=payload.side,
            status=OrderStatus.SUBMITTED,
        )
        session.add(order)
        await session.commit()
        await session.refresh(order)
        return order

    existing = (await session.execute(select(InvOrder).where(InvOrder.id == payload.id, InvOrder.user_id == user.id))).scalar_one_or_none()
    if not existing:
        raise HTTPException(status_code=404, detail="Order not found")
    existing.amount = payload.amount
    existing.currency = payload.currency
    existing.side = payload.side
    await session.commit()
    await session.refresh(existing)
    return existing


@router.get("/api/v1/invest/orders", response_model=List[OrderRead])
async def list_orders(session: AsyncSession = Depends(get_async_session), user: User = Depends(current_active_user)):
    res = await session.execute(select(InvOrder).where(InvOrder.user_id == user.id).order_by(InvOrder.placed_at.desc()))
    return res.scalars().all()


@router.get("/api/v1/invest/positions", response_model=List[PositionRead])
async def list_positions(session: AsyncSession = Depends(get_async_session), user: User = Depends(current_active_user)):
    res = await session.execute(select(InvPosition).where(InvPosition.user_id == user.id))
    return res.scalars().all()


@router.post("/api/v1/invest/kyc", response_model=KycRead)
async def submit_kyc(payload: KycCU, session: AsyncSession = Depends(get_async_session), user: User = Depends(current_active_user)):
    rec = (await session.execute(select(KycRecord).where(KycRecord.user_id == user.id))).scalar_one_or_none()
    if rec is None:
        rec = KycRecord(user_id=user.id, status=KycStatus.PENDING, data=payload.data or {})
        session.add(rec)
    else:
        rec.data = payload.data or {}
        rec.status = KycStatus.PENDING
    await session.commit()
    await session.refresh(rec)
    return rec


# Admin – products & nav snapshots -------------------------------------------
@router.post("/api/v1/admin/invest/products", response_model=ProductRead)
async def upsert_product(payload: ProductCU, session: AsyncSession = Depends(get_async_session), _: object = Depends(require_admin)):
    if payload.id == 0:
        slug = payload.slug or payload.name.lower().replace(" ", "-")
        exists = (await session.execute(select(InvProduct).where(InvProduct.slug == slug))).scalar_one_or_none()
        if exists:
            raise HTTPException(status_code=409, detail="Slug exists")
        p = InvProduct(**payload.model_dump(exclude={"id"}, exclude_none=True), slug=slug)
        session.add(p)
        await session.commit()
        await session.refresh(p)
        return p
    p = (await session.execute(select(InvProduct).where(InvProduct.id == payload.id))).scalar_one_or_none()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    for k, v in payload.model_dump(exclude_unset=True, exclude={"id"}).items():
        setattr(p, k, v)
    await session.commit()
    await session.refresh(p)
    return p


@router.get("/api/v1/admin/invest/products/{id}/delete", response_model=dict)
async def delete_product(id: int, session: AsyncSession = Depends(get_async_session), _: object = Depends(require_admin)):
    p = (await session.execute(select(InvProduct).where(InvProduct.id == id))).scalar_one_or_none()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    await session.delete(p)
    await session.commit()
    return {"detail": "Product deleted"}


@router.post("/api/v1/admin/invest/nav-snapshots", response_model=NavSnapshotRead)
async def upsert_nav_snapshot(product_id: int, nav: float, nav_date: str, session: AsyncSession = Depends(get_async_session), _: object = Depends(require_admin)):
    snap = InvNavSnapshot(product_id=product_id, nav=nav, nav_date=nav_date)
    session.add(snap)
    await session.commit()
    await session.refresh(snap)
    return snap


@router.get("/api/v1/admin/invest/nav-snapshots", response_model=List[NavSnapshotRead])
async def list_nav_snapshots(session: AsyncSession = Depends(get_async_session), _: object = Depends(require_admin)):
    res = await session.execute(select(InvNavSnapshot).order_by(InvNavSnapshot.nav_date.desc()))
    return res.scalars().all()



