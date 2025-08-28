"""Respond to review use case."""
from domain.repositories.review import ReviewRepository
from application.dto.reviews import ReviewResponseCreateDTO
from shared.exceptions.review import ReviewNotFoundError, ReviewResponseError


class RespondToReviewUseCase:
    def __init__(self, review_repository: ReviewRepository):
        self._review_repository = review_repository

    async def execute(self, review_id: int, request: ReviewResponseCreateDTO, responder_id: int) -> dict:
        # Get the review
        review = await self._review_repository.get_by_id(review_id)
        if not review:
            raise ReviewNotFoundError(review_id)
        
        # Check if review can be responded to
        if not review.can_be_responded_to():
            raise ReviewResponseError("Review already has a response or is flagged")
        
        # TODO: Validate that responder owns the target (listing, tour, car)
        # This would require checking ownership in respective repositories
        
        # Add response to review
        try:
            review.add_response(request.response)
        except ValueError as e:
            raise ReviewResponseError(str(e))
        
        # Save updated review
        await self._review_repository.update(review)
        
        return {
            "ok": True,
            "message": "Response added to review",
            "review_id": review_id,
            "response_id": review.id  # Using review ID as response identifier
        }
