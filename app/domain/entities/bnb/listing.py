from dataclasses import dataclass
from decimal import Decimal
from typing import Optional, List
from datetime import date
from ..base import DomainEntity
from ...value_objects.money import Money

@dataclass
class ShortTermListing(DomainEntity):
    host_id: int
    title: str
    listing_type: str
    capacity: int
    nightly_price: Money
    address: str
    amenities: Optional[dict] = None
    rules: Optional[dict] = None
    instant_book: bool = False
    min_nights: Optional[int] = None
    max_nights: Optional[int] = None
    
    def calculate_total_cost(self, check_in: date, check_out: date) -> Money:
        """Business logic for calculating total booking cost"""
        nights = (check_out - check_in).days
        total = Money(self.nightly_price.amount * nights, self.nightly_price.currency)
        return total
    
    def is_available_for_nights(self, nights: int) -> bool:
        """Business rule: check if listing accepts number of nights"""
        if self.min_nights and nights < self.min_nights:
            return False
        if self.max_nights and nights > self.max_nights:
            return False
        return True
