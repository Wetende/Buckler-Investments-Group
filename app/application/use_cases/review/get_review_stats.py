"""Get review statistics use case."""
from domain.repositories.review import ReviewRepository
from application.dto.reviews import ReviewStatsDTO, ReviewType


class GetReviewStatsUseCase:
    def __init__(self, review_repository: ReviewRepository):
        self._review_repository = review_repository

    async def execute(self, target_type: ReviewType, target_id: int) -> ReviewStatsDTO:
        # Get review statistics from repository
        stats = await self._review_repository.calculate_stats(
            target_type.value, target_id
        )
        
        # Convert to DTO
        return ReviewStatsDTO(
            target_type=target_type,
            target_id=target_id,
            total_reviews=stats.total_reviews,
            average_rating=stats.average_rating,
            rating_breakdown=stats.rating_breakdown
        )
