"""Authentication routes - comprehensive JWT authentication endpoints"""
from __future__ import annotations

from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from dependency_injector.wiring import inject, Provide

from application.dto.user import (
    TokenResponse, PasswordResetRequest, 
    PasswordResetConfirm, ChangePasswordRequest, GenericResponse
)
from pydantic import BaseModel

# Local definition to avoid forward reference issues
class RefreshTokenRequest(BaseModel):
    refresh_token: str
from application.use_cases.auth.refresh_token import RefreshTokenUseCase
from application.use_cases.auth.logout import LogoutUseCase
from application.use_cases.auth.password_reset import PasswordResetRequestUseCase, PasswordResetConfirmUseCase
from application.use_cases.auth.change_password import ChangePasswordUseCase
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
from shared.exceptions.auth import InvalidRefreshTokenError, InvalidResetTokenError, InvalidPasswordError

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


@router.post("/revoke", response_model=GenericResponse)
async def revoke_refresh_token(
    refresh_token_data: RefreshTokenRequest = Body(...),
    use_case: LogoutUseCase = Depends(Provide[AppContainer.auth_use_cases.logout_use_case]),
) -> GenericResponse:
    """Revoke a specific refresh token."""
    return await use_case.execute(user_id=None, refresh_token=refresh_token_data.refresh_token)


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

