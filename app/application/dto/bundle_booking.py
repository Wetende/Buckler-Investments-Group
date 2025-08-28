from pydantic import BaseModel
from datetime import datetime

from .bundle import MoneyDTO
from domain.entities.bundle_booking import BookingStatus

class CreateBundleBookingRequestDTO(BaseModel):
    bundle_id: int
    user_id: int # In a real app, this would come from auth token

class BundleBookingResponseDTO(BaseModel):
    id: int
    bundle_id: int
    user_id: int
    total_price: MoneyDTO
    status: BookingStatus
    booked_at: datetime

    model_config = {"from_attributes": True}

    @classmethod
    def from_entity(cls, entity) -> 'BundleBookingResponseDTO':
        """Convert BundleBooking entity to DTO"""
        return cls(
            id=entity.id,
            bundle_id=entity.bundle_id,
            user_id=entity.user_id,
            total_price=MoneyDTO(amount=entity.total_price.amount, currency=entity.total_price.currency),
            status=entity.status,
            booked_at=entity.booked_at
        )
