"""Investment-related value objects for domain layer."""
from enum import Enum


class OrderSide(str, Enum):
    """Investment order side."""
    BUY = "BUY"
    SELL = "SELL"


class OrderStatus(str, Enum):
    """Investment order status."""
    PENDING = "PENDING"
    SUBMITTED = "SUBMITTED"
    FILLED = "FILLED"
    CANCELED = "CANCELED"
    REJECTED = "REJECTED"
