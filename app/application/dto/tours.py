from pydantic import BaseModel, Field, ConfigDict
from datetime import date, datetime
from typing import Optional, List
from decimal import Decimal

# Search DTOs
class SearchToursRequest(BaseModel):
    location: str
    start_date: date
    max_price: Optional[float] = None

# Tour CRUD DTOs
class TourCreateUpdateDTO(BaseModel):
    id: int = Field(0, ge=0, description="0 for create, positive for update")
    name: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10, max_length=2000)
    price: Decimal = Field(..., gt=0)
    currency: str = Field("KES", max_length=3)
    duration_hours: int = Field(..., gt=0, le=24)
    max_participants: int = Field(..., gt=0, le=100)
    included_services: Optional[dict] = None
    operator_id: Optional[int] = None
    
    model_config = ConfigDict(from_attributes=True)

class TourResponseDTO(BaseModel):
    id: int
    name: str
    description: str
    price: Decimal
    currency: str
    duration_hours: int
    operator_id: int
    max_participants: int
    included_services: Optional[dict] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

# Tour categories
class TourCategoryDTO(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    tour_count: int = 0

# Legacy DTOs (keeping for compatibility)
class TourResponse(BaseModel):
    id: int
    name: str
    price: Decimal
    duration_hours: int

    @classmethod
    def from_entity(cls, entity) -> "TourResponse":
        return cls(
            id=entity.id,
            name=entity.name,
            price=entity.price.amount if hasattr(entity.price, 'amount') else entity.price,
            duration_hours=entity.duration_hours
        )

# Tour booking DTOs
class CreateTourBookingRequest(BaseModel):
    tour_id: int
    customer_id: int
    booking_date: date
    participants: int

class TourBookingCreateUpdateDTO(BaseModel):
    id: int = Field(0, ge=0)
    tour_id: int
    customer_id: int
    booking_date: date
    participants: int = Field(..., gt=0)
    special_requests: Optional[str] = None

class TourBookingResponseDTO(BaseModel):
    id: int
    tour_id: int
    customer_id: int
    booking_date: date
    participants: int
    total_price: Decimal
    currency: str
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

class TourBookingResponse(BaseModel):
    id: int
    tour_id: int
    status: str
    total_price: Decimal

    @classmethod
    def from_entity(cls, entity) -> "TourBookingResponse":
        return cls(
            id=entity.id,
            tour_id=entity.tour_id,
            status=entity.status,
            total_price=entity.total_price.amount if hasattr(entity.total_price, 'amount') else entity.total_price
        )

# Availability DTOs
class TourAvailabilityItem(BaseModel):
    date: date
    available_spots: int
    price_override: Optional[Decimal] = None

class TourAvailabilityDTO(BaseModel):
    tour_id: int
    items: List[TourAvailabilityItem]
