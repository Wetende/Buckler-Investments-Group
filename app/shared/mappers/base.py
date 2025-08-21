"""Base mapper interface for domain-infrastructure translation."""
from abc import ABC, abstractmethod
from typing import TypeVar, Generic

DomainEntity = TypeVar('DomainEntity')
DatabaseModel = TypeVar('DatabaseModel')

class BaseMapper(ABC, Generic[DomainEntity, DatabaseModel]):
    """Base class for all mappers that convert between domain entities and database models."""
    
    @staticmethod
    @abstractmethod
    def model_to_entity(model: DatabaseModel) -> DomainEntity:
        """Convert database model to domain entity."""
        pass
    
    @staticmethod
    @abstractmethod
    def entity_to_model(entity: DomainEntity) -> DatabaseModel:
        """Convert domain entity to database model."""
        pass
