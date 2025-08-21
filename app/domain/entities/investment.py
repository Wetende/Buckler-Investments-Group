from dataclasses import dataclass
from decimal import Decimal
from typing import Optional

from .base import DomainEntity
from ..value_objects.money import Money

@dataclass
class Investment(DomainEntity):
    property_id: int
    title: str
    description: str
    total_value: Money
    min_investment: Money
    expected_yield: Decimal  # As a percentage, e.g., 7.5 for 7.5%
    status: str  # e.g., 'FUNDING', 'ACTIVE', 'CLOSED'

    def is_funding_open(self) -> bool:
        return self.status == 'FUNDING'

@dataclass
class InvestmentHolding(DomainEntity):
    investment_id: int
    user_id: int
    amount_invested: Money
    shares: Decimal  # Number of shares or percentage ownership
