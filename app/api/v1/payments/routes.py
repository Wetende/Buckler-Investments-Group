from fastapi import APIRouter, Depends, HTTPException, Request
from dependency_injector.wiring import inject, Provide
from typing import Dict, Any

from ...containers import AppContainer
from application.use_cases.payment.create_payment_intent import CreatePaymentIntentUseCase
from application.use_cases.payment.get_payment_status import GetPaymentStatusUseCase
from application.use_cases.payment.get_booking_payments import GetBookingPaymentsUseCase
from application.dto.payment import (
    PaymentIntentRequestDTO,
    PaymentIntentResponseDTO,
    PaymentConfirmationDTO,
    PaymentStatusResponseDTO,
    RefundRequestDTO,
    RefundResponseDTO,
    WebhookEventDTO,
)
from shared.exceptions.payment import PaymentNotFoundError, PaymentProcessingError

router = APIRouter()

@router.post("/intent", response_model=PaymentIntentResponseDTO)
@inject
async def create_payment_intent(
    request: PaymentIntentRequestDTO,
    use_case: CreatePaymentIntentUseCase = Depends(Provide[AppContainer.create_payment_intent_use_case]),
):
    """Create a payment intent for booking payment"""
    try:
        return await use_case.execute(request)
    except PaymentProcessingError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# @router.post("/confirm", response_model=PaymentStatusResponseDTO)
# @inject
# async def confirm_payment(
#     request: PaymentConfirmationDTO,
#     use_case: ConfirmPaymentUseCase = Depends(Provide[AppContainer.confirm_payment_use_case]),
# ):
#     """Confirm a payment intent"""
#     try:
#         return await use_case.execute(request)
#     except PaymentNotFoundError:
#         raise HTTPException(status_code=404, detail="Payment intent not found")
#     except PaymentProcessingError as e:
#         raise HTTPException(status_code=400, detail=str(e))
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/{payment_id}/status", response_model=PaymentStatusResponseDTO)
@inject
async def get_payment_status(
    payment_id: str,
    use_case: GetPaymentStatusUseCase = Depends(Provide[AppContainer.get_payment_status_use_case]),
):
    """Get payment status by payment ID"""
    try:
        return await use_case.execute(payment_id)
    except PaymentNotFoundError:
        raise HTTPException(status_code=404, detail="Payment not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/webhook", response_model=dict)
async def payment_webhook(
    request: Request,
    # TODO: Implement webhook processing use case
):
    """Handle payment webhooks from payment providers"""
    try:
        # Get raw body for signature verification
        body = await request.body()
        headers = dict(request.headers)
        
        # TODO: Implement webhook verification and processing
        # This should:
        # 1. Verify webhook signature
        # 2. Parse webhook data
        # 3. Update payment status
        # 4. Trigger booking confirmation if payment successful
        # 5. Send notifications
        
        return {"ok": True, "message": "Webhook processed"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Webhook processing failed: {str(e)}")

@router.post("/refund", response_model=RefundResponseDTO)
@inject
async def process_refund(
    request: RefundRequestDTO,
    # TODO: Implement refund processing use case
):
    """Process a refund for a payment"""
    try:
        # TODO: Implement refund logic
        # This should:
        # 1. Validate refund request
        # 2. Process refund with payment provider
        # 3. Update booking status
        # 4. Send notifications
        
        from datetime import datetime
        from decimal import Decimal
        
        return RefundResponseDTO(
            refund_id=f"refund_{request.payment_id}_{int(datetime.utcnow().timestamp())}",
            payment_id=request.payment_id,
            amount=request.amount or Decimal("100.00"),  # Mock amount
            currency="KES",
            status="processing",
            reason=request.reason,
            created_at=datetime.utcnow()
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Refund processing failed: {str(e)}")

# Additional payment utility endpoints
@router.get("/methods", response_model=Dict[str, Any])
async def get_payment_methods():
    """Get available payment methods and their configurations"""
    return {
        "methods": [
            {
                "id": "mpesa",
                "name": "M-Pesa",
                "type": "mobile_money",
                "supported_currencies": ["KES"],
                "description": "Pay with M-Pesa mobile money",
                "icon": "mpesa.png"
            },
            {
                "id": "stripe",
                "name": "Credit/Debit Card",
                "type": "card",
                "supported_currencies": ["USD", "EUR", "KES"],
                "description": "Pay with credit or debit card",
                "icon": "card.png"
            },
            {
                "id": "bank_transfer",
                "name": "Bank Transfer",
                "type": "bank_transfer",
                "supported_currencies": ["KES", "USD"],
                "description": "Direct bank transfer",
                "icon": "bank.png"
            }
        ]
    }

@router.get("/bookings/{booking_id}")
@inject
async def list_booking_payments(
    booking_id: int,
    use_case: GetBookingPaymentsUseCase = Depends(Provide[AppContainer.get_booking_payments_use_case]),
):
    return await use_case.execute(booking_id, booking_type="tours")

@router.get("/exchange-rates", response_model=Dict[str, Any])
async def get_exchange_rates():
    """Get current exchange rates for supported currencies"""
    # TODO: Implement real exchange rate fetching
    return {
        "base_currency": "KES",
        "rates": {
            "USD": 0.0068,
            "EUR": 0.0061,
            "GBP": 0.0054
        },
        "updated_at": "2024-01-20T10:00:00Z"
    }
