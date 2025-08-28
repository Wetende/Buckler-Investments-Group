from fastapi import APIRouter, Depends, HTTPException, Query
from dependency_injector.wiring import inject, Provide
from typing import List

from ...containers import AppContainer
from application.use_cases.bnb.create_booking import CreateBookingUseCase
from application.use_cases.bnb.get_booking import GetBookingUseCase
from application.use_cases.bnb.get_user_bookings import GetUserBookingsUseCase
from application.use_cases.bnb.cancel_booking import CancelBookingUseCase
from application.use_cases.bnb.get_host_bookings import GetHostBookingsUseCase
from application.use_cases.bnb.approve_booking import ApproveBookingUseCase
from application.use_cases.bnb.reject_booking import RejectBookingUseCase
from application.use_cases.analytics.host_dashboard import HostDashboardUseCase
from application.use_cases.analytics.host_earnings import HostEarningsUseCase
from application.dto.bnb import (
    CreateBookingRequest,
    BookingResponse,
    BookingRead,
    MessageCU,
    MessageRead,
)
from shared.exceptions.bnb import (
    ListingNotFoundError, 
    InvalidNightsError, 
    BookingNotFoundError, 
    BookingCancellationError,
    BookingApprovalError,
    BookingRejectionError
)

router = APIRouter()

# Guest booking endpoints
@router.post("/bookings", response_model=BookingResponse)
@inject
async def create_booking(
    request: CreateBookingRequest,
    create_use_case: CreateBookingUseCase = Depends(Provide[AppContainer.create_booking_use_case]),
):
    """Create a new booking"""
    try:
        return await create_use_case.execute(request)
    except ListingNotFoundError:
        raise HTTPException(status_code=404, detail="Listing not found")
    except InvalidNightsError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/bookings/{booking_id}", response_model=BookingRead)
@inject
async def get_booking_details(
    booking_id: int,
    use_case: GetBookingUseCase = Depends(Provide[AppContainer.get_booking_use_case]),
):
    """Get detailed information about a specific booking"""
    try:
        return await use_case.execute(booking_id)
    except BookingNotFoundError:
        raise HTTPException(status_code=404, detail="Booking not found")

@router.get("/my-bookings", response_model=List[BookingRead])
@inject
async def get_my_bookings(
    # TODO: Get guest_id from authentication context
    guest_id: int = Query(1, description="Guest ID (from auth context)"),
    use_case: GetUserBookingsUseCase = Depends(Provide[AppContainer.get_user_bookings_use_case]),
):
    """Get all bookings for the authenticated user"""
    return await use_case.execute(guest_id)

@router.post("/bookings/{booking_id}/cancel", response_model=dict)
@inject
async def cancel_booking_post(
    booking_id: int,
    use_case: CancelBookingUseCase = Depends(Provide[AppContainer.cancel_booking_use_case]),
):
    """Cancel a booking (POST method)"""
    try:
        await use_case.execute(booking_id)
        return {"ok": True, "message": "Booking cancelled", "booking_id": booking_id}
    except BookingNotFoundError:
        raise HTTPException(status_code=404, detail="Booking not found")
    except BookingCancellationError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/bookings/{booking_id}/cancel", response_model=dict)
@inject
async def cancel_booking_get(
    booking_id: int,
    use_case: CancelBookingUseCase = Depends(Provide[AppContainer.cancel_booking_use_case]),
):
    """Cancel a booking (GET method alternative)"""
    try:
        await use_case.execute(booking_id)
        return {"ok": True, "message": "Booking cancelled", "booking_id": booking_id}
    except BookingNotFoundError:
        raise HTTPException(status_code=404, detail="Booking not found")
    except BookingCancellationError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Host booking management
@router.get("/host/bookings", response_model=List[BookingRead])
@inject
async def get_host_bookings(
    # TODO: Get host_id from authentication context
    host_id: int = Query(1, description="Host ID (from auth context)"),
    use_case: GetHostBookingsUseCase = Depends(Provide[AppContainer.get_host_bookings_use_case]),
):
    """Get all bookings for the host's properties"""
    return await use_case.execute(host_id)

@router.post("/bookings/{booking_id}/approve", response_model=dict)
@inject
async def approve_booking(
    booking_id: int,
    use_case: ApproveBookingUseCase = Depends(Provide[AppContainer.approve_booking_use_case]),
):
    """Approve a booking (if not instant-book)"""
    try:
        await use_case.execute(booking_id)
        return {"ok": True, "message": "Booking approved", "booking_id": booking_id}
    except BookingNotFoundError:
        raise HTTPException(status_code=404, detail="Booking not found")
    except BookingApprovalError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/bookings/{booking_id}/reject", response_model=dict)
@inject
async def reject_booking(
    booking_id: int,
    use_case: RejectBookingUseCase = Depends(Provide[AppContainer.reject_booking_use_case]),
):
    """Reject a booking"""
    try:
        await use_case.execute(booking_id)
        return {"ok": True, "message": "Booking rejected", "booking_id": booking_id}
    except BookingNotFoundError:
        raise HTTPException(status_code=404, detail="Booking not found")
    except BookingRejectionError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Payment integration
@router.post("/bookings/{booking_id}/payment", response_model=dict)
async def process_booking_payment(
    booking_id: int,
    # TODO: Create payment DTO
    # payment_data: PaymentRequestDTO,
):
    """Process payment for a booking"""
    # TODO: Implement payment processing integration
    return {"ok": True, "message": "Payment processed", "booking_id": booking_id, "payment_id": "mock_payment_123"}

@router.get("/bookings/{booking_id}/payment-status", response_model=dict)
async def get_booking_payment_status(
    booking_id: int,
):
    """Check payment status for a booking"""
    # TODO: Implement payment status checking
    return {"booking_id": booking_id, "payment_status": "completed", "payment_id": "mock_payment_123"}

@router.post("/bookings/{booking_id}/refund", response_model=dict)
async def process_booking_refund(
    booking_id: int,
    # TODO: Create refund DTO
    # refund_data: RefundRequestDTO,
):
    """Process refund for a booking"""
    # TODO: Implement refund processing
    return {"ok": True, "message": "Refund processed", "booking_id": booking_id, "refund_id": "mock_refund_123"}

# Messaging & communication
@router.post("/bookings/{booking_id}/messages", response_model=MessageRead)
async def send_booking_message(
    booking_id: int,
    request: MessageCU,
    # TODO: Implement messaging use case
):
    """Send a message related to a booking"""
    # TODO: Implement messaging system
    from datetime import datetime
    return MessageRead(
        id=1,
        booking_id=booking_id,
        sender_id=1,  # TODO: Get from auth context
        body=request.body,
        created_at=datetime.utcnow()
    )

@router.get("/bookings/{booking_id}/messages", response_model=List[MessageRead])
async def get_booking_messages(
    booking_id: int,
    # TODO: Implement get messages use case
):
    """Get all messages for a booking"""
    # TODO: Implement message retrieval
    return []

@router.get("/conversations", response_model=List[dict])
async def get_user_conversations(
    # TODO: Get user_id from authentication context
    user_id: int = Query(1, description="User ID (from auth context)"),
):
    """Get all conversations for the user"""
    # TODO: Implement conversations system
    return []

# Host dashboard & analytics
@router.get("/host/dashboard", response_model=dict)
@inject
async def get_host_dashboard(
    # TODO: Get host_id from authentication context
    host_id: int = Query(1, description="Host ID (from auth context)"),
    dashboard_use_case: HostDashboardUseCase = Depends(Provide[AppContainer.host_dashboard_use_case]),
):
    """Get host dashboard statistics"""
    try:
        return await dashboard_use_case.execute(host_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/host/earnings", response_model=dict)
@inject
async def get_host_earnings(
    # TODO: Get host_id from authentication context
    host_id: int = Query(1, description="Host ID (from auth context)"),
    period: str = Query("month", description="Period: day, week, month, year"),
    earnings_use_case: HostEarningsUseCase = Depends(Provide[AppContainer.host_earnings_use_case]),
):
    """Get host earnings summary"""
    try:
        return await earnings_use_case.execute(host_id, period)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/host/payouts", response_model=List[dict])
async def get_host_payouts(
    # TODO: Get host_id from authentication context
    host_id: int = Query(1, description="Host ID (from auth context)"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """Get host payout history"""
    # TODO: Implement payout history
    return []
