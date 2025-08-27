from datetime import datetime
from domain.repositories.tours import TourRepository, TourBookingRepository
from domain.entities.tours import TourBooking
from domain.value_objects.money import Money
from ...dto.tours import CreateTourBookingRequest, TourBookingResponse
from shared.exceptions.tours import TourNotFoundError

class CreateTourBookingUseCase:
    def __init__(self, tour_repository: TourRepository, tour_booking_repository: TourBookingRepository):
        self._tour_repository = tour_repository
        self._tour_booking_repository = tour_booking_repository
    
    async def execute(self, request: CreateTourBookingRequest) -> TourBookingResponse:
        tour = await self._tour_repository.get_by_id(request.tour_id)
        if not tour:
            raise TourNotFoundError()
        
        total_price_money = Money(tour.price.amount * request.participants, tour.price.currency)
        
        booking = TourBooking(
            id=0, # Will be set by repository
            tour_id=request.tour_id,
            customer_id=request.customer_id,
            booking_date=request.booking_date,
            participants=request.participants,
            total_price=total_price_money,
            status="CONFIRMED",
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        saved_booking = await self._tour_booking_repository.create(booking)
        return TourBookingResponse.from_entity(saved_booking)
