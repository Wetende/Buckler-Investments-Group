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
    
    @abstractmethod
    async def list_with_location(self, limit: int = 100, offset: int = 0) -> List[ShortTermListing]:
        """Get listings with location data populated for grouping"""
        pass
    
    @abstractmethod
    async def list_by_location(
        self, 
        county: str = None, 
        town: str = None,
        limit: int = 20, 
        offset: int = 0
    ) -> List[ShortTermListing]:
        """Get listings filtered by county and/or town"""
        pass
    
    @abstractmethod
    async def get_location_stats(self) -> List[dict]:
        """Get statistics about listings grouped by location"""
        pass
    
    @abstractmethod
    async def get_with_host(self, listing_id: int) -> tuple[Optional[ShortTermListing], Optional[dict]]:
        """Get listing with host information (listing, host_info)"""
        pass

class BookingRepository(BaseRepository):
    @abstractmethod
    async def get_by_guest(self, guest_id: int) -> List[Booking]:
        pass
    
    @abstractmethod
    async def get_by_listing_id(self, listing_id: int) -> List[Booking]:
        pass