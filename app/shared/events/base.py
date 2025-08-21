"""Base classes for domain events system."""

from abc import ABC, abstractmethod
from datetime import datetime
from dataclasses import dataclass, field
from typing import Any, Dict, List
import uuid


@dataclass
class DomainEvent(ABC):
    """Base class for all domain events."""
    
    event_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    occurred_at: datetime = field(default_factory=datetime.now)
    version: str = "1.0"
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert event to dictionary for serialization."""
        return {
            "event_id": self.event_id,
            "event_type": self.__class__.__name__,
            "occurred_at": self.occurred_at.isoformat(),
            "version": self.version,
            "data": {k: v for k, v in self.__dict__.items() 
                    if k not in ["event_id", "occurred_at", "version"]}
        }


class EventHandler(ABC):
    """Base class for event handlers."""
    
    @abstractmethod
    async def handle(self, event: DomainEvent) -> None:
        """Handle the domain event."""
        pass


class EventDispatcher:
    """Event dispatcher for publishing domain events."""
    
    def __init__(self):
        self._handlers: Dict[str, List[EventHandler]] = {}
    
    def register_handler(self, event_type: str, handler: EventHandler) -> None:
        """Register an event handler for a specific event type."""
        if event_type not in self._handlers:
            self._handlers[event_type] = []
        self._handlers[event_type].append(handler)
    
    async def dispatch(self, event: DomainEvent) -> None:
        """Dispatch an event to all registered handlers."""
        event_type = event.__class__.__name__
        handlers = self._handlers.get(event_type, [])
        
        for handler in handlers:
            try:
                await handler.handle(event)
            except Exception as e:
                # Log error but don't stop other handlers
                # TODO: Add proper logging
                print(f"Error handling event {event_type}: {e}")


# Global event dispatcher instance
event_dispatcher = EventDispatcher()
