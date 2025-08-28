"""Get reviews use case."""
from typing import List
from domain.repositories.review import ReviewRepository
from domain.repositories.user import UserRepository
from application.dto.reviews import ReviewResponseDTO, ReviewType


class GetReviewsUseCase:
    def __init__(
        self, 
        review_repository: ReviewRepository,
        user_repository: UserRepository
    ):
        self._review_repository = review_repository
        self._user_repository = user_repository

    async def execute(
        self, 
        target_type: ReviewType, 
        target_id: int,
        rating_filter: int = None,
        limit: int = 20,
        offset: int = 0
    ) -> List[ReviewResponseDTO]:
        # Get reviews for the target
        reviews = await self._review_repository.get_by_target(
            target_type.value, target_id
        )
        
        # Apply rating filter if provided
        if rating_filter:
            reviews = [r for r in reviews if r.rating == rating_filter]
        
        # Apply pagination
        paginated_reviews = reviews[offset:offset + limit]
        
        # Convert to DTOs with reviewer names
        result = []
        for review in paginated_reviews:
            reviewer = await self._user_repository.get_by_id(review.reviewer_id)
            reviewer_name = reviewer.name if reviewer else "Unknown User"
            
            result.append(ReviewResponseDTO(
                id=review.id,
                target_type=review.target_type,
                target_id=review.target_id,
                rating=review.rating,
                title=review.title,
                comment=review.comment,
                reviewer_id=review.reviewer_id,
                reviewer_name=reviewer_name,
                booking_id=review.booking_id,
                response=review.response,
                response_date=review.response_date,
                created_at=review.created_at,
                updated_at=review.updated_at
            ))
        
        return result
