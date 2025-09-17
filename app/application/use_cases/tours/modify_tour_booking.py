from datetime import datetime
from domain.repositories.tours import TourBookingRepository, TourRepository
from application.dto.tours import TourBookingCreateUpdateDTO, TourBookingResponseDTO
from shared.exceptions.tours import TourBookingNotFoundError, TourNotFoundError
from domain.value_objects.money import Money


class ModifyTourBookingUseCase:
    def __init__(self, tour_booking_repository: TourBookingRepository, tour_repository: TourRepository):
        self._tour_booking_repository = tour_booking_repository
        self._tour_repository = tour_repository

    async def execute(self, booking_id: int, update: TourBookingCreateUpdateDTO) -> TourBookingResponseDTO:
        existing = await self._tour_booking_repository.get_by_id(booking_id)
        if not existing:
            raise TourBookingNotFoundError()

        # If tour changed (or to recompute price), fetch tour pricing
        tour = await self._tour_repository.get_by_id(existing.tour_id)
        if not tour:
            raise TourNotFoundError()

        # Recalculate total price based on new participants
        total_price = Money(tour.price.amount * update.participants, tour.price.currency)

        # Apply updates
        existing.booking_date = update.booking_date
        existing.participants = update.participants
        existing.total_price = total_price
        existing.status = existing.status  # keep status
        existing.updated_at = datetime.now()

        saved = await self._tour_booking_repository.update(existing)

        return TourBookingResponseDTO(
            id=saved.id,
            tour_id=saved.tour_id,
            customer_id=saved.customer_id,
            booking_date=saved.booking_date,
            participants=saved.participants,
            total_price=saved.total_price.amount,
            currency=saved.total_price.currency,
            status=saved.status,
            created_at=saved.created_at,
            updated_at=saved.updated_at,
        )


