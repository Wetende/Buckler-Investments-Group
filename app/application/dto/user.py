"""
User schemas for the Property Listing Platform.

This module defines Pydantic schemas for user registration, authentication, and responses.
"""
from typing import Optional
from fastapi_users import schemas
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

from shared.constants.user_roles import UserRole


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


# Use case DTOs
class UserCreateDTO(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, description="User password (minimum 8 characters)")
    name: str = Field(..., min_length=1, max_length=255, description="User's full name")
    phone: Optional[str] = Field(None, max_length=20, description="User's phone number")
    role: Optional[UserRole] = UserRole.USER
    
    model_config = {"from_attributes": True}


class UserResponseDTO(BaseModel):
    id: int
    email: str
    name: str
    phone: Optional[str] = None
    role: UserRole
    is_active: bool
    created_at: datetime
    
    model_config = {"from_attributes": True}
    
    @classmethod
    def from_entity(cls, entity) -> 'UserResponseDTO':
        """Build DTO from either domain entity or ORM model shape.
        Handles attribute name differences like full_name/name and phone_number/phone.
        """
        name_value = getattr(entity, "name", None) or getattr(entity, "full_name", None)
        phone_value = getattr(entity, "phone", None) or getattr(entity, "phone_number", None)
        role_value = getattr(entity, "role", None)
        return cls(
            id=entity.id,
            email=entity.email,
            name=str(name_value) if name_value is not None else "",
            phone=phone_value,
            role=role_value if role_value is not None else UserRole.USER,
            is_active=entity.is_active,
            created_at=entity.created_at
        )


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 900  # 15 minutes in seconds
    refresh_token: Optional[str] = None


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 900
    refresh_token: Optional[str] = None


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8, description="New password (minimum 8 characters)")


class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=8, description="New password (minimum 8 characters)")


class GenericResponse(BaseModel):
    ok: bool = True
    message: Optional[str] = None


# Models are automatically built by Pydantic v2
