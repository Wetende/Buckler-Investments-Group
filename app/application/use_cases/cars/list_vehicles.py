from typing import List, Optional
from domain.repositories.cars import VehicleRepository
from application.dto.cars import VehicleResponse


class ListVehiclesUseCase:
    def __init__(self, vehicle_repository: VehicleRepository):
        self._vehicle_repository = vehicle_repository

    async def execute(
        self, 
        owner_id: Optional[int] = None,
        limit: int = 20,
        offset: int = 0
    ) -> List[VehicleResponse]:
        """List vehicles with optional filtering by owner"""
        
        if owner_id:
            vehicles = await self._vehicle_repository.get_by_owner(owner_id, limit, offset)
        else:
            vehicles = await self._vehicle_repository.list_all(limit, offset)
        
        return [VehicleResponse.from_entity(vehicle) for vehicle in vehicles]
