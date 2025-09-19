from dataclasses import dataclass
from typing import Optional
from ..base import DomainEntity
from ...value_objects.money import Money

@dataclass
class Tour(DomainEntity):
    # Required fields with defaults to satisfy dataclass ordering
    name: str = ""
    description: str = ""
    price: Money = None
    duration_hours: int = 1
    operator_id: int = 0
    max_participants: int = 1
    included_services: Optional[dict] = None
