from typing import List
from domain.repositories.tours import TourBookingRepository, TourRepository
from application.dto.tours import TourBookingResponseDTO

class GetOperatorTourBookingsUseCase:
    def __init__(self, booking_repository: TourBookingRepository, tour_repository: TourRepository):
        self._booking_repository = booking_repository
        self._tour_repository = tour_repository
    
    async def execute(self, operator_id: int) -> List[TourBookingResponseDTO]:
        # Get all tours for this operator
        operator_tours = await self._tour_repository.get_by_operator(operator_id)
        tour_ids = [tour.id for tour in operator_tours]
        
        # Get all bookings for these tours
        all_bookings = []
        for tour_id in tour_ids:
            bookings = await self._booking_repository.get_by_tour_id(tour_id)
            all_bookings.extend(bookings)
        
        return [
            TourBookingResponseDTO(
                id=booking.id,
                tour_id=booking.tour_id,
                customer_id=booking.customer_id,
                booking_date=booking.booking_date,
                participants=booking.participants,
                status=booking.status,
                total_price=booking.total_amount.amount,
                currency=booking.total_amount.currency,
                created_at=booking.created_at,
                updated_at=booking.updated_at
            )
            for booking in all_bookings
        ]
