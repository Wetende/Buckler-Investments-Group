from dataclasses import dataclass
from typing import List, Optional
from ..base import DomainEntity
from ...value_objects.money import Money

@dataclass
class Vehicle(DomainEntity):
    make: str
    model: str
    year: int
    daily_rate: Money
    owner_id: int
    features: Optional[List[str]] = None
