from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional, Dict, Any
from decimal import Decimal
from enum import Enum

class PaymentMethod(str, Enum):
    MPESA = "mpesa"
    STRIPE = "stripe"
    BANK_TRANSFER = "bank_transfer"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"

class PaymentIntentRequestDTO(BaseModel):
    amount: Decimal = Field(..., gt=0)
    currency: str = Field("KES", max_length=3)
    payment_method: PaymentMethod
    booking_id: int
    booking_type: str = Field(..., description="bnb, tours, cars, or bundle")
    customer_id: int
    customer_email: str
    customer_phone: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    
    model_config = ConfigDict(from_attributes=True)

class PaymentIntentResponseDTO(BaseModel):
    payment_intent_id: str
    client_secret: Optional[str] = None  # For Stripe
    checkout_url: Optional[str] = None  # For M-Pesa or other redirects
    amount: Decimal
    currency: str
    status: PaymentStatus
    payment_method: PaymentMethod
    expires_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

class PaymentConfirmationDTO(BaseModel):
    payment_intent_id: str
    payment_method_id: Optional[str] = None  # For Stripe
    mpesa_checkout_request_id: Optional[str] = None  # For M-Pesa
    
    model_config = ConfigDict(from_attributes=True)

class PaymentStatusResponseDTO(BaseModel):
    payment_id: str
    payment_intent_id: str
    amount: Decimal
    currency: str
    status: PaymentStatus
    payment_method: PaymentMethod
    booking_id: int
    booking_type: str
    customer_id: int
    transaction_id: Optional[str] = None
    failure_reason: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

class RefundRequestDTO(BaseModel):
    payment_id: str
    amount: Optional[Decimal] = None  # If None, full refund
    reason: str = Field(..., min_length=3, max_length=500)
    
    model_config = ConfigDict(from_attributes=True)

class RefundResponseDTO(BaseModel):
    refund_id: str
    payment_id: str
    amount: Decimal
    currency: str
    status: str
    reason: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class WebhookEventDTO(BaseModel):
    event_type: str
    payment_intent_id: Optional[str] = None
    payment_id: Optional[str] = None
    data: Dict[str, Any]
    provider: str = Field(..., description="stripe, mpesa, etc.")
    
    model_config = ConfigDict(from_attributes=True)
