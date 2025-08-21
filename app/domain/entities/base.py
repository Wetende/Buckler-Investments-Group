from abc import ABC
from typing import Any, Dict
from dataclasses import dataclass
from datetime import datetime

@dataclass
class DomainEntity(ABC):
    """Base class for all domain entities"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    def to_dict(self) -> Dict[str, Any]:
        return self.__dict__
