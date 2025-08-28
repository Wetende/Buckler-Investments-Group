"""Review domain entity for the super platform."""
from dataclasses import dataclass
from datetime import datetime
from typing import Optional
from .base import DomainEntity
from ..value_objects.booking_status import BookingStatus


@dataclass
class Review(DomainEntity):
    """Review entity representing customer reviews for listings, tours, and cars."""
    target_type: str  # 'bnb_listing', 'tour', 'car', 'bundle'
    target_id: int
    rating: int  # 1-5 stars
    title: str
    comment: str
    reviewer_id: int
    booking_id: Optional[int] = None
    response: Optional[str] = None
    response_date: Optional[datetime] = None
    is_flagged: bool = False
    flag_reason: Optional[str] = None
    
    def add_response(self, response_text: str) -> None:
        """Business rule: Add host/operator response to review."""
        if self.response:
            raise ValueError("Review already has a response")
        
        self.response = response_text
        self.response_date = datetime.utcnow()
    
    def flag_for_moderation(self, reason: str) -> None:
        """Business rule: Flag review for moderation."""
        self.is_flagged = True
        self.flag_reason = reason
    
    def unflag(self) -> None:
        """Business rule: Remove flag from review."""
        self.is_flagged = False
        self.flag_reason = None
    
    def validate_rating(self) -> bool:
        """Business rule: Validate rating is within acceptable range."""
        return 1 <= self.rating <= 5
    
    def can_be_responded_to(self) -> bool:
        """Business rule: Check if review can receive a response."""
        return not self.is_flagged and self.response is None


@dataclass
class ReviewStats:
    """Aggregate statistics for reviews of a target."""
    target_type: str
    target_id: int
    total_reviews: int
    average_rating: float
    rating_breakdown: dict  # {1: count, 2: count, ...}
    
    @classmethod
    def calculate_from_reviews(cls, target_type: str, target_id: int, reviews: list) -> 'ReviewStats':
        """Calculate statistics from a list of reviews."""
        if not reviews:
            return cls(
                target_type=target_type,
                target_id=target_id,
                total_reviews=0,
                average_rating=0.0,
                rating_breakdown={1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
            )
        
        total_reviews = len(reviews)
        total_rating = sum(review.rating for review in reviews)
        average_rating = round(total_rating / total_reviews, 2)
        
        rating_breakdown = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        for review in reviews:
            rating_breakdown[review.rating] += 1
        
        return cls(
            target_type=target_type,
            target_id=target_id,
            total_reviews=total_reviews,
            average_rating=average_rating,
            rating_breakdown=rating_breakdown
        )
