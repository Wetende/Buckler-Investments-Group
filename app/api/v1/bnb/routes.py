from fastapi import APIRouter, Depends, HTTPException
from dependency_injector.wiring import inject, Provide
from typing import List

from app.api.containers import AppContainer
from ....application.use_cases.bnb.search_listings import SearchListingsUseCase
from ....application.use_cases.bnb.create_booking import CreateBookingUseCase
from ....application.dto.bnb import (
    SearchListingsRequest,
    ListingResponse,
    CreateBookingRequest,
    BookingResponse,
)
from ....shared.exceptions.bnb import ListingNotFoundError, InvalidNightsError

router = APIRouter()

@router.post("/search", response_model=List[ListingResponse])
@inject
async def search_listings(
    request: SearchListingsRequest,
    search_use_case: SearchListingsUseCase = Depends(Provide[AppContainer.search_listings_use_case]),
):
    return await search_use_case.execute(request)

@router.post("/bookings", response_model=BookingResponse)
@inject
async def create_booking(
    request: CreateBookingRequest,
    create_use_case: CreateBookingUseCase = Depends(Provide[AppContainer.create_booking_use_case]),
):
    try:
        return await create_use_case.execute(request)
    except ListingNotFoundError:
        raise HTTPException(status_code=404, detail="Listing not found")
    except InvalidNightsError as e:
        raise HTTPException(status_code=400, detail=str(e))
