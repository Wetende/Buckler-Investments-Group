"""Payment-related domain events."""

from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
from typing import Optional, Dict, Any

from .base import DomainEvent


@dataclass
class PaymentInitiatedEvent(DomainEvent):
    """Event raised when a payment is initiated."""
    
    payment_id: str
    booking_id: int
    user_id: int
    amount: Decimal
    currency: str
    payment_method: str  # 'mpesa', 'stripe', 'bank_transfer'
    payment_provider: str
    metadata: Optional[Dict[str, Any]] = None


@dataclass
class PaymentCompletedEvent(DomainEvent):
    """Event raised when a payment is successfully completed."""
    
    payment_id: str
    booking_id: int
    user_id: int
    amount: Decimal
    currency: str
    payment_method: str
    transaction_id: str
    completed_at: datetime
    fees_charged: Optional[Decimal] = None


@dataclass
class PaymentFailedEvent(DomainEvent):
    """Event raised when a payment fails."""
    
    payment_id: str
    booking_id: int
    user_id: int
    amount: Decimal
    currency: str
    payment_method: str
    failure_reason: str
    error_code: Optional[str] = None
    retry_allowed: bool = True


@dataclass
class RefundInitiatedEvent(DomainEvent):
    """Event raised when a refund is initiated."""
    
    refund_id: str
    original_payment_id: str
    booking_id: int
    user_id: int
    refund_amount: Decimal
    currency: str
    reason: str
    initiated_by: str  # 'user', 'admin', 'system'


@dataclass
class RefundCompletedEvent(DomainEvent):
    """Event raised when a refund is completed."""
    
    refund_id: str
    original_payment_id: str
    booking_id: int
    user_id: int
    refund_amount: Decimal
    currency: str
    completed_at: datetime
    transaction_id: str


@dataclass
class PaymentRetryEvent(DomainEvent):
    """Event raised when a payment retry is attempted."""
    
    payment_id: str
    booking_id: int
    user_id: int
    attempt_number: int
    max_attempts: int
    next_retry_at: Optional[datetime] = None
