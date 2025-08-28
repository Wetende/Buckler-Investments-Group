from fastapi import APIRouter, Depends, HTTPException, Query
from dependency_injector.wiring import inject, Provide
from typing import List

from ...containers import AppContainer
from application.dto.reviews import (
    ReviewCreateDTO,
    ReviewResponseDTO,
    ReviewResponseCreateDTO,
    ReviewStatsDTO,
    ReviewType,
)
from application.use_cases.review.create_review import CreateReviewUseCase
from application.use_cases.review.get_reviews import GetReviewsUseCase
from application.use_cases.review.get_review_stats import GetReviewStatsUseCase
from application.use_cases.review.respond_to_review import RespondToReviewUseCase
from application.use_cases.review.get_user_reviews import GetUserReviewsUseCase
from application.use_cases.review.flag_review import FlagReviewUseCase
from application.use_cases.review.delete_review import DeleteReviewUseCase
from shared.exceptions.review import ReviewNotFoundError, ReviewAlreadyExistsError

router = APIRouter()

# Review CRUD endpoints
@router.post("/", response_model=ReviewResponseDTO)
@inject
async def create_review(
    request: ReviewCreateDTO,
    create_use_case: CreateReviewUseCase = Depends(Provide[AppContainer.create_review_use_case]),
    # TODO: Get reviewer_id from authentication context
    reviewer_id: int = Query(1, description="Reviewer ID (from auth context)"),
):
    """Create a new review for a listing/tour/car"""
    try:
        return await create_use_case.execute(request, reviewer_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{target_type}/{target_id}", response_model=List[ReviewResponseDTO])
@inject
async def get_reviews(
    target_type: ReviewType,
    target_id: int,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    rating_filter: int = Query(None, ge=1, le=5, description="Filter by specific rating"),
    get_use_case: GetReviewsUseCase = Depends(Provide[AppContainer.get_reviews_use_case]),
):
    """Get all reviews for a specific listing/tour/car"""
    try:
        return await get_use_case.execute(
            target_type, target_id, rating_filter, limit, offset
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{target_type}/{target_id}/stats", response_model=ReviewStatsDTO)
@inject
async def get_review_stats(
    target_type: ReviewType,
    target_id: int,
    stats_use_case: GetReviewStatsUseCase = Depends(Provide[AppContainer.get_review_stats_use_case]),
):
    """Get review statistics for a specific listing/tour/car"""
    try:
        return await stats_use_case.execute(target_type, target_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/review/{review_id}", response_model=ReviewResponseDTO)

async def get_review_details(
    review_id: int,
    # TODO: Implement get review details use case
):
    """Get detailed information about a specific review"""
    # TODO: Implement review details retrieval
    from datetime import datetime
    
    return ReviewResponseDTO(
        id=review_id,
        target_type=ReviewType.BNB_LISTING,
        target_id=1,
        rating=5,
        title="Amazing experience!",
        comment="Had a wonderful time. Highly recommended for families. Great service and beautiful location. The host was very accommodating and the place was exactly as described in the photos.",
        reviewer_id=1,
        reviewer_name="Sarah Johnson",
        booking_id=123,
        response="Thank you so much for the detailed review! We're thrilled you enjoyed your stay.",
        response_date=datetime(2024, 1, 22, 10, 0, 0),
        created_at=datetime(2024, 1, 20, 15, 30, 0),
        updated_at=None
    )

@router.post("/review/{review_id}/response", response_model=dict)

async def respond_to_review(
    review_id: int,
    request: ReviewResponseCreateDTO,
    # TODO: Implement review response use case
):
    """Host/operator response to a review"""
    # TODO: Implement review response logic
    # This should:
    # 1. Validate user owns the listing/tour/car
    # 2. Check if response already exists
    # 3. Create or update the response
    
    return {
        "ok": True,
        "message": "Response added to review",
        "review_id": review_id,
        "response_id": 1
    }

@router.get("/review/{review_id}/delete", response_model=dict)

async def delete_review(
    review_id: int,
    # TODO: Implement delete review use case
):
    """Delete a review (admin only or review owner)"""
    # TODO: Implement review deletion logic
    # This should:
    # 1. Validate user can delete (admin or review owner)
    # 2. Delete the review
    # 3. Recalculate target item's average rating
    
    return {"ok": True, "message": "Review deleted", "review_id": review_id}

# User-specific review endpoints
@router.get("/my-reviews", response_model=List[ReviewResponseDTO])

async def get_my_reviews(
    # TODO: Get user_id from authentication context
    user_id: int = Query(1, description="User ID (from auth context)"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """Get all reviews written by the authenticated user"""
    # TODO: Implement user reviews retrieval
    return []

@router.get("/reviews-for-my-listings", response_model=List[ReviewResponseDTO])

async def get_reviews_for_my_listings(
    # TODO: Get user_id from authentication context
    user_id: int = Query(1, description="User ID (from auth context)"),
    target_type: ReviewType = Query(None, description="Filter by listing type"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """Get all reviews for the user's listings/tours/cars"""
    # TODO: Implement host/operator reviews retrieval
    return []

# Review moderation endpoints (admin)
@router.get("/flagged", response_model=List[ReviewResponseDTO])

async def get_flagged_reviews(
    # TODO: Add admin authentication
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """Get reviews flagged for moderation (admin only)"""
    # TODO: Implement flagged reviews retrieval
    return []

@router.post("/review/{review_id}/flag", response_model=dict)

async def flag_review(
    review_id: int,
    reason: str = Query(..., description="Reason for flagging"),
):
    """Flag a review for moderation"""
    # TODO: Implement review flagging logic
    return {"ok": True, "message": "Review flagged for moderation", "review_id": review_id}
