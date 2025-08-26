from application.dto.payment import PaymentStatusResponseDTO
from domain.repositories.payment import PaymentRepository
from shared.exceptions.payment import PaymentNotFoundError

class GetPaymentStatusUseCase:
    def __init__(self, payment_repository: PaymentRepository):
        self._payment_repository = payment_repository
    
    async def execute(self, payment_id: str) -> PaymentStatusResponseDTO:
        payment = await self._payment_repository.get_payment_by_id(payment_id)
        
        if not payment:
            raise PaymentNotFoundError(f"Payment {payment_id} not found")
        
        return PaymentStatusResponseDTO(
            payment_id=payment.id,
            payment_intent_id=payment.intent_id,
            amount=payment.amount,
            currency=payment.currency,
            status=payment.status,
            payment_method=payment.payment_method,
            booking_id=payment.booking_id,
            booking_type=payment.booking_type,
            customer_id=payment.customer_id,
            transaction_id=payment.transaction_id,
            failure_reason=payment.failure_reason,
            created_at=payment.created_at,
            completed_at=payment.completed_at
        )
