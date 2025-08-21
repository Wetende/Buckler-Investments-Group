from abc import abstractmethod
from typing import Optional

from app.domain.entities.user import User
from app.domain.repositories.base import BaseRepository

class UserRepository(BaseRepository[User]):
    @abstractmethod
    async def get_by_email(self, email: str) -> Optional[User]:
        """Find a user by their email address."""
        pass

    @abstractmethod
    async def is_agent(self, user_id: int) -> bool:
        """Check if a user has the 'agent' role."""
        pass
