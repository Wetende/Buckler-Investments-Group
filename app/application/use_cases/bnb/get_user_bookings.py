from typing import List
from domain.repositories.bnb import BookingRepository
from application.dto.bnb import BookingRead

class GetUserBookingsUseCase:
    def __init__(self, booking_repository: BookingRepository):
        self._booking_repository = booking_repository
    
    async def execute(self, guest_id: int) -> List[BookingRead]:
        bookings = await self._booking_repository.get_by_guest(guest_id)
        
        return [
            BookingRead(
                id=booking.id,
                listing_id=booking.listing_id,
                guest_id=booking.guest_id,
                check_in=booking.check_in,
                check_out=booking.check_out,
                guests=booking.guests,
                status=booking.status,
                amount_total=booking.total_amount.amount,
                currency=booking.total_amount.currency,
                created_at=booking.created_at,
                updated_at=booking.updated_at
            )
            for booking in bookings
        ]
