from domain.repositories.bnb import BookingRepository
from domain.value_objects.booking_status import BookingStatus
from shared.exceptions.bnb import BookingNotFoundError, BookingCancellationError

class CancelBookingUseCase:
    def __init__(self, booking_repository: BookingRepository):
        self._booking_repository = booking_repository
    
    async def execute(self, booking_id: int) -> None:
        booking = await self._booking_repository.get_by_id(booking_id)
        
        if not booking:
            raise BookingNotFoundError(f"Booking with ID {booking_id} not found")
        
        if not booking.can_be_cancelled():
            raise BookingCancellationError("Booking cannot be cancelled in current status")
        
        # Update booking status to cancelled
        booking.status = BookingStatus.CANCELLED.value
        await self._booking_repository.update(booking)
