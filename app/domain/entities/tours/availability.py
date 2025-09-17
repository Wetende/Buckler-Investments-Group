from dataclasses import dataclass
from datetime import date
from ..base import DomainEntity
from typing import Optional
from decimal import Decimal


@dataclass
class TourAvailability(DomainEntity):
    tour_id: int
    date: date
    available_spots: int
    price_override: Optional[Decimal] = None


