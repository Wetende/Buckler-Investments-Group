from abc import ABC, abstractmethod
from typing import List, Optional

from ..entities.bundle_booking import BundleBooking

class BundleBookingRepository(ABC):
    @abstractmethod
    async def create(self, entity: BundleBooking) -> BundleBooking:
        raise NotImplementedError

    @abstractmethod
    async def get_by_id(self, booking_id: int) -> Optional[BundleBooking]:
        raise NotImplementedError

    @abstractmethod
    async def get_by_user_id(self, user_id: int) -> List[BundleBooking]:
        raise NotImplementedError
