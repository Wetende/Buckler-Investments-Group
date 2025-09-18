"""User role value object for domain layer."""
from enum import Enum


class UserRole(str, Enum):
    """Deprecated: Kept for backward compatibility. Use shared.constants.user_roles.UserRole instead."""
    BUYER = "USER"
    AGENT = "AGENT"
    ADMIN = "ADMIN"
