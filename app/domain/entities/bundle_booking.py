from dataclasses import dataclass
from enum import Enum
from datetime import datetime

from .base import DomainEntity
from ..value_objects.money import Money

class BookingStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"

@dataclass
class BundleBooking(DomainEntity):
    bundle_id: int
    user_id: int
    total_price: Money
    status: BookingStatus = BookingStatus.PENDING
    booked_at: datetime = datetime.utcnow()
