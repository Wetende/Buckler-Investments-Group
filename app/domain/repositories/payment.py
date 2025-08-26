from abc import abstractmethod
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from .base import BaseRepository
from ..entities.payment import Payment, PaymentIntent

class PaymentRepository(BaseRepository[Payment]):
    @abstractmethod
    async def create_payment_intent(
        self,
        intent_id: str,
        amount: Decimal,
        currency: str,
        payment_method: str,
        booking_id: int,
        booking_type: str,
        customer_id: int,
        status: str,
        metadata: dict
    ) -> PaymentIntent:
        pass
    
    @abstractmethod
    async def get_payment_intent(self, intent_id: str) -> Optional[PaymentIntent]:
        pass
    
    @abstractmethod
    async def update_payment_status(
        self,
        intent_id: str,
        status: str,
        transaction_id: Optional[str] = None,
        failure_reason: Optional[str] = None
    ) -> None:
        pass
    
    @abstractmethod
    async def get_payment_by_id(self, payment_id: str) -> Optional[Payment]:
        pass
    
    @abstractmethod
    async def get_payments_by_booking(self, booking_id: int, booking_type: str) -> List[Payment]:
        pass
    
    @abstractmethod
    async def get_payments_by_customer(self, customer_id: int) -> List[Payment]:
        pass
