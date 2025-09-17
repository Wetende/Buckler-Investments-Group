from typing import List, Optional
from domain.repositories.tours import TourRepository
from application.dto.tours import TourResponseDTO

class ListToursUseCase:
    def __init__(self, tour_repository: TourRepository):
        self._tour_repository = tour_repository
    
    async def execute(
        self,
        limit: int = 20,
        offset: int = 0,
        operator_id: Optional[int] = None,
        category: Optional[str] = None,
        max_price: Optional[float] = None,
    ) -> List[TourResponseDTO]:
        # For now, get all and filter in memory (DB filter could be added later)
        tours = await self._tour_repository.list(limit=limit, offset=offset)
        if operator_id is not None:
            tours = [t for t in tours if getattr(t, 'operator_id', None) == operator_id]
        if max_price is not None:
            tours = [t for t in tours if t.price.amount <= max_price]
        
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
