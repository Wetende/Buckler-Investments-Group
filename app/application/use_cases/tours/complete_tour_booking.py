from datetime import datetime
from domain.repositories.tours import TourBookingRepository
from application.dto.tours import TourBookingResponseDTO
from shared.exceptions.tours import TourBookingNotFoundError
from shared.constants.booking_status import BookingStatus


class CompleteTourBookingUseCase:
    def __init__(self, tour_booking_repository: TourBookingRepository):
        self._tour_booking_repository = tour_booking_repository

    async def execute(self, booking_id: int) -> TourBookingResponseDTO:
        booking = await self._tour_booking_repository.get_by_id(booking_id)
        if not booking:
            raise TourBookingNotFoundError()

        booking.status = BookingStatus.COMPLETED.value
        booking.updated_at = datetime.now()

        saved = await self._tour_booking_repository.update(booking)
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



