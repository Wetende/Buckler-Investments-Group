"""
Pydantic schemas for Property management.
"""
from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Optional, List

from pydantic import BaseModel, Field, ConfigDict
from pydantic import field_serializer

from domain.value_objects.property_status import PropertyStatus


class MoneyDTO(BaseModel):
    """DTO for money values with currency."""
    amount: Decimal
    currency: str = "KES"

    @field_serializer('amount')
    def serialize_amount(self, v: Decimal) -> str:
        # Always render with two decimal places
        return f"{v:.2f}"


class PropertyFeaturesDTO(BaseModel):
    bedrooms: int
    bathrooms: float
    square_feet: int
    lot_size_acres: Optional[float] = None
    year_built: Optional[int] = None
    garage_spaces: Optional[int] = None


class PropertyBase(BaseModel):
    """Shared base fields for Property schemas."""

    title: str
    description: Optional[str] = None
    # Keep for public listing schema compatibility (not used by domain entity directly)
    price: Optional[Decimal] = None
    property_type_id: Optional[int] = None
    address: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    square_footage: Optional[int] = None
    amenities: Optional[dict] = None
    images: Optional[List[str]] = None
    meta_description: Optional[str] = None


class PropertyCreateUpdate(BaseModel):
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


# Use case DTOs
class SearchPropertiesRequestDTO(BaseModel):
    location: Optional[str] = None
    min_price: Optional[Decimal] = None
    max_price: Optional[Decimal] = None
    min_bedrooms: Optional[int] = None
    min_bathrooms: Optional[int] = None
    property_type: Optional[str] = None


class PropertyResponseDTO(BaseModel):
    id: int
    title: str
    description: str
    listing_price: MoneyDTO
    address: str
    status: str
    features: Optional[dict] = None

    @classmethod
    def from_entity(cls, entity) -> 'PropertyResponseDTO':
        return cls(
            id=entity.id,
            title=entity.title,
            description=entity.description,
            listing_price=MoneyDTO(amount=entity.listing_price.amount, currency=getattr(entity.listing_price, 'currency', 'KES')),
            address=entity.address,
            status=entity.status,
            features={
                "bedrooms": entity.features.bedrooms,
                "bathrooms": entity.features.bathrooms,
                "square_feet": entity.features.square_feet,
            } if getattr(entity, 'features', None) else None,
        )


class CreatePropertyRequestDTO(BaseModel):
    agent_id: int
    title: str
    description: str
    address: str
    listing_price: Decimal
    property_type: str
    features: PropertyFeaturesDTO
    image_urls: Optional[List[str]] = None
