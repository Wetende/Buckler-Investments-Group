"""Authentication routes - comprehensive JWT authentication endpoints"""

from datetime import timedelta
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from dependency_injector.wiring import inject, Provide

from application.dto.user import (
    TokenResponse, PasswordResetRequest, 
    PasswordResetConfirm, ChangePasswordRequest, GenericResponse,
    UserCreateDTO, UserResponseDTO, RefreshTokenRequest
)
from pydantic import BaseModel, EmailStr, Field

from application.use_cases.auth.refresh_token import RefreshTokenUseCase
from application.use_cases.auth.logout import LogoutUseCase
from application.use_cases.auth.password_reset import PasswordResetRequestUseCase, PasswordResetConfirmUseCase
from application.use_cases.auth.change_password import ChangePasswordUseCase
from application.use_cases.user.create_user import CreateUserUseCase
from api.containers import AppContainer
from infrastructure.config.database import get_async_session
from infrastructure.config.auth import (
    authenticate_user,
    create_access_token,
    create_refresh_token,
    get_current_active_user,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)
from domain.entities.user import User
from domain.value_objects.user_role import UserRole
from shared.exceptions.auth import InvalidRefreshTokenError, InvalidResetTokenError, InvalidPasswordError
from shared.exceptions.user import UserAlreadyExistsError

router = APIRouter()

@router.post("/token", response_model=TokenResponse)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: AsyncSession = Depends(get_async_session),
) -> TokenResponse:
    """OAuth2-compatible token login endpoint returning JWT with refresh token."""
    user = await authenticate_user(session, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(subject=user.id, expires_delta=access_token_expires)
    
    # Create refresh token
    refresh_token = create_refresh_token(user.id)
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,  # Convert to seconds
        refresh_token=refresh_token
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_access_token(
    request: RefreshTokenRequest = Body(...),
    use_case: RefreshTokenUseCase = Depends(Provide[AppContainer.auth_use_cases.refresh_token_use_case]),
) -> TokenResponse:
    """Refresh an access token using a refresh token."""
    try:
        return await use_case.execute(request)
    except InvalidRefreshTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.post("/logout", response_model=GenericResponse)
async def logout(
    current_user: Annotated[User, Depends(get_current_active_user)],
    use_case: LogoutUseCase = Depends(Provide[AppContainer.auth_use_cases.logout_use_case]),
) -> GenericResponse:
    """Logout user (invalidates access token on client side)."""
    return await use_case.execute(current_user.id)


# Note: /revoke endpoint removed - functionality consolidated into /logout


@router.post("/password-reset/request", response_model=GenericResponse)
async def request_password_reset(
    request: PasswordResetRequest = Body(...),
    use_case: PasswordResetRequestUseCase = Depends(Provide[AppContainer.auth_use_cases.password_reset_request_use_case]),
) -> GenericResponse:
    """Request a password reset email."""
    return await use_case.execute(request)


@router.post("/password-reset/confirm", response_model=GenericResponse)
async def confirm_password_reset(
    request: PasswordResetConfirm = Body(...),
    use_case: PasswordResetConfirmUseCase = Depends(Provide[AppContainer.auth_use_cases.password_reset_confirm_use_case]),
) -> GenericResponse:
    """Confirm password reset with token and new password."""
    try:
        return await use_case.execute(request)
    except InvalidResetTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/change-password", response_model=GenericResponse)
async def change_password(
    current_user: Annotated[User, Depends(get_current_active_user)],
    request: ChangePasswordRequest = Body(...),
    use_case: ChangePasswordUseCase = Depends(Provide[AppContainer.auth_use_cases.change_password_use_case]),
) -> GenericResponse:
    """Change password for authenticated user."""
    try:
        return await use_case.execute(current_user.id, request)
    except InvalidPasswordError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


# ================================
# NEW AUTHENTICATION ENDPOINTS
# ================================

class RegistrationRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password (min 8 chars)")
    name: str = Field(..., min_length=1, max_length=255)
    phone: Optional[str] = Field(None, max_length=20)
    role: Optional[UserRole] = UserRole.BUYER


@router.post("/register", response_model=UserResponseDTO, status_code=status.HTTP_201_CREATED)
@inject
async def register_user(
    request: RegistrationRequest = Body(...),
    use_case: CreateUserUseCase = Depends(Provide[AppContainer.user_use_cases.create_user_use_case]),
) -> UserResponseDTO:
    """Register a new user account."""
    try:
        dto = UserCreateDTO(**request.model_dump())
        return await use_case.execute(dto)
    except UserAlreadyExistsError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/me", response_model=UserResponseDTO)
async def get_current_user(
    current_user: Annotated[User, Depends(get_current_active_user)],
) -> UserResponseDTO:
    """Get current authenticated user profile."""
    return UserResponseDTO(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        phone=current_user.phone,
        role=current_user.role,
        is_active=current_user.is_active,
        created_at=current_user.created_at
    )


# ================================
# EMAIL/PHONE VERIFICATION
# ================================

class VerificationRequest(BaseModel):
    """Request model for email/phone verification."""
    email: Optional[str] = None
    phone: Optional[str] = None
    verification_code: Optional[str] = None

@router.post("/verify-email", response_model=GenericResponse)
async def verify_email(
    request: VerificationRequest = Body(...),
) -> GenericResponse:
    """Verify user email address with OTP/token."""
    # TODO: Implement email verification logic
    # For now, return success - this needs proper verification service implementation
    return GenericResponse(
        ok=True,
        message="Email verification endpoint ready for implementation"
    )


@router.post("/verify-phone", response_model=GenericResponse)
async def verify_phone(
    request: VerificationRequest = Body(...),
) -> GenericResponse:
    """Verify user phone number with OTP."""
    # TODO: Implement phone verification logic
    # For now, return success - this needs proper SMS/verification service implementation
    return GenericResponse(
        ok=True,
        message="Phone verification endpoint ready for implementation"
    )


# ================================
# SOCIAL LOGIN
# ================================

class SocialLoginRequest(BaseModel):
    """Request model for social login."""
    provider: str  # "google", "facebook", etc.
    access_token: str
    email: Optional[str] = None
    name: Optional[str] = None

@router.post("/social-login", response_model=TokenResponse)
async def social_login(
    request: SocialLoginRequest = Body(...),
) -> TokenResponse:
    """Authenticate user via social providers (Google, Facebook, etc.)."""
    # TODO: Implement social login logic
    # For now, return placeholder response - this needs proper OAuth integration
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Social login endpoint ready for implementation"
    )

