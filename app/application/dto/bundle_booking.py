from pydantic import BaseModel
from datetime import datetime

from .bundle import MoneyDTO
from ...domain.entities.bundle_booking import BookingStatus

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

    class Config:
        from_attributes = True
