"""
Favorite model for the Property Listing Platform.

This module defines the Favorite model for many-to-many relationship between users and properties.
"""
from datetime import datetime

from sqlalchemy import Integer, ForeignKey, DateTime, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from core.database import Base


class Favorite(Base):
    """
    Favorite model for user-property many-to-many relationship.
    
    Allows users to save properties they are interested in.
    Uses composite primary key to ensure uniqueness.
    """
    __tablename__ = "favorites"

    # Composite primary key
    user_id: Mapped[int] = mapped_column(
        Integer, 
        ForeignKey("users.id", ondelete="CASCADE"), 
        primary_key=True
    )
    property_id: Mapped[int] = mapped_column(
        Integer, 
        ForeignKey("properties.id", ondelete="CASCADE"), 
        primary_key=True
    )
    
    # Timestamp for when the favorite was added
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now(),
        nullable=False
    )
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="favorites")
    property: Mapped["Property"] = relationship("Property", back_populates="favorited_by")
    
    # Indexes for performance
    __table_args__ = (
        Index("idx_favorite_user_id", "user_id"),
        Index("idx_favorite_property_id", "property_id"),
        Index("idx_favorite_created_at", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<Favorite(user_id={self.user_id}, property_id={self.property_id})>"
