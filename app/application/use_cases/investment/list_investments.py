from typing import List, Optional

from application.dto.investment import InvestmentResponseDTO
from domain.repositories.investment import InvestmentRepository

class ListInvestmentsUseCase:
    def __init__(self, investment_repository: InvestmentRepository):
        self._investment_repository = investment_repository

    async def execute(self, status: Optional[str] = None) -> List[InvestmentResponseDTO]:
        if status:
            investments = await self._investment_repository.find_by_status(status)
        else:
            investments = await self._investment_repository.list()
        
        return [InvestmentResponseDTO.from_entity(inv) for inv in investments]
