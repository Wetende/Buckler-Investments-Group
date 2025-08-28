"""Review repository interface."""
from abc import abstractmethod
from typing import List, Optional
from .base import BaseRepository
from ..entities.review import Review, ReviewStats


class ReviewRepository(BaseRepository[Review]):
    """Repository interface for Review entities."""
    
    @abstractmethod
    async def get_by_target(self, target_type: str, target_id: int) -> List[Review]:
        """Get all reviews for a specific target (listing, tour, car)."""
        pass
    
    @abstractmethod
    async def get_by_reviewer(self, reviewer_id: int) -> List[Review]:
        """Get all reviews written by a specific user."""
        pass
    
    @abstractmethod
    async def get_by_booking(self, booking_id: int) -> Optional[Review]:
        """Get review for a specific booking."""
        pass
    
    @abstractmethod
    async def get_flagged(self, limit: int = 100, offset: int = 0) -> List[Review]:
        """Get reviews flagged for moderation."""
        pass
    
    @abstractmethod
    async def exists_for_booking(self, booking_id: int, reviewer_id: int) -> bool:
        """Check if a review already exists for a booking by a specific user."""
        pass
    
    @abstractmethod
    async def calculate_stats(self, target_type: str, target_id: int) -> ReviewStats:
        """Calculate review statistics for a target."""
        pass
    
    @abstractmethod
    async def get_reviews_for_user_targets(
        self, 
        user_id: int, 
        target_type: Optional[str] = None
    ) -> List[Review]:
        """Get all reviews for targets owned by a user (host's properties, operator's tours, etc.)."""
        pass
