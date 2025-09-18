from domain.repositories.cars import VehicleRepository
from application.dto.cars import VehicleResponse
from shared.exceptions import VehicleNotFoundError


class GetVehicleUseCase:
    def __init__(self, vehicle_repository: VehicleRepository):
        self._vehicle_repository = vehicle_repository

    async def execute(self, vehicle_id: int) -> VehicleResponse:
        """Get vehicle by ID"""
        vehicle = await self._vehicle_repository.get_by_id(vehicle_id)
        
        if not vehicle:
            raise VehicleNotFoundError(f"Vehicle with ID {vehicle_id} not found")
        
        return VehicleResponse.from_entity(vehicle)
