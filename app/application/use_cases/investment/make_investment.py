from datetime import datetime
from decimal import Decimal

from application.dto.investment import MakeInvestmentRequestDTO, InvestmentHoldingResponseDTO
from domain.entities.investment import InvestmentHolding
from domain.repositories.investment import InvestmentRepository, InvestmentHoldingRepository
from domain.value_objects.money import Money
from shared.exceptions.investment import (
    InvestmentNotFoundError,
    InvestmentClosedError,
    InvalidInvestmentAmountError,
)

class MakeInvestmentUseCase:
    def __init__(
        self,
        investment_repository: InvestmentRepository,
        holding_repository: InvestmentHoldingRepository,
    ):
        self._investment_repo = investment_repository
        self._holding_repo = holding_repository

    async def execute(self, request: MakeInvestmentRequestDTO) -> InvestmentHoldingResponseDTO:
        investment = await self._investment_repo.get_by_id(request.investment_id)
        if not investment:
            raise InvestmentNotFoundError("Investment not found.")

        if not investment.is_funding_open():
            raise InvestmentClosedError("This investment is not open for funding.")

        if request.amount < investment.min_investment.amount:
            raise InvalidInvestmentAmountError(f"Investment amount must be at least {investment.min_investment}.")

        # Calculate shares based on the proportion of the total value
        shares = (request.amount / investment.total_value.amount) * Decimal("100")

        holding = InvestmentHolding(
            id=0,  # To be set by repository
            investment_id=request.investment_id,
            user_id=request.user_id,
            amount_invested=Money(amount=request.amount, currency=investment.total_value.currency),
            shares=shares,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        created_holding = await self._holding_repo.create(holding)

        return InvestmentHoldingResponseDTO.from_entity(created_holding)
