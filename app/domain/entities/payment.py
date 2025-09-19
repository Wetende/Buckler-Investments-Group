from dataclasses import dataclass
from datetime import datetime
from typing import Optional, Dict, Any
from decimal import Decimal
from .base import DomainEntity

@dataclass
class PaymentIntent(DomainEntity):
    # Required fields with defaults to satisfy dataclass ordering
    intent_id: str = ""
    amount: Decimal = Decimal("0")
    currency: str = "KES"
    payment_method: str = ""
    booking_id: int = 0
    booking_type: str = ""
    customer_id: int = 0
    status: str = "pending"
    metadata: Dict[str, Any] = None
    expires_at: Optional[datetime] = None

@dataclass
class Payment(DomainEntity):
    # Required fields with defaults to satisfy dataclass ordering
    intent_id: str = ""
    amount: Decimal = Decimal("0")
    currency: str = "KES"
    payment_method: str = ""
    booking_id: int = 0
    booking_type: str = ""
    customer_id: int = 0
    status: str = "pending"
    transaction_id: Optional[str] = None
    failure_reason: Optional[str] = None
    completed_at: Optional[datetime] = None
    metadata: Optional[Dict[str, Any]] = None
    
    def is_successful(self) -> bool:
        """Check if payment was successful"""
        return self.status == "completed"
    
    def can_be_refunded(self) -> bool:
        """Check if payment can be refunded"""
        return self.is_successful() and self.completed_at is not None

@dataclass  
class Refund(DomainEntity):
    # Required fields with defaults to satisfy dataclass ordering
    refund_id: str = ""
    payment_id: str = ""
    amount: Decimal = Decimal("0")
    currency: str = "KES"
    status: str = "pending"
    reason: str = ""
    processed_at: Optional[datetime] = None
