"""Authentication routes - comprehensive JWT auth with social login support"""

from datetime import timedelta
from typing import Optional
from urllib.parse import urlencode

from fastapi import (
    APIRouter, Depends, HTTPException, status, Body, Header, Query, Request
)
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from dependency_injector.wiring import inject, Provide
from infrastructure.config.config import settings
from urllib.parse import urlparse

from application.dto.user import (
    TokenResponse, PasswordResetRequest,
    PasswordResetConfirm, ChangePasswordRequest, GenericResponse,
    UserCreateDTO, UserResponseDTO, RefreshTokenRequest
)
from pydantic import BaseModel, EmailStr, Field


from application.use_cases.auth.refresh_token import RefreshTokenUseCase
from application.use_cases.auth.logout import LogoutUseCase
from application.use_cases.auth.password_reset import (
    PasswordResetRequestUseCase, PasswordResetConfirmUseCase
)
from application.use_cases.auth.change_password import ChangePasswordUseCase
from application.use_cases.user.create_user import CreateUserUseCase
from api.containers import AppContainer
from infrastructure.config.database import get_async_session
from infrastructure.config.auth import (
    authenticate_user,
    create_access_token,
    create_refresh_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    create_oauth_state,
    pop_oauth_state,
)

from shared.constants.user_roles import UserRole
from shared.exceptions.auth import (
    InvalidRefreshTokenError, InvalidResetTokenError, InvalidPasswordError
)
from shared.exceptions.user import UserAlreadyExistsError
from infrastructure.config.dependencies import current_active_user
from domain.entities.user import User as DomainUser

router = APIRouter()


def _compute_redirect_uri(request: Request) -> str:
    """Resolve the Google OAuth redirect_uri and validate it early.

    Rules (aligned with Google docs):
    - Must not include a URL fragment (#...)
    - Must not include path traversal ("/.." or "\\..")
    - Must be absolute http(s) URL (localhost allowed for http)
    """
    redirect_uri = (
        settings.GOOGLE_REDIRECT_URI
        or str(request.url_for("auth_google_callback"))
    )

    parsed = urlparse(redirect_uri)
    if parsed.fragment:
        raise HTTPException(
            status_code=500,
            detail="GOOGLE_REDIRECT_URI must not contain a fragment (#...).",
        )
    path = parsed.path or ""
    if "/.." in path or "\\.." in path:
        raise HTTPException(
            status_code=500,
            detail=(
                "GOOGLE_REDIRECT_URI contains path traversal, which Google"
                " forbids."
            ),
        )
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise HTTPException(
            status_code=500,
            detail="GOOGLE_REDIRECT_URI must be an absolute http(s) URL.",
        )
    return redirect_uri


@router.post("/token", response_model=TokenResponse)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: AsyncSession = Depends(get_async_session),
) -> TokenResponse:
    """OAuth2-compatible token login returning JWT with refresh token."""
    user = await authenticate_user(
        session, form_data.username, form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    
    # Create refresh token
    refresh_token = create_refresh_token(user.id)
    
    return TokenResponse(
        access_token=access_token,
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,  # Convert to seconds
        refresh_token=refresh_token,
    )


@router.get("/oauth-config-status", include_in_schema=False)
def oauth_config_status() -> dict:
    """Non-sensitive status of OAuth-related configuration (for debugging)."""
    default_redirect = "http://localhost:8000/api/v1/auth/google/callback"
    return {
        "google_client_id_present": bool(settings.GOOGLE_CLIENT_ID),
        "google_redirect_uri": (
            settings.GOOGLE_REDIRECT_URI or default_redirect
        ),
        "frontend_base_url": settings.FRONTEND_BASE_URL,
        "admin_url": getattr(settings, "ADMIN_URL", None),
    }


@router.post("/refresh", response_model=TokenResponse)
@inject
async def refresh_access_token(
    request: RefreshTokenRequest = Body(...),
    use_case: RefreshTokenUseCase = Depends(
        Provide[AppContainer.auth_use_cases.refresh_token_use_case]
    ),
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
@inject
async def logout(
    authorization: str = Header(None, alias="Authorization"),
    use_case: LogoutUseCase = Depends(
        Provide[AppContainer.auth_use_cases.logout_use_case]
    ),
    session: AsyncSession = Depends(get_async_session),
) -> GenericResponse:
    """Logout user (invalidates access token on client side)."""
    # Extract token from Authorization header
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401, detail="Authorization header required"
        )
    
    token = authorization.split(" ")[1]
    
    # Decode token to get user ID
    from infrastructure.config.auth import _decode_token
    try:
        user_id = await _decode_token(token)
        return await use_case.execute(int(user_id))
    except Exception:
        # Avoid leaking internal errors
        raise HTTPException(status_code=401, detail="Authentication failed")


# Note: /revoke endpoint removed - functionality consolidated into /logout


@router.post("/password-reset/request", response_model=GenericResponse)
@inject
async def request_password_reset(
    request: PasswordResetRequest = Body(...),
    use_case: PasswordResetRequestUseCase = Depends(
        Provide[AppContainer.auth_use_cases.password_reset_request_use_case]
    ),
) -> GenericResponse:
    """Request a password reset email."""
    return await use_case.execute(request)


@router.post("/password-reset/confirm", response_model=GenericResponse)
@inject
async def confirm_password_reset(
    request: PasswordResetConfirm = Body(...),
    use_case: PasswordResetConfirmUseCase = Depends(
        Provide[AppContainer.auth_use_cases.password_reset_confirm_use_case]
    ),
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
@inject
async def change_password(
    request: ChangePasswordRequest = Body(...),
    authorization: str = Header(None, alias="Authorization"),
    use_case: ChangePasswordUseCase = Depends(
        Provide[AppContainer.auth_use_cases.change_password_use_case]
    ),
) -> GenericResponse:
    """Change password for authenticated user."""
    # Extract token from Authorization header
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401, detail="Authorization header required"
        )
    
    token = authorization.split(" ")[1]
    
    # Decode token to get user ID
    from infrastructure.config.auth import _decode_token
    try:
        user_id = await _decode_token(token)
        return await use_case.execute(int(user_id), request)
    except InvalidPasswordError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception:
        raise HTTPException(status_code=401, detail="Authentication failed")


# ================================
# NEW AUTHENTICATION ENDPOINTS
# ================================

class RegistrationRequest(BaseModel):
    """Payload for user registration via /auth/register."""
    email: EmailStr
    password: str = Field(
        ..., min_length=8, description="Password (min 8 chars)"
    )
    name: str = Field(..., min_length=1, max_length=255)
    phone: Optional[str] = Field(None, max_length=20)
    role: Optional[UserRole] = UserRole.USER


@router.post(
    "/register",
    response_model=UserResponseDTO,
    status_code=status.HTTP_201_CREATED,
)
@inject
async def register_user(
    request: RegistrationRequest = Body(...),
    use_case: CreateUserUseCase = Depends(
        Provide[AppContainer.user_use_cases.create_user_use_case]
    ),
) -> UserResponseDTO:
    """Register a new user account."""
    try:
        dto = UserCreateDTO(**request.model_dump())
        return await use_case.execute(dto)
    except UserAlreadyExistsError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        )


class EnableHostResponse(BaseModel):
    ok: bool = True
    user: UserResponseDTO


@router.get("/enable-host", response_model=EnableHostResponse)
@inject
async def enable_host_get(
    current_user: DomainUser = Depends(current_active_user),
    use_case=Depends(
        Provide[AppContainer.user_use_cases.enable_host_use_case]
    ),
):
    """Enable hosting for the current user (idempotent).
    Using GET here aligns with the simplified convention for easy linking.
    """
    try:
        updated = await use_case.execute(current_user.id)
        return EnableHostResponse(ok=True, user=updated)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/enable-host", response_model=EnableHostResponse)
@inject
async def enable_host_post(
    current_user: DomainUser = Depends(current_active_user),
    use_case=Depends(
        Provide[AppContainer.user_use_cases.enable_host_use_case]
    ),
):
    """POST variant to enable hosting, for clients preferring POST."""
    try:
        updated = await use_case.execute(current_user.id)
        return EnableHostResponse(ok=True, user=updated)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/me", response_model=UserResponseDTO)
async def get_current_user(
    authorization: str = Header(None, alias="Authorization"),
    session: AsyncSession = Depends(get_async_session),
) -> UserResponseDTO:
    """Get current authenticated user profile."""
    # Extract token from Authorization header
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401, detail="Authorization header required"
        )
    
    token = authorization.split(" ")[1]
    
    # Decode token and get user
    from infrastructure.config.auth import _decode_token
    from shared.mappers.user import UserMapper
    from infrastructure.database.models.user import User as UserModel
    from sqlalchemy import select
    
    try:
        user_id = await _decode_token(token)
        stmt = select(UserModel).where(UserModel.id == int(user_id))
        result = await session.execute(stmt)
        user_model = result.scalar_one_or_none()
        
        if not user_model:
            raise HTTPException(status_code=401, detail="User not found")
        
        if not user_model.is_active:
            raise HTTPException(status_code=403, detail="Inactive user")
        
        # Convert to domain entity and then to DTO
        user_entity = UserMapper.model_to_entity(user_model)
        return UserResponseDTO.from_entity(user_entity)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


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
    # Placeholder: return success until verification service is implemented
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
    # Placeholder: return success until SMS/verification service is implemented
    return GenericResponse(
        ok=True,
        message="Phone verification endpoint ready for implementation"
    )


# ================================
# SOCIAL LOGIN - GOOGLE OAUTH
# ================================

@router.get("/google")
@inject
async def google_login(
    request: Request,
    return_url: Optional[str] = Query(None, alias="return_url"),
    start_use_case=Depends(
        Provide[AppContainer.auth_use_cases.start_google_oauth_use_case]
    ),
) -> RedirectResponse:
    """Start Google OAuth flow by redirecting to Google's consent screen."""
    # Build state for CSRF and carry back return_url
    state = create_oauth_state("google", return_url)

    # Get and validate redirect_uri (prevents redirect_uri_mismatch issues)
    redirect_uri = _compute_redirect_uri(request)

    # Early validation: ensure client_id exists
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=500,
            detail="Google OAuth not configured: GOOGLE_CLIENT_ID missing",
        )

    # Delegate to use case to construct the URL
    from application.use_cases.auth.social_google import (
        StartGoogleOAuthRequest,
    )
    authorize_url: str = await start_use_case.execute(
        StartGoogleOAuthRequest(state=state, redirect_uri=redirect_uri)
    )
    return RedirectResponse(url=authorize_url, status_code=302)


@router.get("/google/callback", name="auth_google_callback")
@inject
async def google_callback(
    request: Request,
    code: str = Query(...),
    state: Optional[str] = Query(None),
    handle_use_case=Depends(
        Provide[AppContainer.auth_use_cases.handle_google_callback_use_case]
    ),
):
    """Handle Google's callback then redirect back to frontend with tokens."""
    # Validate state and extract return_url
    if not state:
        raise HTTPException(status_code=400, detail="Missing state")
    state_data = pop_oauth_state(state)
    if not state_data:
        raise HTTPException(status_code=400, detail="Invalid state")

    # Get and validate redirect_uri
    redirect_uri = _compute_redirect_uri(request)

    from application.use_cases.auth.social_google import (
        HandleGoogleCallbackRequest,
    )
    try:
        token_response = await handle_use_case.execute(
            HandleGoogleCallbackRequest(code=code, redirect_uri=redirect_uri)
        )

        # Redirect to frontend with tokens in URL fragment
        frontend_base = settings.FRONTEND_BASE_URL or "http://localhost:3000"
        admin_base = getattr(settings, "ADMIN_URL", None)

        def _is_same_origin(url: str, base: str) -> bool:
            p = urlparse(url)
            b = urlparse(base)
            return p.scheme == b.scheme and p.netloc == b.netloc

        ret_candidate = state_data.get("return_url")
        if ret_candidate:
            parsed = urlparse(ret_candidate)
            if not parsed.scheme and ret_candidate.startswith("/"):
                # Relative path → prefer frontend_base
                ret = f"{frontend_base}{ret_candidate}"
            elif parsed.scheme in {"http", "https"}:
                if _is_same_origin(ret_candidate, frontend_base) or (
                    admin_base and _is_same_origin(ret_candidate, admin_base)
                ):
                    ret = ret_candidate
                else:
                    ret = f"{frontend_base}/"
            else:
                ret = f"{frontend_base}/"
        else:
            ret = f"{frontend_base}/"

        fragment = urlencode(
            {
                "access_token": token_response.access_token,
                "refresh_token": token_response.refresh_token or "",
                "token_type": token_response.token_type,
                "expires_in": token_response.expires_in,
                "provider": "google",
            }
        )

        # If return_url is relative, resolve against frontend_base
        # "ret" is already sanitized and absolute by now.

        return RedirectResponse(url=f"{ret}#{fragment}", status_code=302)
    except Exception as e:
        print(f"Google OAuth callback error: {e}")
        raise HTTPException(
            status_code=400,
            detail="Google authentication failed",
        )


# Helpful debug endpoint: returns the exact Google authorize URL being used
@router.get("/google/authorize-url", include_in_schema=False)
@inject
async def google_authorize_url_debug(
    request: Request,
    return_url: Optional[str] = Query(None, alias="return_url"),
    start_use_case=Depends(
        Provide[AppContainer.auth_use_cases.start_google_oauth_use_case]
    ),
):
    state = create_oauth_state("google", return_url)
    redirect_uri = (
        settings.GOOGLE_REDIRECT_URI
        or str(request.url_for("auth_google_callback"))
    )
    from application.use_cases.auth.social_google import (
        StartGoogleOAuthRequest,
    )
    url: str = await start_use_case.execute(
        StartGoogleOAuthRequest(state=state, redirect_uri=redirect_uri)
    )
    return {
        "authorize_url": url,
        "redirect_uri": redirect_uri,
        "client_id_present": bool(settings.GOOGLE_CLIENT_ID),
    }


# ================================
# SOCIAL LOGIN - FACEBOOK OAUTH (PLACEHOLDER)
# ================================

@router.get("/facebook")
async def facebook_login(
    return_url: Optional[str] = Query(None, alias="return_url"),
) -> RedirectResponse:
    """Facebook OAuth login - To be implemented"""
    raise HTTPException(
        status_code=501,
        detail="Facebook authentication not yet implemented",
    )


@router.get("/facebook/callback")
async def facebook_callback(
    code: str = Query(...),
    state: Optional[str] = Query(None),
):
    """Facebook OAuth callback - To be implemented"""
    raise HTTPException(
        status_code=501,
        detail="Facebook authentication not yet implemented",
    )


# ================================
# SOCIAL LOGIN - APPLE OAUTH (PLACEHOLDER)
# ================================

@router.get("/apple")
async def apple_login(
    return_url: Optional[str] = Query(None, alias="return_url"),
) -> RedirectResponse:
    """Apple OAuth login - To be implemented"""
    raise HTTPException(
        status_code=501,
        detail="Apple authentication not yet implemented",
    )


@router.get("/apple/callback")
async def apple_callback(
    code: str = Query(...),
    state: Optional[str] = Query(None),
):
    """Apple OAuth callback - To be implemented"""
    raise HTTPException(
        status_code=501,
        detail="Apple authentication not yet implemented",
    )

