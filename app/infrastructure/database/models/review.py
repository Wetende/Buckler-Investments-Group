"""Review database model."""
from sqlalchemy import (
    Integer, String, Text, DateTime, Boolean, Float, 
    ForeignKey, Index, Enum as SAEnum
)
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from datetime import datetime
from typing import Optional

from ...config.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    target_type: Mapped[str] = mapped_column(String(20), nullable=False)  # 'bnb_listing', 'tour', 'car', 'bundle'
    target_id: Mapped[int] = mapped_column(Integer, nullable=False)
    rating: Mapped[int] = mapped_column(Integer, nullable=False)  # 1-5 stars
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    comment: Mapped[str] = mapped_column(Text, nullable=False)
    reviewer_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    booking_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)  # Generic booking reference
    response: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    response_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    is_flagged: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    flag_reason: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    __table_args__ = (
        Index("ix_reviews_target", "target_type", "target_id"),
        Index("ix_reviews_reviewer_id", "reviewer_id"),
        Index("ix_reviews_booking_id", "booking_id"),
        Index("ix_reviews_flagged", "is_flagged"),
        Index("ix_reviews_rating", "rating"),
        Index("ix_reviews_created_at", "created_at"),
    )
