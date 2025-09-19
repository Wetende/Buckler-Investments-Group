from dataclasses import dataclass
from datetime import date
from ..base import DomainEntity
from ...value_objects.money import Money
from ...value_objects.booking_status import BookingStatus

@dataclass
class Booking(DomainEntity):
    # Required fields with defaults to satisfy dataclass ordering
    guest_id: int = 0
    listing_id: int = 0
    check_in: date = None
    check_out: date = None
    guests: int = 1
    total_amount: Money = None
    status: BookingStatus = BookingStatus.PENDING
    
    def calculate_nights(self) -> int:
        return (self.check_out - self.check_in).days
    
    def can_be_cancelled(self) -> bool:
        """Business rule for cancellation"""
        return self.status in [BookingStatus.PENDING, BookingStatus.CONFIRMED]
