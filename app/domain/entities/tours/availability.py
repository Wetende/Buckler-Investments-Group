from dataclasses import dataclass
from datetime import date
from ..base import DomainEntity
from typing import Optional
from decimal import Decimal


@dataclass
class TourAvailability(DomainEntity):
    # Required fields with defaults to satisfy dataclass ordering
    tour_id: int = 0
    date: date = None
    available_spots: int = 0
    price_override: Optional[Decimal] = None



