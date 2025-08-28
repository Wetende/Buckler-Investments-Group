"""Delete review use case."""
from domain.repositories.review import ReviewRepository
from domain.repositories.user import UserRepository
from shared.exceptions.review import ReviewNotFoundError, ReviewPermissionError


class DeleteReviewUseCase:
    def __init__(
        self, 
        review_repository: ReviewRepository,
        user_repository: UserRepository
    ):
        self._review_repository = review_repository
        self._user_repository = user_repository

    async def execute(self, review_id: int, deleter_id: int) -> dict:
        # Get the review
        review = await self._review_repository.get_by_id(review_id)
        if not review:
            raise ReviewNotFoundError(review_id)
        
        # Get deleter information
        deleter = await self._user_repository.get_by_id(deleter_id)
        if not deleter:
            raise ReviewPermissionError("User not found")
        
        # Check permissions (admin or review owner)
        is_admin = deleter.role.value == "ADMIN" if hasattr(deleter.role, 'value') else str(deleter.role) == "ADMIN"
        is_owner = review.reviewer_id == deleter_id
        
        if not (is_admin or is_owner):
            raise ReviewPermissionError("Only admins or review owners can delete reviews")
        
        # Delete the review
        await self._review_repository.delete(review_id)
        
        return {
            "ok": True,
            "message": "Review deleted",
            "review_id": review_id
        }
