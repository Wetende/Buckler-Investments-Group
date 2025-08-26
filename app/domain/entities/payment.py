from dataclasses import dataclass
from datetime import datetime
from typing import Optional, Dict, Any
from decimal import Decimal
from .base import DomainEntity

@dataclass
class PaymentIntent(DomainEntity):
    intent_id: str
    amount: Decimal
    currency: str
    payment_method: str
    booking_id: int
    booking_type: str
    customer_id: int
    status: str
    metadata: Dict[str, Any]
    expires_at: Optional[datetime] = None

@dataclass
class Payment(DomainEntity):
    intent_id: str
    amount: Decimal
    currency: str
    payment_method: str
    booking_id: int
    booking_type: str
    customer_id: int
    status: str
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
    refund_id: str
    payment_id: str
    amount: Decimal
    currency: str
    status: str
    reason: str
    processed_at: Optional[datetime] = None
