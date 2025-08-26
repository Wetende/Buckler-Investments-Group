from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional
from enum import Enum

class ReviewType(str, Enum):
    BNB_LISTING = "bnb_listing"
    TOUR = "tour"
    CAR = "car"
    BUNDLE = "bundle"

class ReviewCreateDTO(BaseModel):
    id: int = Field(0, description="0 for create, positive for update")
    target_type: ReviewType
    target_id: int = Field(..., description="ID of the listing/tour/car being reviewed")
    rating: int = Field(..., ge=1, le=5, description="Rating from 1 to 5 stars")
    title: str = Field(..., min_length=3, max_length=100)
    comment: str = Field(..., min_length=10, max_length=1000)
    reviewer_id: Optional[int] = None  # Will be set from auth context
    booking_id: Optional[int] = None  # Link to the booking if applicable
    
    model_config = ConfigDict(from_attributes=True)

class ReviewResponseDTO(BaseModel):
    id: int
    target_type: ReviewType
    target_id: int
    rating: int
    title: str
    comment: str
    reviewer_id: int
    reviewer_name: str
    booking_id: Optional[int] = None
    response: Optional[str] = None  # Host/operator response
    response_date: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

class ReviewResponseCreateDTO(BaseModel):
    review_id: int
    response: str = Field(..., min_length=10, max_length=1000)
    responder_id: Optional[int] = None  # Will be set from auth context

class ReviewStatsDTO(BaseModel):
    target_type: ReviewType
    target_id: int
    total_reviews: int
    average_rating: float
    rating_breakdown: dict  # {1: 2, 2: 1, 3: 5, 4: 15, 5: 20}
    
    model_config = ConfigDict(from_attributes=True)
