from abc import abstractmethod
from typing import List

from app.domain.entities.investment import Investment, InvestmentHolding
from app.domain.repositories.base import BaseRepository

class InvestmentRepository(BaseRepository[Investment]):
    @abstractmethod
    async def find_by_status(self, status: str) -> List[Investment]:
        """Find all investments with a specific status."""
        pass

class InvestmentHoldingRepository(BaseRepository[InvestmentHolding]):
    @abstractmethod
    async def find_by_user_id(self, user_id: int) -> List[InvestmentHolding]:
        """Find all investment holdings for a specific user."""
        pass

    @abstractmethod
    async def find_by_investment_id(self, investment_id: int) -> List[InvestmentHolding]:
        """Find all holdings for a specific investment."""
        pass
