from dataclasses import dataclass
from datetime import datetime
from ..base import DomainEntity
from ...value_objects.money import Money

@dataclass
class CarRental(DomainEntity):
    vehicle_id: int
    renter_id: int
    pickup_date: datetime
    return_date: datetime
    total_cost: Money
    status: str
