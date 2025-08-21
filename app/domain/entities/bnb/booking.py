from dataclasses import dataclass
from datetime import date
from ..base import DomainEntity
from ...value_objects.money import Money

@dataclass
class Booking(DomainEntity):
    guest_id: int
    listing_id: int
    check_in: date
    check_out: date
    guests: int
    total_amount: Money
    status: str
    
    def calculate_nights(self) -> int:
        return (self.check_out - self.check_in).days
    
    def can_be_cancelled(self) -> bool:
        """Business rule for cancellation"""
        return self.status in ["PENDING", "CONFIRMED"]
