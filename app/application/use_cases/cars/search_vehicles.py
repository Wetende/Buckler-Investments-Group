from typing import List
from domain.repositories.cars import VehicleRepository
from ...dto.cars import SearchVehiclesRequest, VehicleResponse

class SearchVehiclesUseCase:
    def __init__(self, vehicle_repository: VehicleRepository):
        self._vehicle_repository = vehicle_repository
    
    async def execute(self, request: SearchVehiclesRequest) -> List[VehicleResponse]:
        vehicles = await self._vehicle_repository.search_available(
            start_date=request.start_date,
            end_date=request.end_date
        )
        
        if request.max_price:
            vehicles = [v for v in vehicles if v.daily_rate.amount <= request.max_price]
            
        return [VehicleResponse.from_entity(vehicle) for vehicle in vehicles]
