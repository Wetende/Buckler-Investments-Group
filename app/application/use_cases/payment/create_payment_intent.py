from application.dto.payment import PaymentIntentRequestDTO, PaymentIntentResponseDTO, PaymentStatus
from domain.repositories.payment import PaymentRepository
from infrastructure.external_services.payment.stripe_service import StripePaymentService
from infrastructure.external_services.payment.mpesa_service import MpesaPaymentService
from shared.exceptions.payment import PaymentProcessingError

class CreatePaymentIntentUseCase:
    def __init__(
        self, 
        payment_repository: PaymentRepository,
        stripe_service: StripePaymentService,
        mpesa_service: MpesaPaymentService
    ):
        self._payment_repository = payment_repository
        self._stripe_service = stripe_service
        self._mpesa_service = mpesa_service
    
    async def execute(self, request: PaymentIntentRequestDTO) -> PaymentIntentResponseDTO:
        try:
            # Create payment intent based on payment method
            if request.payment_method == "stripe":
                result = await self._create_stripe_intent(request)
            elif request.payment_method == "mpesa":
                result = await self._create_mpesa_intent(request)
            else:
                raise PaymentProcessingError(f"Unsupported payment method: {request.payment_method}")
            
            # Save payment intent to database
            await self._payment_repository.create_payment_intent(
                intent_id=result.payment_intent_id,
                amount=request.amount,
                currency=request.currency,
                payment_method=request.payment_method,
                booking_id=request.booking_id,
                booking_type=request.booking_type,
                customer_id=request.customer_id,
                status=PaymentStatus.PENDING,
                metadata=request.metadata or {}
            )
            
            return result
            
        except Exception as e:
            raise PaymentProcessingError(f"Failed to create payment intent: {str(e)}")
    
    async def _create_stripe_intent(self, request: PaymentIntentRequestDTO) -> PaymentIntentResponseDTO:
        """Create Stripe payment intent"""
        intent = await self._stripe_service.create_payment_intent(
            amount=int(request.amount * 100),  # Convert to cents
            currency=request.currency.lower(),
            customer_email=request.customer_email,
            metadata={
                "booking_id": str(request.booking_id),
                "booking_type": request.booking_type,
                "customer_id": str(request.customer_id),
                **(request.metadata or {})
            }
        )
        
        return PaymentIntentResponseDTO(
            payment_intent_id=intent["id"],
            client_secret=intent["client_secret"],
            amount=request.amount,
            currency=request.currency,
            status=PaymentStatus.PENDING,
            payment_method=request.payment_method,
            expires_at=None  # Stripe intents don't expire by default
        )
    
    async def _create_mpesa_intent(self, request: PaymentIntentRequestDTO) -> PaymentIntentResponseDTO:
        """Create M-Pesa payment intent"""
        if not request.customer_phone:
            raise PaymentProcessingError("Phone number is required for M-Pesa payments")
        
        result = await self._mpesa_service.initiate_stk_push(
            amount=int(request.amount),
            phone_number=request.customer_phone,
            account_reference=f"{request.booking_type}_{request.booking_id}",
            transaction_desc=f"Payment for {request.booking_type} booking #{request.booking_id}"
        )
        
        return PaymentIntentResponseDTO(
            payment_intent_id=result["checkout_request_id"],
            checkout_url=result.get("checkout_url"),
            amount=request.amount,
            currency=request.currency,
            status=PaymentStatus.PENDING,
            payment_method=request.payment_method,
            expires_at=result.get("expires_at")
        )
