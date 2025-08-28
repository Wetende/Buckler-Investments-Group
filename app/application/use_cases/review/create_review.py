"""Create review use case."""
from typing import Protocol, Optional
from domain.entities.review import Review
from domain.repositories.review import ReviewRepository
from domain.repositories.user import UserRepository
from application.dto.reviews import ReviewCreateDTO, ReviewResponseDTO
from shared.exceptions.review import ReviewAlreadyExistsError, BookingNotFoundError, InvalidRatingError
from datetime import datetime


class CreateReviewUseCase:
    def __init__(
        self, 
        review_repository: ReviewRepository,
        user_repository: UserRepository
    ):
        self._review_repository = review_repository
        self._user_repository = user_repository

    async def execute(self, request: ReviewCreateDTO, reviewer_id: int) -> ReviewResponseDTO:
        # Validate rating
        if not (1 <= request.rating <= 5):
            raise InvalidRatingError("Rating must be between 1 and 5")
        
        # Check if review already exists for this booking
        if request.booking_id:
            existing_review = await self._review_repository.exists_for_booking(
                request.booking_id, reviewer_id
            )
            if existing_review:
                raise ReviewAlreadyExistsError("Review already exists for this booking")
        
        # Get reviewer information
        reviewer = await self._user_repository.get_by_id(reviewer_id)
        if not reviewer:
            raise ValueError("Reviewer not found")
        
        # Create review entity
        review_entity = Review(
            id=0,
            target_type=request.target_type.value,
            target_id=request.target_id,
            rating=request.rating,
            title=request.title,
            comment=request.comment,
            reviewer_id=reviewer_id,
            booking_id=request.booking_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        # Validate business rules
        if not review_entity.validate_rating():
            raise InvalidRatingError("Invalid rating value")
        
        # Save review
        saved_review = await self._review_repository.create(review_entity)
        
        # Convert to response DTO
        return ReviewResponseDTO(
            id=saved_review.id,
            target_type=saved_review.target_type,
            target_id=saved_review.target_id,
            rating=saved_review.rating,
            title=saved_review.title,
            comment=saved_review.comment,
            reviewer_id=saved_review.reviewer_id,
            reviewer_name=reviewer.name,
            booking_id=saved_review.booking_id,
            response=saved_review.response,
            response_date=saved_review.response_date,
            created_at=saved_review.created_at,
            updated_at=saved_review.updated_at
        )
