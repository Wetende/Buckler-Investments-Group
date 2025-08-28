from typing import List
from domain.repositories.tours import TourBookingRepository
from application.dto.tours import TourBookingResponseDTO


class GetUserTourBookingsUseCase:
    def __init__(self, tour_booking_repository: TourBookingRepository):
        self._tour_booking_repository = tour_booking_repository

    async def execute(self, customer_id: int) -> List[TourBookingResponseDTO]:
        bookings = await self._tour_booking_repository.get_by_customer(customer_id)
        return [
            TourBookingResponseDTO(
                id=b.id,
                tour_id=b.tour_id,
                customer_id=b.customer_id,
                booking_date=b.booking_date,
                participants=b.participants,
                total_price=b.total_price.amount,
                currency=b.total_price.currency,
                status=b.status,
                created_at=b.created_at,
                updated_at=b.updated_at,
            )
            for b in bookings
        ]






