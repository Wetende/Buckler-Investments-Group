from abc import abstractmethod
from typing import List, Optional
from datetime import datetime
from .base import BaseRepository
from ..entities.cars import Vehicle, CarRental

class VehicleRepository(BaseRepository[Vehicle]):
    @abstractmethod
    async def search_available(
        self, 
        start_date: datetime, 
        end_date: datetime
    ) -> List[Vehicle]:
        pass
    
    @abstractmethod
    async def get_by_owner(self, owner_id: int, limit: int = 20, offset: int = 0) -> List[Vehicle]:
        pass
    
    @abstractmethod
    async def list_all(self, limit: int = 20, offset: int = 0) -> List[Vehicle]:
        pass

class CarRentalRepository(BaseRepository[CarRental]):
    @abstractmethod
    async def get_by_renter(self, renter_id: int, limit: int = 20, offset: int = 0) -> List[CarRental]:
        pass
    
    @abstractmethod
    async def get_by_vehicle(self, vehicle_id: int, limit: int = 20, offset: int = 0) -> List[CarRental]:
        pass
    
    @abstractmethod
    async def list_all(self, limit: int = 20, offset: int = 0) -> List[CarRental]:
        pass
    
    @abstractmethod
    async def get_active_by_vehicle(self, vehicle_id: int) -> List[CarRental]:
        pass
    
    @abstractmethod
    async def get_overlapping_rentals(
        self, 
        vehicle_id: int, 
        start_date: datetime, 
        end_date: datetime
    ) -> List[CarRental]:
        pass
