from datetime import datetime
from domain.repositories.cars import VehicleRepository, CarRentalRepository
from domain.entities.cars import CarRental
from domain.value_objects.money import Money
from ...dto.cars import CreateRentalRequest, RentalResponse
from shared.exceptions.cars import VehicleNotFoundError

class CreateRentalUseCase:
    def __init__(self, vehicle_repository: VehicleRepository, car_rental_repository: CarRentalRepository):
        self._vehicle_repository = vehicle_repository
        self._car_rental_repository = car_rental_repository
    
    async def execute(self, request: CreateRentalRequest) -> RentalResponse:
        vehicle = await self._vehicle_repository.get_by_id(request.vehicle_id)
        if not vehicle:
            raise VehicleNotFoundError()
        
        rental_days = (request.return_date - request.pickup_date).days
        total_cost = vehicle.daily_rate.amount * rental_days
        
        rental = CarRental(
            id=0, # Will be set by repository
            vehicle_id=request.vehicle_id,
            renter_id=request.renter_id,
            pickup_date=request.pickup_date,
            return_date=request.return_date,
            total_cost=Money(total_cost, "KES"),
            status="CONFIRMED",
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        saved_rental = await self._car_rental_repository.create(rental)
        return RentalResponse.from_entity(saved_rental)
