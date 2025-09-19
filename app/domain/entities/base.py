from abc import ABC
from typing import Any, Dict, Optional
from dataclasses import dataclass, field
from datetime import datetime

@dataclass
class DomainEntity(ABC):
    """Base class for all domain entities"""
    id: int = 0  # Will be set by repository on creation
    created_at: Optional[datetime] = field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = field(default_factory=datetime.utcnow)
    
    def to_dict(self) -> Dict[str, Any]:
        return self.__dict__
