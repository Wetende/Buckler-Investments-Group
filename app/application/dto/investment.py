from pydantic import BaseModel
from decimal import Decimal

from application.dto.property import MoneyDTO
from domain.entities.investment import Investment, InvestmentHolding

class InvestmentResponseDTO(BaseModel):
    id: int
    property_id: int
    title: str
    description: str
    total_value: MoneyDTO
    min_investment: MoneyDTO
    expected_yield: Decimal
    status: str

    @classmethod
    def from_entity(cls, entity: Investment) -> "InvestmentResponseDTO":
        return cls(
            id=entity.id,
            property_id=entity.property_id,
            title=entity.title,
            description=entity.description,
            total_value=MoneyDTO(amount=entity.total_value.amount, currency=entity.total_value.currency),
            min_investment=MoneyDTO(amount=entity.min_investment.amount, currency=entity.min_investment.currency),
            expected_yield=entity.expected_yield,
            status=entity.status,
        )

class InvestmentHoldingResponseDTO(BaseModel):
    id: int
    investment_id: int
    user_id: int
    amount_invested: MoneyDTO
    shares: Decimal

    @classmethod
    def from_entity(cls, entity: InvestmentHolding) -> "InvestmentHoldingResponseDTO":
        return cls(
            id=entity.id,
            investment_id=entity.investment_id,
            user_id=entity.user_id,
            amount_invested=MoneyDTO(amount=entity.amount_invested.amount, currency=entity.amount_invested.currency),
            shares=entity.shares,
        )

class MakeInvestmentRequestDTO(BaseModel):
    investment_id: int
    user_id: int
    amount: Decimal
