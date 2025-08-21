"""User role value object for domain layer."""
from enum import Enum


class UserRole(str, Enum):
    """User roles for the property listing platform."""
    BUYER = "BUYER"
    AGENT = "AGENT"
    ADMIN = "ADMIN"
