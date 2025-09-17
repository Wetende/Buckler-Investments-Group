from typing import Optional
from datetime import datetime
from decimal import Decimal

from domain.entities.payment import Payment, PaymentIntent, Refund
from infrastructure.database.models.payment import PaymentModel, PaymentIntentModel, RefundModel


class PaymentMapper:
    """Mapper for converting between payment entities and database models"""

    @staticmethod
    def payment_entity_to_model(entity: Payment) -> PaymentModel:
        """Convert Payment entity to PaymentModel"""
        return PaymentModel(
            id=entity.id if entity.id != 0 else None,
            intent_id=entity.intent_id,
            amount=entity.amount,
            currency=entity.currency,
            payment_method=entity.payment_method,
            booking_id=entity.booking_id,
            booking_type=entity.booking_type,
            customer_id=entity.customer_id,
            status=entity.status,
            transaction_id=entity.transaction_id,
            failure_reason=entity.failure_reason,
            completed_at=entity.completed_at,
            extra=entity.metadata,
            created_at=entity.created_at,
            updated_at=entity.updated_at
        )

    @staticmethod
    def payment_model_to_entity(model: PaymentModel) -> Payment:
        """Convert PaymentModel to Payment entity"""
        return Payment(
            id=model.id,
            intent_id=model.intent_id,
            amount=model.amount,
            currency=model.currency,
            payment_method=model.payment_method,
            booking_id=model.booking_id,
            booking_type=model.booking_type,
            customer_id=model.customer_id,
            status=model.status,
            transaction_id=model.transaction_id,
            failure_reason=model.failure_reason,
            completed_at=model.completed_at,
            metadata=model.extra,
            created_at=model.created_at,
            updated_at=model.updated_at
        )

    @staticmethod
    def intent_entity_to_model(entity: PaymentIntent) -> PaymentIntentModel:
        """Convert PaymentIntent entity to PaymentIntentModel"""
        return PaymentIntentModel(
            id=entity.id if entity.id != 0 else None,
            intent_id=entity.intent_id,
            amount=entity.amount,
            currency=entity.currency,
            payment_method=entity.payment_method,
            booking_id=entity.booking_id,
            booking_type=entity.booking_type,
            customer_id=entity.customer_id,
            status=entity.status,
            extra=entity.metadata,
            expires_at=entity.expires_at,
            created_at=entity.created_at,
            updated_at=entity.updated_at
        )

    @staticmethod
    def intent_model_to_entity(model: PaymentIntentModel) -> PaymentIntent:
        """Convert PaymentIntentModel to PaymentIntent entity"""
        return PaymentIntent(
            id=model.id,
            intent_id=model.intent_id,
            amount=model.amount,
            currency=model.currency,
            payment_method=model.payment_method,
            booking_id=model.booking_id,
            booking_type=model.booking_type,
            customer_id=model.customer_id,
            status=model.status,
            metadata=model.metadata,
            expires_at=model.expires_at,
            created_at=model.created_at,
            updated_at=model.updated_at
        )

    @staticmethod
    def refund_entity_to_model(entity: Refund) -> RefundModel:
        """Convert Refund entity to RefundModel"""
        return RefundModel(
            id=entity.id if entity.id != 0 else None,
            refund_id=entity.refund_id,
            payment_id=entity.payment_id,
            amount=entity.amount,
            currency=entity.currency,
            status=entity.status,
            reason=entity.reason,
            processed_at=entity.processed_at,
            created_at=entity.created_at,
            updated_at=entity.updated_at
        )

    @staticmethod
    def refund_model_to_entity(model: RefundModel) -> Refund:
        """Convert RefundModel to Refund entity"""
        return Refund(
            id=model.id,
            refund_id=model.refund_id,
            payment_id=model.payment_id,
            amount=model.amount,
            currency=model.currency,
            status=model.status,
            reason=model.reason,
            processed_at=model.processed_at,
            created_at=model.created_at,
            updated_at=model.updated_at
        )
