"""Booking status value objects for domain layer."""
from enum import Enum


class BookingStatus(str, Enum):
    """Status options for all types of bookings."""
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    CANCELED = "CANCELED"
    COMPLETED = "COMPLETED"


class StListingType(str, Enum):
    """Short-term listing types."""
    ENTIRE = "ENTIRE"
    PRIVATE = "PRIVATE"
    SHARED = "SHARED"


class CancellationPolicy(str, Enum):
    """Cancellation policies for bookings."""
    FLEXIBLE = "FLEXIBLE"
    MODERATE = "MODERATE"
    STRICT = "STRICT"
