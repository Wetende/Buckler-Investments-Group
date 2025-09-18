from domain.repositories.cars import VehicleRepository, CarRentalRepository
from shared.exceptions import VehicleNotFoundError


class DeleteVehicleUseCase:
    def __init__(
        self, 
        vehicle_repository: VehicleRepository,
        rental_repository: CarRentalRepository
    ):
        self._vehicle_repository = vehicle_repository
        self._rental_repository = rental_repository

    async def execute(self, vehicle_id: int) -> None:
        """Delete vehicle if no active rentals exist"""
        
        # Check if vehicle exists
        vehicle = await self._vehicle_repository.get_by_id(vehicle_id)
        if not vehicle:
            raise VehicleNotFoundError(f"Vehicle with ID {vehicle_id} not found")
        
        # Check for active rentals
        active_rentals = await self._rental_repository.get_active_by_vehicle(vehicle_id)
        if active_rentals:
            raise ValueError(f"Cannot delete vehicle with active rentals")
        
        # Delete the vehicle
        await self._vehicle_repository.delete(vehicle_id)
