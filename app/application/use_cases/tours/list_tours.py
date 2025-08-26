from typing import List
from domain.repositories.tours import TourRepository
from application.dto.tours import TourResponseDTO

class ListToursUseCase:
    def __init__(self, tour_repository: TourRepository):
        self._tour_repository = tour_repository
    
    async def execute(self, limit: int = 20, offset: int = 0) -> List[TourResponseDTO]:
        tours = await self._tour_repository.get_all(limit=limit, offset=offset)
        
        return [
            TourResponseDTO(
                id=tour.id,
                name=tour.name,
                description=tour.description,
                price=tour.price.amount,
                currency=tour.price.currency,
                duration_hours=tour.duration_hours,
                operator_id=tour.operator_id,
                max_participants=tour.max_participants,
                included_services=tour.included_services,
                created_at=tour.created_at,
                updated_at=tour.updated_at
            )
            for tour in tours
        ]
