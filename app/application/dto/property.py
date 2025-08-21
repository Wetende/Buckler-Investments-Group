"""
Pydantic schemas for Property management.
"""
from datetime import datetime
from decimal import Decimal
from typing import Optional, List

from pydantic import BaseModel, Field, constr, condecimal, conint, ConfigDict

from domain.value_objects.property_status import PropertyStatus


class MoneyDTO(BaseModel):
    """DTO for money values with currency."""
    amount: Decimal
    currency: str = "KES"


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
    price: Decimal
    address: str
    location: str
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    area_sqm: Optional[int] = None
    
    @classmethod
    def from_entity(cls, entity) -> 'PropertyResponseDTO':
        return cls(
            id=entity.id,
            title=entity.title,
            description=entity.description,
            price=entity.price.amount,
            address=entity.address,
            location=entity.location,
            bedrooms=entity.features.bedrooms if entity.features else None,
            bathrooms=entity.features.bathrooms if entity.features else None,
            area_sqm=entity.features.area_sqm if entity.features else None
        )


class CreatePropertyRequestDTO(BaseModel):
    title: str
    description: str
    price: Decimal
    address: str
    location: str
    property_type: str
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    area_sqm: Optional[int] = None
