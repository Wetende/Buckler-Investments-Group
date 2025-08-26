from domain.repositories.tours import TourRepository
from shared.exceptions.tours import TourNotFoundError

class DeleteTourUseCase:
    def __init__(self, tour_repository: TourRepository):
        self._tour_repository = tour_repository
    
    async def execute(self, tour_id: int) -> None:
        tour = await self._tour_repository.get_by_id(tour_id)
        
        if not tour:
            raise TourNotFoundError(f"Tour with ID {tour_id} not found")
        
        await self._tour_repository.delete(tour_id)
