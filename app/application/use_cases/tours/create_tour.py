from domain.entities.tours.tour import Tour
from domain.repositories.tours import TourRepository
from application.dto.tours import TourCreateUpdateDTO, TourResponseDTO
from domain.value_objects.money import Money

class CreateTourUseCase:
    def __init__(self, tour_repository: TourRepository):
        self._tour_repository = tour_repository
    
    async def execute(self, request: TourCreateUpdateDTO) -> TourResponseDTO:
        # Convert DTO to domain entity
        tour_entity = Tour(
            id=0,  # Will be set by repository
            name=request.name,
            description=request.description,
            price=Money(request.price, request.currency or "KES"),
            duration_hours=request.duration_hours,
            operator_id=request.operator_id if hasattr(request, 'operator_id') else 1,  # TODO: Get from auth context
            max_participants=request.max_participants,
            included_services=request.included_services
        )
        
        if request.id == 0:
            # Create new tour
            saved_tour = await self._tour_repository.create(tour_entity)
        else:
            # Update existing tour
            tour_entity.id = request.id
            saved_tour = await self._tour_repository.update(tour_entity)
        
        # Convert back to DTO
        return TourResponseDTO(
            id=saved_tour.id,
            name=saved_tour.name,
            description=saved_tour.description,
            price=saved_tour.price.amount,
            currency=saved_tour.price.currency,
            duration_hours=saved_tour.duration_hours,
            operator_id=saved_tour.operator_id,
            max_participants=saved_tour.max_participants,
            included_services=saved_tour.included_services,
            created_at=saved_tour.created_at,
            updated_at=saved_tour.updated_at
        )
