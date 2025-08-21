from fastapi import APIRouter, Depends, HTTPException, status
from dependency_injector.wiring import inject, Provide

from application.dto.bundle import CreateBundleRequestDTO, BundleResponseDTO
from application.dto.bundle_booking import CreateBundleBookingRequestDTO, BundleBookingResponseDTO
from application.use_cases.bundle.create_bundle import CreateBundleUseCase
from application.use_cases.bundle.book_bundle import BookBundleUseCase
from ...containers import AppContainer
from shared.exceptions.bundle import BundledItemNotFoundError, BundleNotFoundError

router = APIRouter()

@router.post("/", response_model=BundleResponseDTO, status_code=status.HTTP_201_CREATED)
@inject
async def create_bundle(
    bundle_data: CreateBundleRequestDTO,
    use_case: CreateBundleUseCase = Depends(Provide[AppContainer.bundle_use_cases.create_bundle_use_case]),
) -> BundleResponseDTO:
    try:
        return await use_case.execute(bundle_data)
    except BundledItemNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.post("/bookings/", response_model=BundleBookingResponseDTO, status_code=status.HTTP_201_CREATED)
@inject
async def book_bundle(
    booking_data: CreateBundleBookingRequestDTO,
    use_case: BookBundleUseCase = Depends(Provide[AppContainer.bundle_use_cases.book_bundle_use_case]),
) -> BundleBookingResponseDTO:
    try:
        return await use_case.execute(booking_data)
    except BundleNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
