from fastapi import APIRouter, Depends, HTTPException, Query
from dependency_injector.wiring import inject, Provide
from typing import List

from ...containers import AppContainer
from application.use_cases.tours.cancel_tour_booking import CancelTourBookingUseCase
from application.use_cases.tours.confirm_tour_booking import ConfirmTourBookingUseCase
from application.use_cases.tours.complete_tour_booking import CompleteTourBookingUseCase
from application.use_cases.tours.create_tour_booking import CreateTourBookingUseCase
from application.use_cases.tours.get_tour_booking import GetTourBookingUseCase
from application.use_cases.tours.get_user_tour_bookings import GetUserTourBookingsUseCase
from application.use_cases.tours.modify_tour_booking import ModifyTourBookingUseCase
from application.use_cases.analytics.tour_operator_dashboard import TourOperatorDashboardUseCase
from application.use_cases.analytics.tour_operator_earnings import TourOperatorEarningsUseCase
from application.dto.tours import (
    CreateTourBookingRequest,
    TourBookingResponse,
    TourBookingResponseDTO,
    TourBookingCreateUpdateDTO,
)
from shared.exceptions.tours import TourNotFoundError, TourBookingNotFoundError

router = APIRouter()

# Customer booking endpoints
@router.post("/bookings", response_model=TourBookingResponse)
@inject
async def create_tour_booking(
    request: CreateTourBookingRequest,
    use_case: CreateTourBookingUseCase = Depends(Provide[AppContainer.create_tour_booking_use_case]),
):
    """Create a new tour booking"""
    try:
        return await use_case.execute(request)
    except TourNotFoundError:
        raise HTTPException(status_code=404, detail="Tour not found")

@router.get("/bookings/{booking_id}", response_model=TourBookingResponseDTO)
@inject
async def get_tour_booking_details(
    booking_id: int,
    use_case: GetTourBookingUseCase = Depends(Provide[AppContainer.get_tour_booking_use_case]),
):
    """Get detailed information about a specific tour booking"""
    try:
        return await use_case.execute(booking_id)
    except TourBookingNotFoundError:
        raise HTTPException(status_code=404, detail="Tour booking not found")

@router.get("/my-bookings", response_model=List[TourBookingResponseDTO])
@inject
async def get_my_tour_bookings(
    # TODO: Get customer_id from authentication context
    customer_id: int = Query(1, description="Customer ID (from auth context)"),
    use_case: GetUserTourBookingsUseCase = Depends(Provide[AppContainer.get_user_tour_bookings_use_case]),
):
    """Get all tour bookings for the authenticated user"""
    return await use_case.execute(customer_id)

@router.post("/bookings/{booking_id}/modify", response_model=TourBookingResponseDTO)
@inject
async def modify_tour_booking(
    booking_id: int,
    request: TourBookingCreateUpdateDTO,
    use_case: ModifyTourBookingUseCase = Depends(Provide[AppContainer.modify_tour_booking_use_case]),
):
    """Modify an existing tour booking (date/participants/requests)."""
    try:
        return await use_case.execute(booking_id, request)
    except TourBookingNotFoundError:
        raise HTTPException(status_code=404, detail="Tour booking not found")

@router.post("/bookings/{booking_id}/cancel", response_model=TourBookingResponseDTO)
@inject
async def cancel_tour_booking_post(
    booking_id: int,
    use_case: CancelTourBookingUseCase = Depends(Provide[AppContainer.cancel_tour_booking_use_case]),
):
    """Cancel a tour booking (POST method)"""
    try:
        return await use_case.execute(booking_id)
    except TourBookingNotFoundError:
        raise HTTPException(status_code=404, detail="Tour booking not found")

@router.get("/bookings/{booking_id}/cancel", response_model=TourBookingResponseDTO)
@inject
async def cancel_tour_booking_get(
    booking_id: int,
    use_case: CancelTourBookingUseCase = Depends(Provide[AppContainer.cancel_tour_booking_use_case]),
):
    """Cancel a tour booking (GET method alternative)"""
    try:
        return await use_case.execute(booking_id)
    except TourBookingNotFoundError:
        raise HTTPException(status_code=404, detail="Tour booking not found")

# Operator booking management
@router.get("/operator/bookings", response_model=List[TourBookingResponseDTO])
async def get_operator_tour_bookings(
    # TODO: Get operator_id from authentication context
    operator_id: int = Query(1, description="Operator ID (from auth context)"),
):
    """Get all tour bookings for the operator's tours"""
    # TODO: Implement operator booking retrieval
    return []

@router.post("/bookings/{booking_id}/confirm", response_model=TourBookingResponseDTO)
@inject
async def confirm_tour_booking(
    booking_id: int,
    use_case: ConfirmTourBookingUseCase = Depends(Provide[AppContainer.confirm_tour_booking_use_case]),
):
    """Confirm a tour booking"""
    try:
        return await use_case.execute(booking_id)
    except TourBookingNotFoundError:
        raise HTTPException(status_code=404, detail="Tour booking not found")

@router.post("/bookings/{booking_id}/complete", response_model=TourBookingResponseDTO)
@inject
async def complete_tour_booking(
    booking_id: int,
    use_case: CompleteTourBookingUseCase = Depends(Provide[AppContainer.complete_tour_booking_use_case]),
):
    """Mark tour as completed"""
    try:
        return await use_case.execute(booking_id)
    except TourBookingNotFoundError:
        raise HTTPException(status_code=404, detail="Tour booking not found")

# Payment integration
@router.post("/bookings/{booking_id}/payment", response_model=dict)
async def process_tour_payment(
    booking_id: int,
    # TODO: Create payment DTO
    # payment_data: PaymentRequestDTO,
):
    """Process payment for a tour booking"""
    # TODO: Implement payment processing integration
    return {"ok": True, "message": "Payment processed", "booking_id": booking_id, "payment_id": "mock_payment_123"}

@router.get("/bookings/{booking_id}/payment-status", response_model=dict)
async def get_tour_payment_status(
    booking_id: int,
):
    """Check payment status for a tour booking"""
    # TODO: Implement payment status checking
    return {"booking_id": booking_id, "payment_status": "completed", "payment_id": "mock_payment_123"}

@router.post("/bookings/{booking_id}/refund", response_model=dict)
async def process_tour_refund(
    booking_id: int,
    # TODO: Create refund DTO
    # refund_data: RefundRequestDTO,
):
    """Process refund for a tour booking"""
    # TODO: Implement refund processing
    return {"ok": True, "message": "Refund processed", "booking_id": booking_id, "refund_id": "mock_refund_123"}

# Communication
@router.post("/bookings/{booking_id}/messages", response_model=dict)
async def send_tour_message(
    booking_id: int,
    # TODO: Create message DTO
    # message_data: MessageCreateDTO,
):
    """Send a message to operator regarding tour booking"""
    # TODO: Implement messaging system
    return {"ok": True, "message": "Message sent", "booking_id": booking_id, "message_id": 1}

@router.get("/bookings/{booking_id}/messages", response_model=List[dict])
async def get_tour_booking_messages(
    booking_id: int,
):
    """Get all messages for a tour booking"""
    # TODO: Implement message retrieval
    return []

@router.get("/conversations", response_model=List[dict])
async def get_tour_conversations(
    # TODO: Get user_id from authentication context
    user_id: int = Query(1, description="User ID (from auth context)"),
):
    """Get all tour conversations for the user"""
    # TODO: Implement conversations system
    return []

# Operator dashboard & analytics
@router.get("/operator/dashboard", response_model=dict)
@inject
async def get_operator_dashboard(
    # TODO: Get operator_id from authentication context
    operator_id: int = Query(1, description="Operator ID (from auth context)"),
    dashboard_use_case: TourOperatorDashboardUseCase = Depends(Provide[AppContainer.tour_operator_dashboard_use_case]),
):
    """Get operator dashboard statistics"""
    try:
        return await dashboard_use_case.execute(operator_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/operator/earnings", response_model=dict)
@inject
async def get_operator_earnings(
    # TODO: Get operator_id from authentication context
    operator_id: int = Query(1, description="Operator ID (from auth context)"),
    period: str = Query("month", description="Period: day, week, month, year"),
    earnings_use_case: TourOperatorEarningsUseCase = Depends(Provide[AppContainer.tour_operator_earnings_use_case]),
):
    """Get operator earnings summary"""
    try:
        return await earnings_use_case.execute(operator_id, period)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/operator/payouts", response_model=List[dict])
async def get_operator_payouts(
    # TODO: Get operator_id from authentication context
    operator_id: int = Query(1, description="Operator ID (from auth context)"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """Get operator payout history"""
    # TODO: Implement payout history
    return []
