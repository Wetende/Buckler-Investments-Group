"""
User schemas for the Property Listing Platform.

This module defines Pydantic schemas for user registration, authentication, and responses.
"""
from typing import Optional
from fastapi_users import schemas
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

from models.user import UserRole


class UserRead(schemas.BaseUser[int]):
    """Schema for reading user data."""
    name: str
    phone: Optional[str] = None
    role: UserRole
    agent_license_id: Optional[str] = None
    agency_name: Optional[str] = None


class UserCreate(schemas.BaseUserCreate):
    """Schema for user registration."""
    name: str = Field(..., min_length=1, max_length=255, description="User's full name")
    phone: Optional[str] = Field(None, max_length=20, description="User's phone number")
    agent_license_id: Optional[str] = Field(None, max_length=100, description="Agent license ID")
    agency_name: Optional[str] = Field(None, max_length=255, description="Agency name")


class UserUpdate(schemas.BaseUserUpdate):
    """Schema for updating user data."""
    name: Optional[str] = Field(None, min_length=1, max_length=255, description="User's full name")
    phone: Optional[str] = Field(None, max_length=20, description="User's phone number")
    agent_license_id: Optional[str] = Field(None, max_length=100, description="Agent license ID")
    agency_name: Optional[str] = Field(None, max_length=255, description="Agency name")


class AdminUserCreateUpdate(BaseModel):
    """Schema for admin user create/update operations following GET/POST convention."""
    id: int = Field(0, description="0 for create, actual id for update")
    email: Optional[EmailStr] = None
    password: Optional[str] = None  # Note: Should be hashed before storing
    name: Optional[str] = Field(None, min_length=1, max_length=255, description="User's full name")
    phone: Optional[str] = Field(None, max_length=20, description="User's phone number")
    role: Optional[UserRole] = None
    agent_license_id: Optional[str] = Field(None, max_length=100, description="Agent license ID")
    agency_name: Optional[str] = Field(None, max_length=255, description="Agency name")
    is_active: Optional[bool] = None


class FavoriteCreate(BaseModel):
    property_id: int = Field(..., ge=1)

class FavoriteResponse(BaseModel):
    user_id: int
    property_id: int
    created_at: datetime

    class Config:
        from_attributes = True
