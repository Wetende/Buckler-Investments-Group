from abc import ABC, abstractmethod
from typing import Optional

from ..entities.bundle import Bundle

class BundleRepository(ABC):
    @abstractmethod
    async def create(self, entity: Bundle) -> Bundle:
        raise NotImplementedError

    @abstractmethod
    async def find_by_id(self, bundle_id: int) -> Optional[Bundle]:
        raise NotImplementedError
