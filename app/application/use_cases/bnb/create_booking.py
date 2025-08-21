from datetime import datetime
from domain.repositories.bnb import BnbRepository, BookingRepository
from domain.entities.bnb import Booking
from ...dto.bnb import CreateBookingRequest, BookingResponse
from shared.exceptions.bnb import ListingNotFoundError, InvalidNightsError

class CreateBookingUseCase:
    def __init__(self, bnb_repository: BnbRepository, booking_repository: BookingRepository):
        self._bnb_repository = bnb_repository
        self._booking_repository = booking_repository
    
    async def execute(self, request: CreateBookingRequest) -> BookingResponse:
        # Get listing
        listing = await self._bnb_repository.get_by_id(request.listing_id)
        if not listing:
            raise ListingNotFoundError()
        
        # Validate business rules
        nights = (request.check_out - request.check_in).days
        if not listing.is_available_for_nights(nights):
            raise InvalidNightsError()
        
        # Calculate cost
        total_cost = listing.calculate_total_cost(request.check_in, request.check_out)
        
        # Create booking entity
        booking = Booking(
            id=0,  # Will be set by repository
            guest_id=request.guest_id,
            listing_id=request.listing_id,
            check_in=request.check_in,
            check_out=request.check_out,
            guests=request.guests,
            total_amount=total_cost,
            status="PENDING" if not listing.instant_book else "CONFIRMED",
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        # Save via repository
        saved_booking = await self._booking_repository.create(booking)
        return BookingResponse.from_entity(saved_booking)
