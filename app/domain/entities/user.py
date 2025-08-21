from dataclasses import dataclass, field
from typing import List, Optional

from .base import DomainEntity

@dataclass
class UserRole:
    name: str
    permissions: List[str] = field(default_factory=list)

@dataclass
class User(DomainEntity):
    email: str
    hashed_password: str
    full_name: Optional[str] = None
    is_active: bool = True
    roles: List[UserRole] = field(default_factory=list)

    def is_agent(self) -> bool:
        return any(role.name == 'agent' for role in self.roles)
