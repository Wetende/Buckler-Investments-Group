"""
Pydantic schemas for Property management.
"""
from datetime import datetime
from decimal import Decimal
from typing import Optional, List

from pydantic import BaseModel, Field, constr, condecimal, conint, ConfigDict

from models.property import PropertyStatus


class PropertyBase(BaseModel):
    """Shared base fields for Property schemas."""

    title: constr(max_length=200)
    description: Optional[str] = None
    price: condecimal(max_digits=12, decimal_places=2, ge=0)
    property_type_id: int
    address: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    bedrooms: Optional[conint(ge=0)] = None
    bathrooms: Optional[conint(ge=0)] = None
    square_footage: Optional[conint(ge=0)] = None
    amenities: Optional[dict] = None
    images: Optional[List[str]] = None
    meta_description: Optional[constr(max_length=160)] = None


class PropertyCreateUpdate(PropertyBase):
    """Schema for create/update property requests according to CRUD convention."""

    id: int = Field(0, description="0 for create, actual id for update")
    status: Optional[PropertyStatus] = PropertyStatus.PENDING_APPROVAL
    slug: Optional[str] = None  # Slug will be generated server-side if absent


class PropertyDetailResponse(PropertyBase):
    """Detailed property response schema."""

    id: int
    agent_id: int
    status: PropertyStatus
    slug: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PropertySummaryResponse(BaseModel):
    """Summary schema for list endpoint."""

    id: int
    title: str
    price: Decimal
    address: str
    main_image_url: Optional[str] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)
