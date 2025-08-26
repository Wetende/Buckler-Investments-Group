from fastapi import APIRouter, Depends, HTTPException, Query
from dependency_injector.wiring import inject, Provide
from typing import List

from application.dto.bundle import CreateBundleRequestDTO, BundleResponseDTO
from application.dto.bundle_booking import CreateBundleBookingRequestDTO, BundleBookingResponseDTO
from application.use_cases.bundle.create_bundle import CreateBundleUseCase
from application.use_cases.bundle.book_bundle import BookBundleUseCase
from ...containers import AppContainer
from shared.exceptions.bundle import BundledItemNotFoundError, BundleNotFoundError

router = APIRouter()

# Bundle CRUD endpoints
@router.post("/", response_model=BundleResponseDTO)
@inject
async def create_bundle(
    bundle_data: CreateBundleRequestDTO,
    use_case: CreateBundleUseCase = Depends(Provide[AppContainer.bundle_use_cases.create_bundle_use_case]),
) -> BundleResponseDTO:
    """Create a new bundle combining tours + accommodation + vehicles"""
    try:
        return await use_case.execute(bundle_data)
    except BundledItemNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/", response_model=List[BundleResponseDTO])
async def list_bundles(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    location: str = Query(None, description="Filter by location"),
    min_price: float = Query(None, description="Minimum price filter"),
    max_price: float = Query(None, description="Maximum price filter"),
    # TODO: Implement list bundles use case
):
    """List available bundles with filters"""
    # TODO: Implement bundle listing logic
    return [
        BundleResponseDTO(
            id=1,
            name="Safari & Beach Package",
            description="3-day safari + 2-day beach stay + transport",
            total_price=45000.0,
            currency="KES",
            duration_days=5,
            included_items=["safari_tour", "beach_accommodation", "transport"],
            created_at="2024-01-20T10:00:00Z"
        ),
        BundleResponseDTO(
            id=2,
            name="City & Culture Bundle", 
            description="City tour + cultural sites + accommodation",
            total_price=25000.0,
            currency="KES",
            duration_days=3,
            included_items=["city_tour", "cultural_sites", "accommodation"],
            created_at="2024-01-19T15:30:00Z"
        )
    ]

@router.get("/{bundle_id}", response_model=BundleResponseDTO)
async def get_bundle_details(
    bundle_id: int,
    # TODO: Implement get bundle use case
):
    """Get detailed information about a specific bundle"""
    # TODO: Implement bundle details retrieval
    return BundleResponseDTO(
        id=bundle_id,
        name="Safari & Beach Package",
        description="3-day safari + 2-day beach stay + transport including meals and activities",
        total_price=45000.0,
        currency="KES", 
        duration_days=5,
        included_items=["safari_tour", "beach_accommodation", "transport", "meals"],
        created_at="2024-01-20T10:00:00Z"
    )

@router.get("/my-bundles", response_model=List[BundleBookingResponseDTO])
async def get_my_bundle_bookings(
    # TODO: Get user_id from authentication context
    user_id: int = Query(1, description="User ID (from auth context)"),
    # TODO: Implement get user bundle bookings use case
):
    """Get user's bundle bookings"""
    # TODO: Implement user bundle booking retrieval
    return [
        BundleBookingResponseDTO(
            id=1,
            bundle_id=1,
            user_id=user_id,
            total_amount=45000.0,
            currency="KES",
            status="confirmed", 
            booking_date="2024-02-15",
            created_at="2024-01-20T11:00:00Z"
        )
    ]

# Bundle booking endpoints
@router.post("/bookings", response_model=BundleBookingResponseDTO)
@inject
async def book_bundle(
    booking_data: CreateBundleBookingRequestDTO,
    use_case: BookBundleUseCase = Depends(Provide[AppContainer.bundle_use_cases.book_bundle_use_case]),
) -> BundleBookingResponseDTO:
    """Book a bundle package"""
    try:
        return await use_case.execute(booking_data)
    except BundleNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/bookings/{booking_id}", response_model=BundleBookingResponseDTO)
async def get_bundle_booking_details(
    booking_id: int,
    # TODO: Implement get bundle booking use case
):
    """Get details of a specific bundle booking"""
    # TODO: Implement bundle booking details retrieval
    return BundleBookingResponseDTO(
        id=booking_id,
        bundle_id=1,
        user_id=1,
        total_amount=45000.0,
        currency="KES",
        status="confirmed",
        booking_date="2024-02-15", 
        created_at="2024-01-20T11:00:00Z"
    )

@router.get("/bookings/{booking_id}/cancel", response_model=dict)
async def cancel_bundle_booking(
    booking_id: int,
    # TODO: Implement cancel bundle booking use case
):
    """Cancel a bundle booking"""
    # TODO: Implement bundle booking cancellation
    return {"ok": True, "message": "Bundle booking cancelled", "booking_id": booking_id}
