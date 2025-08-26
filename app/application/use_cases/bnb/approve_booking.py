from domain.repositories.bnb import BookingRepository
from domain.value_objects.booking_status import BookingStatus
from shared.exceptions.bnb import BookingNotFoundError, BookingApprovalError

class ApproveBookingUseCase:
    def __init__(self, booking_repository: BookingRepository):
        self._booking_repository = booking_repository
    
    async def execute(self, booking_id: int) -> None:
        booking = await self._booking_repository.get_by_id(booking_id)
        
        if not booking:
            raise BookingNotFoundError(f"Booking with ID {booking_id} not found")
        
        if booking.status != BookingStatus.PENDING.value:
            raise BookingApprovalError(f"Booking is not in pending status. Current status: {booking.status}")
        
        # Update booking status to confirmed
        booking.status = BookingStatus.CONFIRMED.value
        await self._booking_repository.update(booking)
