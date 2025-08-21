"""Booking status and type constants."""

from enum import Enum


class BookingStatus(str, Enum):
    """Status options for all types of bookings."""
    
    PENDING = "PENDING"              # Booking created, awaiting confirmation
    CONFIRMED = "CONFIRMED"          # Booking confirmed and paid
    CANCELLED = "CANCELLED"          # Booking cancelled by user/host/admin
    COMPLETED = "COMPLETED"          # Booking completed successfully
    REFUNDED = "REFUNDED"           # Booking refunded
    EXPIRED = "EXPIRED"             # Booking expired (not confirmed in time)
    NO_SHOW = "NO_SHOW"            # Guest didn't show up
    IN_PROGRESS = "IN_PROGRESS"     # Currently active booking


class PaymentStatus(str, Enum):
    """Payment status for transactions."""
    
    PENDING = "PENDING"             # Payment initiated but not completed
    PROCESSING = "PROCESSING"       # Payment being processed
    COMPLETED = "COMPLETED"         # Payment successful
    FAILED = "FAILED"              # Payment failed
    CANCELLED = "CANCELLED"         # Payment cancelled by user
    REFUNDED = "REFUNDED"          # Payment refunded
    PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED"  # Partial refund issued


class RefundStatus(str, Enum):
    """Refund processing status."""
    
    REQUESTED = "REQUESTED"         # Refund requested
    APPROVED = "APPROVED"           # Refund approved
    PROCESSING = "PROCESSING"       # Refund being processed
    COMPLETED = "COMPLETED"         # Refund completed
    REJECTED = "REJECTED"          # Refund rejected
    FAILED = "FAILED"              # Refund failed


class BookingType(str, Enum):
    """Types of bookings supported by the platform."""
    
    BNB = "bnb"                    # Short-term rental booking
    TOUR = "tour"                  # Tour package booking
    VEHICLE = "vehicle"            # Vehicle rental booking
    PROPERTY = "property"          # Property purchase/investment
    BUNDLE = "bundle"              # Multi-service bundle booking


class CancellationPolicy(str, Enum):
    """Cancellation policies for bookings."""
    
    FLEXIBLE = "FLEXIBLE"          # Full refund until 24 hours before
    MODERATE = "MODERATE"          # Full refund until 5 days before
    STRICT = "STRICT"              # 50% refund until 7 days before
    SUPER_STRICT = "SUPER_STRICT"  # 50% refund until 30 days before
    NON_REFUNDABLE = "NON_REFUNDABLE"  # No refunds allowed


class PaymentMethod(str, Enum):
    """Supported payment methods."""
    
    MPESA = "mpesa"                # M-Pesa mobile money
    STRIPE = "stripe"              # Stripe credit/debit cards
    BANK_TRANSFER = "bank_transfer"  # Direct bank transfer
    CASH = "cash"                  # Cash payment
    CRYPTO = "crypto"              # Cryptocurrency (future)


class BookingSource(str, Enum):
    """Source of the booking."""
    
    WEB = "web"                    # Website booking
    MOBILE = "mobile"              # Mobile app booking
    API = "api"                    # Third-party API booking
    ADMIN = "admin"                # Admin panel booking
    PHONE = "phone"                # Phone/call center booking


# Status transition rules
BOOKING_STATUS_TRANSITIONS = {
    BookingStatus.PENDING: [
        BookingStatus.CONFIRMED,
        BookingStatus.CANCELLED,
        BookingStatus.EXPIRED
    ],
    BookingStatus.CONFIRMED: [
        BookingStatus.IN_PROGRESS,
        BookingStatus.CANCELLED,
        BookingStatus.NO_SHOW
    ],
    BookingStatus.IN_PROGRESS: [
        BookingStatus.COMPLETED,
        BookingStatus.CANCELLED
    ],
    BookingStatus.COMPLETED: [
        BookingStatus.REFUNDED
    ],
    BookingStatus.CANCELLED: [
        BookingStatus.REFUNDED
    ],
    # Terminal states (no transitions allowed)
    BookingStatus.REFUNDED: [],
    BookingStatus.EXPIRED: [],
    BookingStatus.NO_SHOW: []
}


def can_transition_status(from_status: BookingStatus, to_status: BookingStatus) -> bool:
    """
    Check if a status transition is allowed.
    
    Args:
        from_status: Current booking status
        to_status: Desired booking status
        
    Returns:
        True if transition is allowed
    """
    allowed_transitions = BOOKING_STATUS_TRANSITIONS.get(from_status, [])
    return to_status in allowed_transitions


def get_terminal_statuses() -> list[BookingStatus]:
    """
    Get list of terminal booking statuses (no further transitions).
    
    Returns:
        List of terminal statuses
    """
    return [
        status for status, transitions in BOOKING_STATUS_TRANSITIONS.items()
        if not transitions
    ]


def get_active_statuses() -> list[BookingStatus]:
    """
    Get list of active booking statuses.
    
    Returns:
        List of active statuses
    """
    return [
        BookingStatus.PENDING,
        BookingStatus.CONFIRMED,
        BookingStatus.IN_PROGRESS
    ]


def get_completed_statuses() -> list[BookingStatus]:
    """
    Get list of completed booking statuses.
    
    Returns:
        List of completed statuses
    """
    return [
        BookingStatus.COMPLETED,
        BookingStatus.CANCELLED,
        BookingStatus.REFUNDED,
        BookingStatus.NO_SHOW,
        BookingStatus.EXPIRED
    ]
