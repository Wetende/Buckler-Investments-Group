from typing import List
from domain.repositories.bnb import BookingRepository, BnbRepository
from application.dto.bnb import BookingRead

class GetHostBookingsUseCase:
    def __init__(self, booking_repository: BookingRepository, bnb_repository: BnbRepository):
        self._booking_repository = booking_repository
        self._bnb_repository = bnb_repository
    
    async def execute(self, host_id: int) -> List[BookingRead]:
        # Get all listings for this host
        host_listings = await self._bnb_repository.get_by_host(host_id)
        listing_ids = [listing.id for listing in host_listings]
        
        # Get all bookings for these listings
        all_bookings = []
        for listing_id in listing_ids:
            bookings = await self._booking_repository.get_by_listing_id(listing_id)
            all_bookings.extend(bookings)
        
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
            for booking in all_bookings
        ]
