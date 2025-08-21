"""Short-term rental (BNB) core models."""
from __future__ import annotations

from datetime import datetime, date
from decimal import Decimal
from enum import Enum
from typing import Optional

from sqlalchemy import (
    Integer, String, Text, Date, DateTime, Numeric, Float, JSON,
    ForeignKey, Index, Boolean, Enum as SAEnum
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from ...config.database import Base


# Booking-related enums moved to domain.value_objects.booking_status
from domain.value_objects.booking_status import StListingType, CancellationPolicy, BookingStatus


class StListing(Base):
    __tablename__ = "st_listings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    host_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    type: Mapped[StListingType] = mapped_column(String(20), nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    bedrooms: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    beds: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    baths: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    nightly_price: Mapped[Decimal] = mapped_column(Numeric(12,2), nullable=False)
    cleaning_fee: Mapped[Optional[Decimal]] = mapped_column(Numeric(12,2), nullable=True)
    service_fee: Mapped[Optional[Decimal]] = mapped_column(Numeric(12,2), nullable=True)
    security_deposit: Mapped[Optional[Decimal]] = mapped_column(Numeric(12,2), nullable=True)
    address: Mapped[str] = mapped_column(String(500), nullable=False)
    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    amenities: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    rules: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    cancellation_policy: Mapped[CancellationPolicy] = mapped_column(String(20), nullable=False, default=CancellationPolicy.MODERATE)
    instant_book: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    min_nights: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    max_nights: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    images: Mapped[Optional[list]] = mapped_column(JSON, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    __table_args__ = (
        Index("ix_st_listings_host_id", "host_id"),
        Index("ix_st_listings_created_at", "created_at"),
    )


class StAvailability(Base):
    __tablename__ = "st_availability"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    listing_id: Mapped[int] = mapped_column(Integer, ForeignKey("st_listings.id", ondelete="CASCADE"), nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False)
    is_available: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    price_override: Mapped[Optional[Decimal]] = mapped_column(Numeric(12,2), nullable=True)
    min_nights_override: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    __table_args__ = (
        Index("ix_st_availability_listing_date", "listing_id", "date", unique=True),
    )


class StBooking(Base):
    __tablename__ = "st_bookings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    guest_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)
    listing_id: Mapped[int] = mapped_column(Integer, ForeignKey("st_listings.id", ondelete="CASCADE"), nullable=False)
    check_in: Mapped[date] = mapped_column(Date, nullable=False)
    check_out: Mapped[date] = mapped_column(Date, nullable=False)
    guests: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[BookingStatus] = mapped_column(String(20), nullable=False, default=BookingStatus.PENDING)
    amount_total: Mapped[Decimal] = mapped_column(Numeric(12,2), nullable=False)
    deposit_amount: Mapped[Optional[Decimal]] = mapped_column(Numeric(12,2), nullable=True)
    currency: Mapped[str] = mapped_column(String(10), nullable=False, default="KES")
    payment_auth_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    payment_capture_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    __table_args__ = (
        Index("ix_st_bookings_guest_id", "guest_id"),
        Index("ix_st_bookings_listing_id", "listing_id"),
        Index("ix_st_bookings_status", "status"),
    )


class StMessage(Base):
    __tablename__ = "st_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    booking_id: Mapped[int] = mapped_column(Integer, ForeignKey("st_bookings.id", ondelete="CASCADE"), nullable=False)
    sender_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        Index("ix_st_messages_booking_id", "booking_id"),
    )


class StPayout(Base):
    __tablename__ = "st_payouts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    host_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    booking_id: Mapped[int] = mapped_column(Integer, ForeignKey("st_bookings.id", ondelete="SET NULL"), nullable=True)
    amount: Mapped[Decimal] = mapped_column(Numeric(12,2), nullable=False)
    currency: Mapped[str] = mapped_column(String(10), nullable=False, default="KES")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="SCHEDULED")
    scheduled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    paid_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        Index("ix_st_payouts_host_id", "host_id"),
        Index("ix_st_payouts_status", "status"),
    )


class StTaxJurisdiction(Base):
    __tablename__ = "st_tax_jurisdictions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    rules: Mapped[dict] = mapped_column(JSON, nullable=True)


class StTaxRecord(Base):
    __tablename__ = "st_tax_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    booking_id: Mapped[int] = mapped_column(Integer, ForeignKey("st_bookings.id", ondelete="CASCADE"), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(12,2), nullable=False)
    breakdown: Mapped[dict] = mapped_column(JSON, nullable=True)



