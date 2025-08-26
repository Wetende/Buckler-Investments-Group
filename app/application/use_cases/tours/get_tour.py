from domain.repositories.tours import TourRepository
from application.dto.tours import TourResponseDTO
from shared.exceptions.tours import TourNotFoundError

class GetTourUseCase:
    def __init__(self, tour_repository: TourRepository):
        self._tour_repository = tour_repository
    
    async def execute(self, tour_id: int) -> TourResponseDTO:
        tour = await self._tour_repository.get_by_id(tour_id)
        
        if not tour:
            raise TourNotFoundError(f"Tour with ID {tour_id} not found")
        
        return TourResponseDTO(
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
