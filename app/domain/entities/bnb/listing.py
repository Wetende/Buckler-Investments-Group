from dataclasses import dataclass
from decimal import Decimal
from typing import Optional, List
from datetime import date, datetime
from ..base import DomainEntity
from ...value_objects.money import Money
from ...value_objects.booking_status import StListingType, CancellationPolicy

@dataclass
class ShortTermListing(DomainEntity):
    # Inherited from DomainEntity: id, created_at, updated_at
    # Required fields with defaults to satisfy dataclass ordering
    host_id: int = 0
    title: str = ""
    listing_type: StListingType = None
    capacity: int = 1
    nightly_price: Money = None
    address: str = ""
    # Location fields for Airbnb-style grouping
    county: Optional[str] = None
    town: Optional[str] = None
    area_id: Optional[int] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    amenities: Optional[dict] = None
    rules: Optional[dict] = None
    instant_book: bool = False
    min_nights: Optional[int] = None
    max_nights: Optional[int] = None
    cancellation_policy: CancellationPolicy = CancellationPolicy.MODERATE
    
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
    
    def get_location_display(self) -> str:
        """Business logic: get display-friendly location"""
        if self.town and self.county:
            return f"{self.town}, {self.county}"
        elif self.county:
            return self.county
        elif self.town:
            return self.town
        else:
            # Fallback to address if structured location not available
            return self.address.split(',')[0] if self.address else "Unknown Location"
    
    def is_in_county(self, county: str) -> bool:
        """Business rule: check if listing is in specified county"""
        return self.county and self.county.lower() == county.lower()
    
    def is_in_town(self, town: str) -> bool:
        """Business rule: check if listing is in specified town"""
        return self.town and self.town.lower() == town.lower()
    
    def get_location_hierarchy(self) -> dict:
        """Business logic: get structured location hierarchy"""
        return {
            "county": self.county,
            "town": self.town,
            "area_id": self.area_id,
            "display": self.get_location_display()
        }
