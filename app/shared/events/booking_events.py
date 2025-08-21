"""Booking-related domain events."""

from dataclasses import dataclass
from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from .base import DomainEvent


@dataclass
class BookingCreatedEvent(DomainEvent):
    """Event raised when a new booking is created."""
    
    booking_id: int
    user_id: int
    booking_type: str  # 'bnb', 'tour', 'vehicle', 'property'
    item_id: int  # ID of the booked item
    total_amount: Decimal
    currency: str
    start_date: date
    end_date: Optional[date] = None
    participants: Optional[int] = None
    special_requirements: Optional[str] = None


@dataclass
class BookingConfirmedEvent(DomainEvent):
    """Event raised when a booking is confirmed."""
    
    booking_id: int
    user_id: int
    booking_type: str
    confirmation_code: str
    confirmed_at: datetime
    auto_confirmed: bool = False


@dataclass
class BookingCancelledEvent(DomainEvent):
    """Event raised when a booking is cancelled."""
    
    booking_id: int
    user_id: int
    booking_type: str
    cancelled_by: str  # 'guest', 'host', 'admin', 'system'
    cancellation_reason: Optional[str] = None
    refund_amount: Optional[Decimal] = None
    cancelled_at: datetime = None


@dataclass
class BookingCompletedEvent(DomainEvent):
    """Event raised when a booking is completed."""
    
    booking_id: int
    user_id: int
    booking_type: str
    completed_at: datetime
    rating_requested: bool = True


@dataclass
class BookingPaymentRequiredEvent(DomainEvent):
    """Event raised when payment is required for a booking."""
    
    booking_id: int
    user_id: int
    amount_due: Decimal
    currency: str
    due_date: datetime
    payment_methods: list = None


@dataclass
class BookingReminderEvent(DomainEvent):
    """Event raised for booking reminders."""
    
    booking_id: int
    user_id: int
    booking_type: str
    reminder_type: str  # 'check_in_tomorrow', 'review_request', etc.
    start_date: date
