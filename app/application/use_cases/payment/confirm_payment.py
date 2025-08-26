from application.dto.payment import PaymentConfirmationDTO, PaymentStatusResponseDTO, PaymentStatus
from domain.repositories.payment import PaymentRepository
from infrastructure.external_services.payment.stripe_service import StripePaymentService
from infrastructure.external_services.payment.mpesa_service import MpesaPaymentService
from shared.exceptions.payment import PaymentNotFoundError, PaymentProcessingError

class ConfirmPaymentUseCase:
    def __init__(
        self, 
        payment_repository: PaymentRepository,
        stripe_service: StripePaymentService,
        mpesa_service: MpesaPaymentService
    ):
        self._payment_repository = payment_repository
        self._stripe_service = stripe_service
        self._mpesa_service = mpesa_service
    
    async def execute(self, request: PaymentConfirmationDTO) -> PaymentStatusResponseDTO:
        # Get payment intent from database
        payment_intent = await self._payment_repository.get_payment_intent(request.payment_intent_id)
        if not payment_intent:
            raise PaymentNotFoundError(f"Payment intent {request.payment_intent_id} not found")
        
        try:
            # Confirm payment based on method
            if payment_intent.payment_method == "stripe":
                result = await self._confirm_stripe_payment(request, payment_intent)
            elif payment_intent.payment_method == "mpesa":
                result = await self._confirm_mpesa_payment(request, payment_intent)
            else:
                raise PaymentProcessingError(f"Unsupported payment method: {payment_intent.payment_method}")
            
            # Update payment status in database
            await self._payment_repository.update_payment_status(
                intent_id=request.payment_intent_id,
                status=result.status,
                transaction_id=result.transaction_id,
                failure_reason=result.failure_reason
            )
            
            return result
            
        except Exception as e:
            # Mark payment as failed
            await self._payment_repository.update_payment_status(
                intent_id=request.payment_intent_id,
                status=PaymentStatus.FAILED,
                failure_reason=str(e)
            )
            raise PaymentProcessingError(f"Payment confirmation failed: {str(e)}")
    
    async def _confirm_stripe_payment(self, request: PaymentConfirmationDTO, payment_intent) -> PaymentStatusResponseDTO:
        """Confirm Stripe payment"""
        if not request.payment_method_id:
            raise PaymentProcessingError("Payment method ID is required for Stripe payments")
        
        result = await self._stripe_service.confirm_payment_intent(
            payment_intent_id=request.payment_intent_id,
            payment_method_id=request.payment_method_id
        )
        
        status = PaymentStatus.COMPLETED if result["status"] == "succeeded" else PaymentStatus.FAILED
        
        return PaymentStatusResponseDTO(
            payment_id=result["id"],
            payment_intent_id=request.payment_intent_id,
            amount=payment_intent.amount,
            currency=payment_intent.currency,
            status=status,
            payment_method=payment_intent.payment_method,
            booking_id=payment_intent.booking_id,
            booking_type=payment_intent.booking_type,
            customer_id=payment_intent.customer_id,
            transaction_id=result.get("latest_charge"),
            failure_reason=result.get("last_payment_error", {}).get("message") if status == PaymentStatus.FAILED else None,
            created_at=payment_intent.created_at,
            completed_at=result.get("created")
        )
    
    async def _confirm_mpesa_payment(self, request: PaymentConfirmationDTO, payment_intent) -> PaymentStatusResponseDTO:
        """Confirm M-Pesa payment"""
        # For M-Pesa, we typically check the status since confirmation happens via webhook
        result = await self._mpesa_service.check_transaction_status(
            checkout_request_id=request.payment_intent_id
        )
        
        if result["result_code"] == "0":
            status = PaymentStatus.COMPLETED
            transaction_id = result.get("mpesa_receipt_number")
            failure_reason = None
        else:
            status = PaymentStatus.FAILED
            transaction_id = None
            failure_reason = result.get("result_desc")
        
        return PaymentStatusResponseDTO(
            payment_id=f"mpesa_{request.payment_intent_id}",
            payment_intent_id=request.payment_intent_id,
            amount=payment_intent.amount,
            currency=payment_intent.currency,
            status=status,
            payment_method=payment_intent.payment_method,
            booking_id=payment_intent.booking_id,
            booking_type=payment_intent.booking_type,
            customer_id=payment_intent.customer_id,
            transaction_id=transaction_id,
            failure_reason=failure_reason,
            created_at=payment_intent.created_at,
            completed_at=result.get("completed_at")
        )
