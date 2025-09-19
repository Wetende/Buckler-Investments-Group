from dataclasses import dataclass
from datetime import date
from ..base import DomainEntity
from ...value_objects.money import Money

@dataclass
class TourBooking(DomainEntity):
    # Required fields with defaults to satisfy dataclass ordering
    tour_id: int = 0
    customer_id: int = 0
    booking_date: date = None
    participants: int = 1
    total_price: Money = None
    status: str = "pending"
