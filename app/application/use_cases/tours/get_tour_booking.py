from domain.repositories.tours import TourBookingRepository
from application.dto.tours import TourBookingResponseDTO
from shared.exceptions.tours import TourBookingNotFoundError


class GetTourBookingUseCase:
    def __init__(self, tour_booking_repository: TourBookingRepository):
        self._tour_booking_repository = tour_booking_repository

    async def execute(self, booking_id: int) -> TourBookingResponseDTO:
        booking = await self._tour_booking_repository.get_by_id(booking_id)
        if not booking:
            raise TourBookingNotFoundError(f"Tour booking with ID {booking_id} not found")

        return TourBookingResponseDTO(
            id=booking.id,
            tour_id=booking.tour_id,
            customer_id=booking.customer_id,
            booking_date=booking.booking_date,
            participants=booking.participants,
            total_price=booking.total_price.amount,
            currency=booking.total_price.currency,
            status=booking.status,
            created_at=booking.created_at,
            updated_at=booking.updated_at,
        )




