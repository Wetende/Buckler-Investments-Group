"""Property status value object for domain layer."""
from enum import Enum


class PropertyStatus(str, Enum):
    """Property status enumeration."""
    PENDING_APPROVAL = "PENDING_APPROVAL"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    AVAILABLE = "AVAILABLE"
    PENDING = "PENDING"
    SOLD = "SOLD"
    RENTED = "RENTED"
    WITHDRAWN = "WITHDRAWN"
