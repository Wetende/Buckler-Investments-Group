from typing import List, Optional
from fastapi import APIRouter, Depends, status, HTTPException, Query
from dependency_injector.wiring import inject, Provide

from ...containers import AppContainer
from application.use_cases.cars.search_vehicles import SearchVehiclesUseCase
from application.use_cases.cars.create_rental import CreateRentalUseCase
from application.use_cases.cars.create_vehicle import CreateVehicleUseCase
from application.use_cases.cars.get_vehicle import GetVehicleUseCase
from application.use_cases.cars.list_vehicles import ListVehiclesUseCase
from application.use_cases.cars.update_vehicle import UpdateVehicleUseCase
from application.use_cases.cars.delete_vehicle import DeleteVehicleUseCase
from application.use_cases.cars.get_rental import GetRentalUseCase
from application.use_cases.cars.list_rentals import ListRentalsUseCase
from application.use_cases.cars.check_availability import CheckAvailabilityUseCase
from application.dto.cars import (
    SearchVehiclesRequest,
    VehicleResponse,
    CreateRentalRequest,
    RentalResponse,
    CreateVehicleRequest,
    UpdateVehicleRequest,
    AvailabilityRequest,
    AvailabilityResponse,
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

# Vehicle CRUD Operations
@router.post("/", response_model=VehicleResponse)
@inject
async def create_or_update_vehicle(
    request: CreateVehicleRequest,
    use_case: CreateVehicleUseCase = Depends(Provide[AppContainer.create_vehicle_use_case]),
):
    """Create new vehicle (id=0) or update existing vehicle (id>0)"""
    return await use_case.execute(request)

@router.get("/", response_model=List[VehicleResponse])
@inject
async def list_vehicles(
    owner_id: Optional[int] = Query(None),
    limit: int = Query(20, le=100),
    offset: int = Query(0, ge=0),
    use_case: ListVehiclesUseCase = Depends(Provide[AppContainer.list_vehicles_use_case]),
):
    """List vehicles with optional filtering by owner"""
    return await use_case.execute(owner_id=owner_id, limit=limit, offset=offset)

@router.get("/{vehicle_id}", response_model=VehicleResponse)
@inject
async def get_vehicle(
    vehicle_id: int,
    use_case: GetVehicleUseCase = Depends(Provide[AppContainer.get_vehicle_use_case]),
):
    """Get vehicle by ID"""
    try:
        return await use_case.execute(vehicle_id)
    except VehicleNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found.",
        )

@router.get("/{vehicle_id}/delete", response_model=dict)
@inject
async def delete_vehicle(
    vehicle_id: int,
    use_case: DeleteVehicleUseCase = Depends(Provide[AppContainer.delete_vehicle_use_case]),
):
    """Delete vehicle (using GET method as per convention)"""
    try:
        await use_case.execute(vehicle_id)
        return {"ok": True, "vehicle_id": vehicle_id}
    except VehicleNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found.",
        )

# Rental Management
@router.get("/rentals/{rental_id}", response_model=RentalResponse)
@inject
async def get_rental(
    rental_id: int,
    use_case: GetRentalUseCase = Depends(Provide[AppContainer.get_rental_use_case]),
):
    """Get rental by ID"""
    return await use_case.execute(rental_id)

@router.get("/rentals", response_model=List[RentalResponse])
@inject
async def list_rentals(
    vehicle_id: Optional[int] = Query(None),
    renter_id: Optional[int] = Query(None),
    limit: int = Query(20, le=100),
    offset: int = Query(0, ge=0),
    use_case: ListRentalsUseCase = Depends(Provide[AppContainer.list_rentals_use_case]),
):
    """List rentals with optional filtering"""
    return await use_case.execute(
        vehicle_id=vehicle_id, 
        renter_id=renter_id, 
        limit=limit, 
        offset=offset
    )

# Availability Checking
@router.post("/availability", response_model=AvailabilityResponse)
@inject
async def check_availability(
    request: AvailabilityRequest,
    use_case: CheckAvailabilityUseCase = Depends(Provide[AppContainer.check_availability_use_case]),
):
    """Check vehicle availability for given dates"""
    return await use_case.execute(request)
