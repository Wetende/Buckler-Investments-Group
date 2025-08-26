from domain.repositories.bnb import BookingRepository
from domain.value_objects.booking_status import BookingStatus
from shared.exceptions.bnb import BookingNotFoundError, BookingRejectionError

class RejectBookingUseCase:
    def __init__(self, booking_repository: BookingRepository):
        self._booking_repository = booking_repository
    
    async def execute(self, booking_id: int, reason: str = None) -> None:
        booking = await self._booking_repository.get_by_id(booking_id)
        
        if not booking:
            raise BookingNotFoundError(f"Booking with ID {booking_id} not found")
        
        if booking.status not in [BookingStatus.PENDING.value, BookingStatus.CONFIRMED.value]:
            raise BookingRejectionError(f"Booking cannot be rejected. Current status: {booking.status}")
        
        # Update booking status to rejected
        booking.status = BookingStatus.REJECTED.value
        # Could also store rejection reason in metadata or separate field
        await self._booking_repository.update(booking)
