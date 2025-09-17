from typing import List
from application.dto.payment import PaymentStatusResponseDTO
from domain.repositories.payment import PaymentRepository


class GetBookingPaymentsUseCase:
    def __init__(self, payment_repository: PaymentRepository):
        self._payment_repository = payment_repository

    async def execute(self, booking_id: int, booking_type: str) -> List[PaymentStatusResponseDTO]:
        payments = await self._payment_repository.get_payments_by_booking(booking_id, booking_type)
        return [
            PaymentStatusResponseDTO(
                payment_id=str(p.id),
                payment_intent_id=p.intent_id,
                amount=p.amount,
                currency=p.currency,
                status=p.status,
                payment_method=p.payment_method,
                booking_id=p.booking_id,
                booking_type=p.booking_type,
                customer_id=p.customer_id,
                transaction_id=p.transaction_id,
                failure_reason=p.failure_reason,
                created_at=p.created_at,
                completed_at=p.completed_at,
            )
            for p in payments
        ]


