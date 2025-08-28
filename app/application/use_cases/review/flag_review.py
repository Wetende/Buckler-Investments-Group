"""Flag review use case."""
from domain.repositories.review import ReviewRepository
from shared.exceptions.review import ReviewNotFoundError


class FlagReviewUseCase:
    def __init__(self, review_repository: ReviewRepository):
        self._review_repository = review_repository

    async def execute(self, review_id: int, reason: str, flagger_id: int) -> dict:
        # Get the review
        review = await self._review_repository.get_by_id(review_id)
        if not review:
            raise ReviewNotFoundError(review_id)
        
        # Flag the review
        review.flag_for_moderation(reason)
        
        # Save updated review
        await self._review_repository.update(review)
        
        return {
            "ok": True,
            "message": "Review flagged for moderation",
            "review_id": review_id
        }
