"""
Host Application repository interface.
"""
from abc import ABC, abstractmethod
from typing import List, Optional
from domain.entities.host_application import HostApplication


class HostApplicationRepository(ABC):
    """Abstract repository for host applications"""
    
    @abstractmethod
    async def create(self, application: HostApplication) -> HostApplication:
        """Create a new host application"""
        pass
    
    @abstractmethod
    async def update(self, application: HostApplication) -> HostApplication:
        """Update an existing host application"""
        pass
    
    @abstractmethod
    async def get_by_id(self, application_id: int) -> Optional[HostApplication]:
        """Get host application by ID"""
        pass
    
    @abstractmethod
    async def get_by_user_id(self, user_id: int) -> Optional[HostApplication]:
        """Get host application by user ID (user can only have one application)"""
        pass
    
    @abstractmethod
    async def list_all(
        self, 
        status: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[HostApplication]:
        """List host applications with optional filtering"""
        pass
    
    @abstractmethod
    async def count_by_status(self, status: str) -> int:
        """Count applications by status"""
        pass
    
    @abstractmethod
    async def delete(self, application_id: int) -> bool:
        """Delete a host application"""
        pass
