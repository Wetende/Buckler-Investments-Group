from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from decimal import Decimal
from datetime import datetime
from models.property import PropertyStatus

class PropertySummaryResponse(BaseModel):
    id: int
    title: str
    price: Decimal
    address: str
    main_image_url: Optional[str] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)

class PaginatedPropertyResponse(BaseModel):
    items: List[PropertySummaryResponse]
    cursor: Optional[str] = None
    has_more: bool

class PropertyCreateUpdate(BaseModel):
    id: int = 0
    title: str = Field(..., min_length=3, max_length=200)
    description: Optional[str] = None
    price: Decimal = Field(..., gt=0)
    property_type_id: int
    status: PropertyStatus
    address: str = Field(..., min_length=10, max_length=500)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    bedrooms: Optional[int] = Field(None, ge=0)
    bathrooms: Optional[int] = Field(None, ge=0)
    square_footage: Optional[int] = Field(None, ge=0)
    amenities: Optional[dict] = None
    images: Optional[list] = None

class PropertyDetailResponse(PropertySummaryResponse):
    description: Optional[str] = None
    status: PropertyStatus
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    amenities: Optional[dict] = None
    images: Optional[list] = None
    agent_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
