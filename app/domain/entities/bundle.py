from dataclasses import dataclass, field
from typing import List, Any, Dict
from decimal import Decimal

from .base import DomainEntity
from ..value_objects.money import Money

@dataclass
class BundledItem:
    item_id: Any
    item_type: str  # e.g., 'tour_booking', 'car_rental', 'bnb_booking'
    price: Money
    details: Dict[str, Any] = field(default_factory=dict)

@dataclass
class Bundle(DomainEntity):
    # Required fields with defaults to satisfy dataclass ordering
    user_id: int = 0
    items: List[BundledItem] = field(default_factory=list)
    total_price: Money = field(init=False, default=None)

    def __post_init__(self):
        self.calculate_total_price()

    def add_item(self, item: BundledItem):
        self.items.append(item)
        self.calculate_total_price()

    def calculate_total_price(self):
        if not self.items:
            self.total_price = Money(amount=Decimal("0.00"))
            return

        # Assuming all items will have the same currency for simplicity
        currency = self.items[0].price.currency
        total_amount = sum((item.price.amount for item in self.items), Decimal("0.00"))
        self.total_price = Money(amount=total_amount, currency=currency)
