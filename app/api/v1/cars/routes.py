from typing import List
from fastapi import APIRouter, Depends, status, HTTPException
from dependency_injector.wiring import inject, Provide

from ...containers import AppContainer
from application.use_cases.cars.search_vehicles import SearchVehiclesUseCase
from application.use_cases.cars.create_rental import CreateRentalUseCase
from application.dto.cars import (
    SearchVehiclesRequest,
    VehicleResponse,
    CreateRentalRequest,
    RentalResponse,
)
from shared.exceptions import VehicleNotFoundError

router = APIRouter()

@router.post("/search", response_model=List[VehicleResponse])
@inject
async def search_vehicles(
    request: SearchVehiclesRequest,
    use_case: SearchVehiclesUseCase = Depends(Provide[AppContainer.search_vehicles_use_case]),
):
    return await use_case.execute(request)

@router.post("/rentals", response_model=RentalResponse, status_code=status.HTTP_201_CREATED)
@inject
async def create_rental(
    request: CreateRentalRequest,
    use_case: CreateRentalUseCase = Depends(Provide[AppContainer.create_rental_use_case]),
):
    try:
        return await use_case.execute(request)
    except VehicleNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found.",
        )
