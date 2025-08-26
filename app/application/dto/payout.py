from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional
from decimal import Decimal
from enum import Enum

class PayoutStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class PayoutMethod(str, Enum):
    MPESA = "mpesa"
    BANK_TRANSFER = "bank_transfer"
    PAYPAL = "paypal"

class PayoutRequestDTO(BaseModel):
    user_id: int
    amount: Decimal = Field(..., gt=0)
    currency: str = Field("KES", max_length=3)
    payout_method: PayoutMethod
    destination: str = Field(..., description="Phone number, bank account, or PayPal email")
    description: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

class PayoutResponseDTO(BaseModel):
    id: int
    user_id: int
    amount: Decimal
    currency: str
    status: PayoutStatus
    payout_method: PayoutMethod
    destination: str
    description: str
    requested_at: datetime
    processed_at: Optional[datetime] = None
    transaction_id: Optional[str] = None
    fee: Decimal
    failure_reason: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

class PayoutListResponseDTO(BaseModel):
    payouts: list[PayoutResponseDTO]
    total_count: int
    has_more: bool
    
    model_config = ConfigDict(from_attributes=True)
