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
    # Required fields with defaults to satisfy dataclass ordering
    bundle_id: int = 0
    user_id: int = 0
    total_price: Money = None
    status: BookingStatus = BookingStatus.PENDING
    booked_at: datetime = None
