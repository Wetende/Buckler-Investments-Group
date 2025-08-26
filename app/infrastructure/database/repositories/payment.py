from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from domain.repositories.payment import PaymentRepository
from domain.entities.payment import Payment, PaymentIntent, Refund
from infrastructure.database.models.payment import PaymentModel, PaymentIntentModel, RefundModel
from shared.mappers.payment import PaymentMapper


class SqlAlchemyPaymentRepository(PaymentRepository):
    """SQLAlchemy implementation of PaymentRepository"""
    
    def __init__(self, session: AsyncSession):
        self._session = session

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
        """Create a new payment intent"""
        model = PaymentIntentModel(
            intent_id=intent_id,
            amount=amount,
            currency=currency,
            payment_method=payment_method,
            booking_id=booking_id,
            booking_type=booking_type,
            customer_id=customer_id,
            status=status,
            metadata=metadata
        )
        
        self._session.add(model)
        await self._session.commit()
        await self._session.refresh(model)
        
        return PaymentMapper.intent_model_to_entity(model)

    async def get_payment_intent(self, intent_id: str) -> Optional[PaymentIntent]:
        """Get payment intent by intent_id"""
        result = await self._session.execute(
            select(PaymentIntentModel).where(PaymentIntentModel.intent_id == intent_id)
        )
        model = result.scalar_one_or_none()
        return PaymentMapper.intent_model_to_entity(model) if model else None

    async def update_payment_status(
        self,
        intent_id: str,
        status: str,
        transaction_id: Optional[str] = None,
        failure_reason: Optional[str] = None
    ) -> None:
        """Update payment intent status"""
        result = await self._session.execute(
            select(PaymentIntentModel).where(PaymentIntentModel.intent_id == intent_id)
        )
        model = result.scalar_one_or_none()
        
        if model:
            model.status = status
            model.updated_at = datetime.utcnow()
            await self._session.commit()

    async def create(self, entity: Payment) -> Payment:
        """Create a new payment record"""
        model = PaymentMapper.payment_entity_to_model(entity)
        self._session.add(model)
        await self._session.commit()
        await self._session.refresh(model)
        return PaymentMapper.payment_model_to_entity(model)

    async def get_by_id(self, payment_id: int) -> Optional[Payment]:
        """Get payment by ID"""
        result = await self._session.execute(
            select(PaymentModel).where(PaymentModel.id == payment_id)
        )
        model = result.scalar_one_or_none()
        return PaymentMapper.payment_model_to_entity(model) if model else None

    async def get_payment_by_id(self, payment_id: str) -> Optional[Payment]:
        """Get payment by payment ID string"""
        try:
            payment_id_int = int(payment_id)
            return await self.get_by_id(payment_id_int)
        except ValueError:
            return None

    async def get_payments_by_booking(self, booking_id: int, booking_type: str) -> List[Payment]:
        """Get all payments for a specific booking"""
        result = await self._session.execute(
            select(PaymentModel).where(
                PaymentModel.booking_id == booking_id,
                PaymentModel.booking_type == booking_type
            )
        )
        models = result.scalars().all()
        return [PaymentMapper.payment_model_to_entity(model) for model in models]

    async def get_payments_by_customer(self, customer_id: int) -> List[Payment]:
        """Get all payments for a specific customer"""
        result = await self._session.execute(
            select(PaymentModel).where(PaymentModel.customer_id == customer_id)
        )
        models = result.scalars().all()
        return [PaymentMapper.payment_model_to_entity(model) for model in models]

    async def update(self, entity: Payment) -> Payment:
        """Update an existing payment"""
        result = await self._session.execute(
            select(PaymentModel).where(PaymentModel.id == entity.id)
        )
        model = result.scalar_one_or_none()
        
        if not model:
            raise ValueError(f"Payment with ID {entity.id} not found")
        
        # Update model fields
        model.status = entity.status
        model.transaction_id = entity.transaction_id
        model.failure_reason = entity.failure_reason
        model.completed_at = entity.completed_at
        model.metadata = entity.metadata
        model.updated_at = datetime.utcnow()
        
        await self._session.commit()
        await self._session.refresh(model)
        return PaymentMapper.payment_model_to_entity(model)

    async def delete(self, entity_id: int) -> None:
        """Delete a payment (soft delete by updating status)"""
        result = await self._session.execute(
            select(PaymentModel).where(PaymentModel.id == entity_id)
        )
        model = result.scalar_one_or_none()
        
        if model:
            model.status = "cancelled"
            model.updated_at = datetime.utcnow()
            await self._session.commit()

    async def list_all(self, limit: int = 100, offset: int = 0) -> List[Payment]:
        """List all payments with pagination"""
        result = await self._session.execute(
            select(PaymentModel)
            .limit(limit)
            .offset(offset)
        )
        models = result.scalars().all()
        return [PaymentMapper.payment_model_to_entity(model) for model in models]
