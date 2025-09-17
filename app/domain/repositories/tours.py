from abc import abstractmethod
from typing import List
from datetime import date
from .base import BaseRepository
from ..entities.tours import Tour, TourBooking
from ..entities.tours.availability import TourAvailability

class TourRepository(BaseRepository[Tour]):
    @abstractmethod
    async def search_by_location_and_date(
        self, 
        location: str, 
        start_date: date
    ) -> List[Tour]:
        pass

class TourBookingRepository(BaseRepository[TourBooking]):
    @abstractmethod
    async def get_by_customer(self, customer_id: int) -> List[TourBooking]:
        pass


class TourAvailabilityRepository(BaseRepository[TourAvailability]):
    @abstractmethod
    async def get_range(self, tour_id: int, start_date: date, end_date: date) -> List[TourAvailability]:
        pass
