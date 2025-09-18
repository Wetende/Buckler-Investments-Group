from typing import List, Optional
from domain.repositories.cars import CarRentalRepository
from application.dto.cars import RentalResponse


class ListRentalsUseCase:
    def __init__(self, rental_repository: CarRentalRepository):
        self._rental_repository = rental_repository

    async def execute(
        self,
        vehicle_id: Optional[int] = None,
        renter_id: Optional[int] = None,
        limit: int = 20,
        offset: int = 0
    ) -> List[RentalResponse]:
        """List rentals with optional filtering"""
        
        if vehicle_id:
            rentals = await self._rental_repository.get_by_vehicle(vehicle_id, limit, offset)
        elif renter_id:
            rentals = await self._rental_repository.get_by_renter(renter_id, limit, offset)
        else:
            rentals = await self._rental_repository.list_all(limit, offset)
        
        return [RentalResponse.from_entity(rental) for rental in rentals]
