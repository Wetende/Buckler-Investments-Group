from dataclasses import dataclass
from datetime import date
from ..base import DomainEntity
from ...value_objects.money import Money

@dataclass
class TourBooking(DomainEntity):
    tour_id: int
    customer_id: int
    booking_date: date
    participants: int
    total_price: Money
    status: str
