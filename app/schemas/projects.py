from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict


class ProjectRead(BaseModel):
    id: int
    slug: str
    name: str
    developer_id: int
    from_price: Optional[Decimal] = None
    from_price_usd: Optional[Decimal] = None
    handover_quarter: Optional[str] = None
    bedrooms_min: Optional[int] = None
    bedrooms_max: Optional[int] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    payment_plan: Optional[str] = None
    badges: Optional[dict] = None
    media: Optional[list] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProjectCU(BaseModel):
    id: int = 0
    slug: Optional[str] = Field(None, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    developer_id: int
    name: str = Field(..., min_length=2, max_length=200)
    from_price: Optional[Decimal] = Field(None, ge=0)
    handover_quarter: Optional[str] = Field(None, max_length=20)
    bedrooms_min: Optional[int] = Field(None, ge=0)
    bedrooms_max: Optional[int] = Field(None, ge=0)
    location: Optional[str] = Field(None, max_length=300)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    payment_plan: Optional[str] = Field(None, max_length=1000)
    badges: Optional[dict] = None
    media: Optional[list] = None


class PaginatedProjects(BaseModel):
    items: List[ProjectRead]
    cursor: Optional[str] = None
    has_more: bool



