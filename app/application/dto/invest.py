from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict

from infrastructure.database.models.investment import OrderSide, OrderStatus


class ProductRead(BaseModel):
    id: int
    slug: str
    name: str
    summary: Optional[str] = None
    min_invest: Decimal
    currency: str
    fee_schedule: Optional[dict] = None
    disclosures_md: Optional[str] = None
    provider_ref: Optional[str] = None
    is_active: bool
    model_config = ConfigDict(from_attributes=True)


class ProductCU(BaseModel):
    id: int = 0
    slug: Optional[str] = Field(None, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    name: str
    summary: Optional[str] = None
    min_invest: Decimal = Field(..., ge=0)
    currency: str = "KES"
    fee_schedule: Optional[dict] = None
    disclosures_md: Optional[str] = None
    provider_ref: Optional[str] = None
    is_active: bool = True


class NavSnapshotRead(BaseModel):
    id: int
    product_id: int
    nav: Decimal
    nav_date: date
    source: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class OrderCU(BaseModel):
    id: int = 0
    product_id: int
    amount: Decimal = Field(..., gt=0)
    currency: str = "KES"
    side: OrderSide


class OrderRead(BaseModel):
    id: int
    product_id: int
    amount: Decimal
    currency: str
    side: OrderSide
    status: OrderStatus
    placed_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class PositionRead(BaseModel):
    id: int
    product_id: int
    units: Decimal
    avg_cost: Decimal
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class KycCU(BaseModel):
    data: Optional[dict] = None


class KycRead(BaseModel):
    id: int
    status: str
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)



