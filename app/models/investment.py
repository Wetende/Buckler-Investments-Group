"""Investment hub models: products, nav, orders, positions, KYC."""
from __future__ import annotations

from datetime import datetime, date
from decimal import Decimal
from enum import Enum
from typing import Optional

from sqlalchemy import (
    Integer, String, Date, DateTime, Numeric, JSON, Boolean,
    ForeignKey, Index
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from core.database import Base


class OrderSide(str, Enum):
    BUY = "BUY"
    SELL = "SELL"


class OrderStatus(str, Enum):
    PENDING = "PENDING"
    SUBMITTED = "SUBMITTED"
    FILLED = "FILLED"
    CANCELED = "CANCELED"
    REJECTED = "REJECTED"


class KycStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class InvProduct(Base):
    __tablename__ = "inv_products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String(200), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    summary: Mapped[Optional[str]] = mapped_column(String(2000), nullable=True)
    min_invest: Mapped[Decimal] = mapped_column(Numeric(12,2), nullable=False)
    currency: Mapped[str] = mapped_column(String(10), nullable=False, default="KES")
    fee_schedule: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    disclosures_md: Mapped[Optional[str]] = mapped_column(String(10000), nullable=True)
    provider_ref: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class InvNavSnapshot(Base):
    __tablename__ = "inv_nav_snapshots"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey("inv_products.id", ondelete="CASCADE"), nullable=False)
    nav: Mapped[Decimal] = mapped_column(Numeric(12,4), nullable=False)
    nav_date: Mapped[date] = mapped_column(Date, nullable=False)
    source: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        Index("ix_nav_product_date", "product_id", "nav_date", unique=True),
    )


class InvOrder(Base):
    __tablename__ = "inv_orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey("inv_products.id", ondelete="RESTRICT"), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(12,2), nullable=False)
    currency: Mapped[str] = mapped_column(String(10), nullable=False, default="KES")
    side: Mapped[OrderSide] = mapped_column(String(10), nullable=False)
    status: Mapped[OrderStatus] = mapped_column(String(20), nullable=False, default=OrderStatus.PENDING)
    placed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    ext_ref: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    __table_args__ = (
        Index("ix_orders_user_id", "user_id"),
        Index("ix_orders_product_id", "product_id"),
        Index("ix_orders_status", "status"),
    )


class InvPosition(Base):
    __tablename__ = "inv_positions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey("inv_products.id", ondelete="CASCADE"), nullable=False)
    units: Mapped[Decimal] = mapped_column(Numeric(18,6), nullable=False)
    avg_cost: Mapped[Decimal] = mapped_column(Numeric(12,4), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    __table_args__ = (
        Index("ix_positions_user_id", "user_id"),
        Index("ix_positions_product_id", "product_id"),
    )


class KycRecord(Base):
    __tablename__ = "kyc_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    status: Mapped[KycStatus] = mapped_column(String(20), nullable=False, default=KycStatus.PENDING)
    data: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)



