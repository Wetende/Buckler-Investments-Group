from __future__ import annotations

from datetime import date
from decimal import Decimal
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_async_session
from core.dependencies import current_active_user
from models import (
    StListing,
    StAvailability,
    StBooking,
    StMessage,
    StListingType,
    BookingStatus,
)
from models.user import User, UserRole
from schemas.bnb import (
    StListingRead,
    StListingCU,
    AvailabilityUpsert,
    BookingCU,
    BookingRead,
    MessageCU,
    MessageRead,
)


router = APIRouter(tags=["BNB"])


# ---------------------------------------------------------------------
# Public – Search, Listing Detail, Availability
# ---------------------------------------------------------------------
@router.get("/api/v1/public/bnb", response_model=List[StListingRead])
async def search_bnb(
    check_in: Optional[date] = None,
    check_out: Optional[date] = None,
    guests: Optional[int] = Query(None, ge=1),
    type: Optional[StListingType] = None,
    price_min: Optional[Decimal] = None,
    price_max: Optional[Decimal] = None,
    instant_book: Optional[bool] = None,
    page_size: int = Query(20, ge=1, le=100),
    session: AsyncSession = Depends(get_async_session),
):
    conditions = []
    if guests is not None:
        conditions.append(StListing.capacity >= guests)
    if type is not None:
        conditions.append(StListing.type == type)
    if price_min is not None:
        conditions.append(StListing.nightly_price >= price_min)
    if price_max is not None:
        conditions.append(StListing.nightly_price <= price_max)
    if instant_book is not None:
        conditions.append(StListing.instant_book == instant_book)

    stmt = (
        select(StListing)
        .where(and_(*conditions))
        .order_by(StListing.created_at.desc())
        .limit(page_size)
    )
    res = await session.execute(stmt)
    listings = res.scalars().all()

    # If date range provided, filter by availability table (simple all-days available check)
    if check_in and check_out and check_in < check_out:
        filtered = []
        for l in listings:
            avail_stmt = select(StAvailability).where(
                and_(
                    StAvailability.listing_id == l.id,
                    StAvailability.date >= check_in,
                    StAvailability.date < check_out,
                    StAvailability.is_available == True,
                )
            )
            avail_res = await session.execute(avail_stmt)
            days = avail_res.scalars().all()
            expected_days = (check_out - check_in).days
            if len(days) >= expected_days:
                filtered.append(l)
        listings = filtered

    return [StListingRead.model_validate(l) for l in listings]


@router.get("/api/v1/public/bnb/{id}", response_model=StListingRead)
async def get_bnb_listing(id: int, session: AsyncSession = Depends(get_async_session)):
    res = await session.execute(select(StListing).where(StListing.id == id))
    listing = res.scalar_one_or_none()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return StListingRead.model_validate(listing)


@router.get("/api/v1/public/bnb/{id}/availability", response_model=List[dict])
async def get_availability(
    id: int,
    start: Optional[date] = None,
    end: Optional[date] = None,
    session: AsyncSession = Depends(get_async_session),
):
    q = select(StAvailability).where(StAvailability.listing_id == id)
    if start:
        q = q.where(StAvailability.date >= start)
    if end:
        q = q.where(StAvailability.date <= end)
    q = q.order_by(StAvailability.date.asc()).limit(62)
    res = await session.execute(q)
    rows = res.scalars().all()
    return [
        {
            "date": r.date.isoformat(),
            "is_available": r.is_available,
            "price_override": str(r.price_override) if r.price_override is not None else None,
            "min_nights_override": r.min_nights_override,
        }
        for r in rows
    ]


# ---------------------------------------------------------------------
# Host – Listings & Calendar
# ---------------------------------------------------------------------
@router.post("/api/v1/host/bnb/listings", response_model=StListingRead)
async def upsert_listing(
    payload: StListingCU,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user),
):
    if payload.id == 0:
        listing = StListing(
            host_id=user.id,
            **payload.model_dump(exclude={"id"}, exclude_none=True),
        )
        session.add(listing)
        await session.commit()
        await session.refresh(listing)
        return listing

    res = await session.execute(select(StListing).where(StListing.id == payload.id))
    listing: Optional[StListing] = res.scalar_one_or_none()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing.host_id != user.id and user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not allowed")
    for k, v in payload.model_dump(exclude_unset=True, exclude={"id"}).items():
        setattr(listing, k, v)
    await session.commit()
    await session.refresh(listing)
    return listing


@router.get("/api/v1/host/bnb/listings", response_model=List[StListingRead])
async def my_listings(
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user),
):
    res = await session.execute(select(StListing).where(StListing.host_id == user.id))
    return res.scalars().all()


@router.get("/api/v1/host/bnb/listings/{id}/delete", response_model=dict)
async def delete_listing(
    id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user),
):
    res = await session.execute(select(StListing).where(StListing.id == id))
    listing: Optional[StListing] = res.scalar_one_or_none()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing.host_id != user.id and user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not allowed")
    await session.delete(listing)
    await session.commit()
    return {"detail": "Listing deleted"}


@router.post("/api/v1/host/bnb/calendar", response_model=dict)
async def bulk_upsert_availability(
    payload: AvailabilityUpsert,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user),
):
    listing = (
        await session.execute(select(StListing).where(StListing.id == payload.listing_id))
    ).scalar_one_or_none()
    if not listing or (listing.host_id != user.id and user.role != UserRole.ADMIN):
        return {"detail": "Not allowed"}
    for item in payload.items:
        row = (
            await session.execute(
                select(StAvailability).where(
                    StAvailability.listing_id == payload.listing_id,
                    StAvailability.date == item.date,
                )
            )
        ).scalar_one_or_none()
        if row is None:
            row = StAvailability(
                listing_id=payload.listing_id,
                date=item.date,
                is_available=item.is_available,
                price_override=item.price_override,
                min_nights_override=item.min_nights_override,
            )
            session.add(row)
        else:
            row.is_available = item.is_available
            row.price_override = item.price_override
            row.min_nights_override = item.min_nights_override
    await session.commit()
    return {"detail": "Calendar updated"}


# ---------------------------------------------------------------------
# Bookings – Create/Update, Cancel
# ---------------------------------------------------------------------
@router.post("/api/v1/bnb/bookings", response_model=BookingRead)
async def create_or_update_booking(
    payload: BookingCU,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user),
):
    listing = (
        await session.execute(select(StListing).where(StListing.id == payload.listing_id))
    ).scalar_one_or_none()
    if not listing:
        raise HTTPException(status_code=400, detail="Invalid listing")
    if payload.check_in >= payload.check_out:
        raise HTTPException(status_code=400, detail="Invalid date range")
    nights = (payload.check_out - payload.check_in).days
    if listing.min_nights and nights < listing.min_nights:
        raise HTTPException(status_code=400, detail="Below min nights")
    if listing.max_nights and nights > listing.max_nights:
        raise HTTPException(status_code=400, detail="Above max nights")

    q = select(StAvailability).where(
        and_(
            StAvailability.listing_id == payload.listing_id,
            StAvailability.date >= payload.check_in,
            StAvailability.date < payload.check_out,
            StAvailability.is_available == True,
        )
    )
    res = await session.execute(q)
    rows = res.scalars().all()
    if len(rows) < nights:
        raise HTTPException(status_code=409, detail="Dates not available")
    nightly_overrides: list[Decimal] = [r.price_override or listing.nightly_price for r in rows]
    total = sum(nightly_overrides)
    if listing.cleaning_fee:
        total += listing.cleaning_fee
    if listing.service_fee:
        total += listing.service_fee

    if payload.id == 0:
        booking = StBooking(
            guest_id=user.id,
            listing_id=payload.listing_id,
            check_in=payload.check_in,
            check_out=payload.check_out,
            guests=payload.guests,
            status=BookingStatus.CONFIRMED if listing.instant_book else BookingStatus.PENDING,
            amount_total=total,
            currency="KES",
        )
        session.add(booking)
        await session.commit()
        await session.refresh(booking)
        return booking

    existing = (
        await session.execute(select(StBooking).where(StBooking.id == payload.id))
    ).scalar_one_or_none()
    if not existing or existing.guest_id != user.id:
        raise HTTPException(status_code=404, detail="Booking not found")
    existing.check_in = payload.check_in
    existing.check_out = payload.check_out
    existing.guests = payload.guests
    existing.amount_total = total
    await session.commit()
    await session.refresh(existing)
    return existing


@router.get("/api/v1/bnb/bookings/{id}/cancel", response_model=BookingRead)
async def cancel_booking(
    id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user),
):
    booking = (
        await session.execute(select(StBooking).where(StBooking.id == id))
    ).scalar_one_or_none()
    if not booking or booking.guest_id != user.id:
        raise HTTPException(status_code=404, detail="Booking not found")
    booking.status = BookingStatus.CANCELED
    await session.commit()
    await session.refresh(booking)
    return booking


# ---------------------------------------------------------------------
# Messaging – List/Send per booking
# ---------------------------------------------------------------------
@router.get("/api/v1/bnb/bookings/{id}/messages", response_model=List[MessageRead])
async def list_messages(
    id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user),
):
    booking = (
        await session.execute(select(StBooking).where(StBooking.id == id))
    ).scalar_one_or_none()
    if not booking or (user.id not in [booking.guest_id]):
        raise HTTPException(status_code=404, detail="Booking not found")
    res = await session.execute(
        select(StMessage).where(StMessage.booking_id == id).order_by(StMessage.created_at.asc())
    )
    return res.scalars().all()


@router.post("/api/v1/bnb/bookings/{id}/messages", response_model=MessageRead)
async def send_message(
    id: int,
    payload: MessageCU,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user),
):
    booking = (
        await session.execute(select(StBooking).where(StBooking.id == id))
    ).scalar_one_or_none()
    if not booking or (user.id not in [booking.guest_id]):
        raise HTTPException(status_code=404, detail="Booking not found")
    msg = StMessage(booking_id=id, sender_id=user.id, body=payload.body)
    session.add(msg)
    await session.commit()
    await session.refresh(msg)
    return msg


