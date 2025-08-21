from abc import abstractmethod
from typing import List, Optional
from datetime import date
from .base import BaseRepository
from ..entities.bnb import ShortTermListing, Booking

class BnbRepository(BaseRepository[ShortTermListing]):
    @abstractmethod
    async def search_available(
        self, 
        check_in: date, 
        check_out: date, 
        guests: int
    ) -> List[ShortTermListing]:
        pass
    
    @abstractmethod
    async def get_by_host(self, host_id: int) -> List[ShortTermListing]:
        pass

class BookingRepository(BaseRepository):
    @abstractmethod
    async def get_by_guest(self, guest_id: int) -> List[Booking]:
        pass
