"""Media model for storing property photos and videos URLs."""
from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import Integer, String, DateTime, Enum as SQLEnum, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from core.database import Base

class MediaType(str, Enum):
    """Enumeration of supported media types."""
    PHOTO = "PHOTO"
    VIDEO = "VIDEO"


class Media(Base):
    """Media model linked to a Property."""

    __tablename__ = "media"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    property_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("properties.id", ondelete="CASCADE"), nullable=False
    )
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    type: Mapped[MediaType] = mapped_column(SQLEnum(MediaType), nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    property: Mapped["Property"] = relationship("Property", back_populates="media")

    __table_args__ = (
        Index("idx_media_property_id", "property_id"),
    )

    def __repr__(self) -> str:  # pragma: no cover
        return f"<Media(id={self.id}, property_id={self.property_id}, type={self.type})>"
