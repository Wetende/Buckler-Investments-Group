"""User-related domain events."""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional, Dict, Any

from .base import DomainEvent


@dataclass
class UserRegisteredEvent(DomainEvent):
    """Event raised when a new user registers."""
    
    user_id: int
    email: str
    first_name: str
    last_name: str
    phone_number: Optional[str] = None
    registration_method: str = "email"  # 'email', 'google', 'facebook'
    verification_required: bool = True


@dataclass
class UserVerifiedEvent(DomainEvent):
    """Event raised when a user completes email/phone verification."""
    
    user_id: int
    email: str
    verification_type: str  # 'email', 'phone', 'identity'
    verified_at: datetime


@dataclass
class UserProfileUpdatedEvent(DomainEvent):
    """Event raised when a user updates their profile."""
    
    user_id: int
    email: str
    updated_fields: Dict[str, Any]
    updated_at: datetime


@dataclass
class UserDeactivatedEvent(DomainEvent):
    """Event raised when a user account is deactivated."""
    
    user_id: int
    email: str
    deactivated_by: str  # 'user', 'admin', 'system'
    reason: Optional[str] = None
    deactivated_at: datetime


@dataclass
class UserReactivatedEvent(DomainEvent):
    """Event raised when a user account is reactivated."""
    
    user_id: int
    email: str
    reactivated_by: str
    reactivated_at: datetime


@dataclass
class UserPasswordChangedEvent(DomainEvent):
    """Event raised when a user changes their password."""
    
    user_id: int
    email: str
    changed_at: datetime
    ip_address: Optional[str] = None


@dataclass
class UserLoginEvent(DomainEvent):
    """Event raised when a user logs in."""
    
    user_id: int
    email: str
    login_method: str  # 'password', 'social', 'token'
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    successful: bool = True


@dataclass
class UserRoleChangedEvent(DomainEvent):
    """Event raised when a user's role is changed."""
    
    user_id: int
    email: str
    old_role: str
    new_role: str
    changed_by: int  # admin user ID
    changed_at: datetime
