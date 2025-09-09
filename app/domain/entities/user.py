from dataclasses import dataclass
from typing import Optional

from .base import DomainEntity
from shared.constants.user_roles import UserRole

@dataclass
class User(DomainEntity):
    email: str
    hashed_password: str
    full_name: str
    is_active: bool = True
    role: UserRole = UserRole.USER
    phone_number: Optional[str] = None
    agent_license_id: Optional[str] = None
    agency_name: Optional[str] = None

    def is_agent(self) -> bool:
        return self.role == UserRole.AGENT
    
    def is_admin(self) -> bool:
        return self.role == UserRole.ADMIN
    
    def is_buyer(self) -> bool:
        return self.role == UserRole.USER