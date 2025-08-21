"""Domain events for cross-cutting concerns and module communication."""

from .base import DomainEvent, EventHandler
from .booking_events import (
    BookingCreatedEvent,
    BookingConfirmedEvent,
    BookingCancelledEvent,
    BookingCompletedEvent,
)
from .payment_events import (
    PaymentInitiatedEvent,
    PaymentCompletedEvent,
    PaymentFailedEvent,
    RefundInitiatedEvent,
)
from .user_events import (
    UserRegisteredEvent,
    UserVerifiedEvent,
    UserProfileUpdatedEvent,
)

__all__ = [
    # Base
    "DomainEvent",
    "EventHandler",
    # Booking Events
    "BookingCreatedEvent",
    "BookingConfirmedEvent", 
    "BookingCancelledEvent",
    "BookingCompletedEvent",
    # Payment Events
    "PaymentInitiatedEvent",
    "PaymentCompletedEvent",
    "PaymentFailedEvent",
    "RefundInitiatedEvent",
    # User Events
    "UserRegisteredEvent",
    "UserVerifiedEvent",
    "UserProfileUpdatedEvent",
]
