from domain.repositories.cars import CarRentalRepository
from application.dto.cars import RentalResponse
from shared.exceptions import RentalNotFoundError


class GetRentalUseCase:
    def __init__(self, rental_repository: CarRentalRepository):
        self._rental_repository = rental_repository

    async def execute(self, rental_id: int) -> RentalResponse:
        """Get rental by ID"""
        rental = await self._rental_repository.get_by_id(rental_id)
        
        if not rental:
            raise RentalNotFoundError(f"Rental with ID {rental_id} not found")
        
        return RentalResponse.from_entity(rental)
