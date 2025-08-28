"""Get user reviews use case."""
from typing import List
from domain.repositories.review import ReviewRepository
from domain.repositories.user import UserRepository
from application.dto.reviews import ReviewResponseDTO


class GetUserReviewsUseCase:
    def __init__(
        self, 
        review_repository: ReviewRepository,
        user_repository: UserRepository
    ):
        self._review_repository = review_repository
        self._user_repository = user_repository

    async def execute(self, user_id: int, limit: int = 20, offset: int = 0) -> List[ReviewResponseDTO]:
        # Get reviews written by the user
        reviews = await self._review_repository.get_by_reviewer(user_id)
        
        # Apply pagination
        paginated_reviews = reviews[offset:offset + limit]
        
        # Get user info
        user = await self._user_repository.get_by_id(user_id)
        user_name = user.name if user else "Unknown User"
        
        # Convert to DTOs
        result = []
        for review in paginated_reviews:
            result.append(ReviewResponseDTO(
                id=review.id,
                target_type=review.target_type,
                target_id=review.target_id,
                rating=review.rating,
                title=review.title,
                comment=review.comment,
                reviewer_id=review.reviewer_id,
                reviewer_name=user_name,
                booking_id=review.booking_id,
                response=review.response,
                response_date=review.response_date,
                created_at=review.created_at,
                updated_at=review.updated_at
            ))
        
        return result
