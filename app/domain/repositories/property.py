from abc import abstractmethod
from typing import List, Optional

from ..entities.property import Property
from .base import BaseRepository

class PropertyRepository(BaseRepository[Property]):
    @abstractmethod
    async def search(
        self,
        location: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        min_bedrooms: Optional[int] = None,
        min_bathrooms: Optional[float] = None,
    ) -> List[Property]:
        """Search for properties based on various criteria."""
        pass

    @abstractmethod
    async def find_by_agent(self, agent_id: int) -> List[Property]:
        """Find all properties listed by a specific agent."""
        pass
