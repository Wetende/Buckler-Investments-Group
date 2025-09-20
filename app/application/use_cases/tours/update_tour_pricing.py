from domain.repositories.tours import TourRepository
from application.dto.tours import TourPricingUpdateDTO, TourResponseDTO
from shared.exceptions.tours import TourNotFoundError
from domain.value_objects.money import Money


class UpdateTourPricingUseCase:
    def __init__(self, tour_repository: TourRepository) -> None:
        self._tour_repository = tour_repository

    async def execute(self, tour_id: int, request: TourPricingUpdateDTO) -> TourResponseDTO:
        # Load existing tour
        tour = await self._tour_repository.get_by_id(tour_id)
        if not tour:
            raise TourNotFoundError(f"Tour with ID {tour_id} not found")

        # Update pricing
        new_currency = request.currency or tour.price.currency
        tour.price = Money(request.price, new_currency)

        # Persist
        saved = await self._tour_repository.update(tour)

        return TourResponseDTO(
            id=saved.id,
            name=saved.name,
            description=saved.description,
            price=saved.price.amount,
            currency=saved.price.currency,
            duration_hours=saved.duration_hours,
            operator_id=saved.operator_id,
            max_participants=saved.max_participants,
            included_services=saved.included_services,
            created_at=saved.created_at,
            updated_at=saved.updated_at,
        )
