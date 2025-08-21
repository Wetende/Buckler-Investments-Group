from abc import abstractmethod
from typing import List
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

class CarRentalRepository(BaseRepository[CarRental]):
    @abstractmethod
    async def get_by_renter(self, renter_id: int) -> List[CarRental]:
        pass
