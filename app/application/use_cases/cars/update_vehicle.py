from datetime import datetime
from domain.repositories.cars import VehicleRepository
from domain.value_objects.money import Money
from application.dto.cars import UpdateVehicleRequest, VehicleResponse
from shared.exceptions import VehicleNotFoundError


class UpdateVehicleUseCase:
    def __init__(self, vehicle_repository: VehicleRepository):
        self._vehicle_repository = vehicle_repository

    async def execute(self, request: UpdateVehicleRequest) -> VehicleResponse:
        """Update existing vehicle"""
        
        # Get existing vehicle
        vehicle = await self._vehicle_repository.get_by_id(request.id)
        if not vehicle:
            raise VehicleNotFoundError(f"Vehicle with ID {request.id} not found")
        
        # Create Money object for daily rate
        daily_rate = Money(request.daily_rate, request.currency)
        
        # Update fields
        vehicle.make = request.make
        vehicle.model = request.model
        vehicle.year = request.year
        vehicle.daily_rate = daily_rate
        vehicle.features = request.features or []
        vehicle.images = request.images or []
        vehicle.location = request.location
        vehicle.description = request.description
        vehicle.category = request.category or vehicle.category
        vehicle.transmission = request.transmission or vehicle.transmission
        vehicle.fuel_type = request.fuel_type or vehicle.fuel_type
        vehicle.seats = request.seats or vehicle.seats
        vehicle.status = request.status or vehicle.status
        vehicle.updated_at = datetime.utcnow()
        
        saved_vehicle = await self._vehicle_repository.update(vehicle)
        return VehicleResponse.from_entity(saved_vehicle)
