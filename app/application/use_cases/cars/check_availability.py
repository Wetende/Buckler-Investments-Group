from datetime import datetime
from typing import List
from domain.repositories.cars import VehicleRepository, CarRentalRepository
from application.dto.cars import AvailabilityRequest, AvailabilityResponse
from shared.exceptions import VehicleNotFoundError


class CheckAvailabilityUseCase:
    def __init__(
        self, 
        vehicle_repository: VehicleRepository,
        rental_repository: CarRentalRepository
    ):
        self._vehicle_repository = vehicle_repository
        self._rental_repository = rental_repository

    async def execute(self, request: AvailabilityRequest) -> AvailabilityResponse:
        """Check vehicle availability for given dates"""
        
        # Check if vehicle exists
        vehicle = await self._vehicle_repository.get_by_id(request.vehicle_id)
        if not vehicle:
            raise VehicleNotFoundError(f"Vehicle with ID {request.vehicle_id} not found")
        
        # Check if vehicle is in available status
        if vehicle.status != "available":
            return AvailabilityResponse(
                vehicle_id=request.vehicle_id,
                available=False,
                conflicting_rentals=[]
            )
        
        # Check for conflicting rentals
        conflicting_rentals = await self._rental_repository.get_overlapping_rentals(
            vehicle_id=request.vehicle_id,
            start_date=request.start_date,
            end_date=request.end_date
        )
        
        is_available = len(conflicting_rentals) == 0
        conflicting_rental_ids = [rental.id for rental in conflicting_rentals] if conflicting_rentals else []
        
        return AvailabilityResponse(
            vehicle_id=request.vehicle_id,
            available=is_available,
            conflicting_rentals=conflicting_rental_ids if not is_available else None
        )
