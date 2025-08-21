from dataclasses import dataclass, field
from typing import List, Optional

from app.domain.entities.base import DomainEntity
from app.domain.value_objects.money import Money

@dataclass(frozen=True)
class PropertyFeatures:
    bedrooms: int
    bathrooms: float
    square_feet: int
    lot_size_acres: Optional[float] = None
    year_built: Optional[int] = None
    garage_spaces: Optional[int] = None

@dataclass
class Property(DomainEntity):
    agent_id: int
    title: str
    description: str
    address: str
    listing_price: Money
    property_type: str  # e.g., 'SINGLE_FAMILY', 'APARTMENT', 'LAND'
    status: str  # e.g., 'FOR_SALE', 'SOLD', 'PENDING'
    features: PropertyFeatures
    image_urls: List[str] = field(default_factory=list)

    def update_price(self, new_price: Money) -> None:
        if new_price.amount <= 0:
            raise ValueError("Price must be positive.")
        self.listing_price = new_price

    def change_status(self, new_status: str) -> None:
        allowed_statuses = ['FOR_SALE', 'SOLD', 'PENDING', 'OFF_MARKET']
        if new_status not in allowed_statuses:
            raise ValueError(f"Invalid status. Must be one of {allowed_statuses}")
        self.status = new_status
