from dataclasses import dataclass
from typing import Optional
from ..base import DomainEntity
from ...value_objects.money import Money

@dataclass
class Tour(DomainEntity):
    name: str
    description: str
    price: Money
    duration_hours: int
    operator_id: int
    max_participants: int
    included_services: Optional[dict] = None
