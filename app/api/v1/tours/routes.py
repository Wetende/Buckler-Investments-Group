from typing import List
from fastapi import APIRouter, Depends, status, HTTPException
from dependency_injector.wiring import inject, Provide

from ...containers import AppContainer
from application.use_cases.tours.search_tours import SearchToursUseCase
from application.use_cases.tours.create_tour_booking import CreateTourBookingUseCase
from application.dto.tours import (
    SearchToursRequest,
    TourResponse,
    CreateTourBookingRequest,
    TourBookingResponse,
)
from shared.exceptions import TourNotFoundError

router = APIRouter()

@router.post("/search", response_model=List[TourResponse])
@inject
async def search_tours(
    request: SearchToursRequest,
    use_case: SearchToursUseCase = Depends(Provide[AppContainer.search_tours_use_case]),
):
    return await use_case.execute(request)

@router.post("/bookings", response_model=TourBookingResponse, status_code=status.HTTP_201_CREATED)
@inject
async def create_tour_booking(
    request: CreateTourBookingRequest,
    use_case: CreateTourBookingUseCase = Depends(Provide[AppContainer.create_tour_booking_use_case]),
):
    try:
        return await use_case.execute(request)
    except TourNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour not found.",
        )
