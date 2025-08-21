"""
Property models for the Property Listing Platform.

This module defines the Property, PropertyDetails, and PropertyStatusLog models.
"""
from datetime import datetime
from decimal import Decimal
from typing import Optional, List, TYPE_CHECKING
from enum import Enum

if TYPE_CHECKING:
    from .user import User
    from .favorite import Favorite
    from .property_type import PropertyType
    from .media import Media

from sqlalchemy import (
    Integer, String, Text, Numeric, Float, DateTime, JSON, 
    ForeignKey, Index, CheckConstraint, UniqueConstraint
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from ...config.database import Base


class PropertyStatus(str, Enum):
    """Property status enumeration."""
    PENDING_APPROVAL = "PENDING_APPROVAL"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    AVAILABLE = "AVAILABLE"
    PENDING = "PENDING"
    SOLD = "SOLD"
    RENTED = "RENTED"
    WITHDRAWN = "WITHDRAWN"


class Property(Base):
    """
    Property model for the Property Listing Platform.
    
    Stores all essential property information including location, pricing,
    features, and metadata for SEO and search optimization.
    """
    __tablename__ = "properties"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    price: Mapped[Decimal] = mapped_column(Numeric(precision=12, scale=2), nullable=False)
    property_type_id: Mapped[int] = mapped_column(Integer, ForeignKey("property_types.id", ondelete="RESTRICT"), nullable=False)
    project_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("projects.id", ondelete="SET NULL"), nullable=True)
    
    # Relationships
    favorited_by: Mapped[List["Favorite"]] = relationship("Favorite", back_populates="property", cascade="all, delete-orphan")
    status: Mapped[PropertyStatus] = mapped_column(String(20), nullable=False, default=PropertyStatus.PENDING_APPROVAL)
    address: Mapped[str] = mapped_column(String(500), nullable=False)
    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    bedrooms: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    bathrooms: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    square_footage: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    amenities: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    images: Mapped[Optional[list]] = mapped_column(JSON, nullable=True)
    slug: Mapped[str] = mapped_column(String(250), nullable=False, unique=True)
    meta_description: Mapped[Optional[str]] = mapped_column(String(160), nullable=True)
    agent_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    agent: Mapped["User"] = relationship("User", back_populates="listings")
    property_type: Mapped["PropertyType"] = relationship("PropertyType", back_populates="properties")
    property_details: Mapped[List["PropertyDetails"]] = relationship("PropertyDetails", back_populates="property", cascade="all, delete-orphan")
    status_logs: Mapped[List["PropertyStatusLog"]] = relationship("PropertyStatusLog", back_populates="property", cascade="all, delete-orphan")
    media: Mapped[List["Media"]] = relationship("Media", back_populates="property", cascade="all, delete-orphan")

    __table_args__ = (
        CheckConstraint('price >= 0', name='check_price_non_negative'),
        CheckConstraint('bedrooms >= 0', name='check_bedrooms_non_negative'),
        CheckConstraint('bathrooms >= 0', name='check_bathrooms_non_negative'),
        CheckConstraint('square_footage >= 0', name='check_square_footage_non_negative'),
        Index('ix_properties_slug', 'slug'),
        Index('ix_properties_property_type_id', 'property_type_id'),
        Index('ix_properties_status', 'status'),
        Index('ix_properties_agent_id', 'agent_id'),
        Index('ix_properties_created_at', 'created_at'),
    )

    def __repr__(self) -> str:
        return f"<Property(id={self.id}, title={self.title}, status={self.status})>"


class PropertyDetails(Base):
    """
    PropertyDetails model for flexible key-value property attributes.
    
    This allows for extensible property features without schema changes.
    """
    __tablename__ = "property_details"

    # Primary key
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    
    # Foreign key to property
    property_id: Mapped[int] = mapped_column(
        Integer, 
        ForeignKey("properties.id", ondelete="CASCADE"), 
        nullable=False
    )
    
    # Key-value pairs
    key: Mapped[str] = mapped_column(String(100), nullable=False)
    value: Mapped[str] = mapped_column(String(500), nullable=False)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now(),
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )
    
    # Relationships
    property: Mapped["Property"] = relationship("Property", back_populates="property_details")
    
    # Constraints
    __table_args__ = (
        UniqueConstraint("property_id", "key", name="uq_property_detail_key"),
        Index("idx_property_details_property_id", "property_id"),
        Index("idx_property_details_key", "key"),
    )

    def __repr__(self) -> str:
        return f"<PropertyDetails(property_id={self.property_id}, key={self.key}, value={self.value})>"


class PropertyStatusLog(Base):
    """
    PropertyStatusLog model for auditing property status changes.
    
    Tracks all status changes for compliance and dispute resolution.
    """
    __tablename__ = "property_status_logs"

    # Primary key
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    
    # Foreign keys
    property_id: Mapped[int] = mapped_column(
        Integer, 
        ForeignKey("properties.id", ondelete="CASCADE"), 
        nullable=False
    )
    changed_by_user_id: Mapped[int] = mapped_column(
        Integer, 
        ForeignKey("users.id", ondelete="SET NULL"), 
        nullable=True
    )
    
    # Status change information
    old_status: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    new_status: Mapped[str] = mapped_column(String(20), nullable=False)
    
    # Timestamp
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now(),
        nullable=False
    )
    
    # Relationships
    property: Mapped["Property"] = relationship("Property", back_populates="status_logs")
    changed_by: Mapped[Optional["User"]] = relationship("User")
    
    # Indexes
    __table_args__ = (
        Index("idx_property_status_log_property_id", "property_id"),
        Index("idx_property_status_log_created_at", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<PropertyStatusLog(property_id={self.property_id}, old_status={self.old_status}, new_status={self.new_status})>"
