from pydantic import BaseModel
from datetime import date
from typing import Optional
from ....domain.entities.tours import Tour, TourBooking
from ....domain.value_objects.money import Money

class SearchToursRequest(BaseModel):
    location: str
    start_date: date
    max_price: Optional[float] = None

class TourResponse(BaseModel):
    id: int
    name: str
    price: Money
    duration_hours: int

    class Config:
        arbitrary_types_allowed = True

    @classmethod
    def from_entity(cls, entity: Tour) -> "TourResponse":
        return cls(
            id=entity.id,
            name=entity.name,
            price=entity.price,
            duration_hours=entity.duration_hours
        )

class CreateTourBookingRequest(BaseModel):
    tour_id: int
    customer_id: int
    booking_date: date
    participants: int

class TourBookingResponse(BaseModel):
    id: int
    tour_id: int
    status: str
    total_price: Money

    class Config:
        arbitrary_types_allowed = True

    @classmethod
    def from_entity(cls, entity: TourBooking) -> "TourBookingResponse":
        return cls(
            id=entity.id,
            tour_id=entity.tour_id,
            status=entity.status,
            total_price=entity.total_price
        )
