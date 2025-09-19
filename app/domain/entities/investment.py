from dataclasses import dataclass
from decimal import Decimal
from typing import Optional

from .base import DomainEntity
from ..value_objects.money import Money

@dataclass
class Investment(DomainEntity):
    # Required fields with defaults to satisfy dataclass ordering
    property_id: int = 0
    title: str = ""
    description: str = ""
    total_value: Money = None
    min_investment: Money = None
    expected_yield: Decimal = Decimal("0")  # As a percentage, e.g., 7.5 for 7.5%
    status: str = "FUNDING"  # e.g., 'FUNDING', 'ACTIVE', 'CLOSED'

    def is_funding_open(self) -> bool:
        return self.status == 'FUNDING'

@dataclass
class InvestmentHolding(DomainEntity):
    # Required fields with defaults to satisfy dataclass ordering
    investment_id: int = 0
    user_id: int = 0
    amount_invested: Money = None
    shares: Decimal = Decimal("0")  # Number of shares or percentage ownership
