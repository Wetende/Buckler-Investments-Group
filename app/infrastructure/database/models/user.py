"""
User model for the Property Listing Platform.

This module defines the User model with role-based access control.
"""
from datetime import datetime
from typing import List, Optional

from sqlalchemy import Integer, String, DateTime, Enum as SQLEnum, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from .favorite import Favorite
from .property import Property
from .article import Article

from ...config.database import Base
from domain.value_objects.user_role import UserRole


class User(Base):
    """
    User model for the Property Listing Platform.
    
    Supports three roles: BUYER, AGENT, and ADMIN.
    Uses integer IDs as specified in the requirements.
    """
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    
    # Basic user information
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    role: Mapped[UserRole] = mapped_column(
        SQLEnum(UserRole), 
        nullable=False, 
        default=UserRole.BUYER
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    
    # Agent-specific fields (optional)
    agent_license_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    agency_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    
    # Relationships
    favorites: Mapped[List["Favorite"]] = relationship(
        "Favorite", back_populates="user", cascade="all, delete-orphan"
    )
    listings: Mapped[List["Property"]] = relationship(
        "Property", back_populates="agent", cascade="all, delete-orphan"
    )
    articles: Mapped[List["Article"]] = relationship(
        "Article", back_populates="author", cascade="all, delete-orphan"
    )
    
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

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"
