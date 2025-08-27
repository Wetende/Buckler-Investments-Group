"""Core authentication utilities using JWT and OAuth2-Password flow.

This replaces the previous fastapi-users setup with first-party FastAPI helpers.
"""
from __future__ import annotations

from datetime import datetime, timedelta, UTC
from typing import Annotated, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .config import settings
from .database import get_async_session
from infrastructure.database.models.user import User as UserModel, UserRole
from domain.entities.user import User as DomainUser

__all__ = [
    "pwd_context",
    "oauth2_scheme",
    "verify_password",
    "get_password_hash",
    "create_access_token",
    "create_refresh_token",
    "verify_refresh_token",
    "revoke_refresh_token",
    "get_current_user",
    "get_current_active_user",
    "authenticate_user",
    "require_roles",
]

# ---------------------------------------------------------------------------
# Settings
# ---------------------------------------------------------------------------
SECRET_KEY: str = settings.SECRET_KEY
ALGORITHM: str = getattr(settings, "ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES: int = getattr(settings, "ACCESS_TOKEN_EXPIRE_MINUTES", 15)
REFRESH_TOKEN_EXPIRE_DAYS: int = getattr(settings, "REFRESH_TOKEN_EXPIRE_DAYS", 30)

# In-memory refresh token store (in production, use Redis or database)
_refresh_tokens: dict[str, dict] = {}

# ---------------------------------------------------------------------------
# Password hashing
# ---------------------------------------------------------------------------

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Return True if *plain_password* matches *hashed_password*."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Return a hash for *password*."""
    return pwd_context.hash(password)

# ---------------------------------------------------------------------------
# OAuth2 setup
# ---------------------------------------------------------------------------
# Token endpoint is mounted at /api/v1/auth/token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")


# ---------------------------------------------------------------------------
# JWT helpers
# ---------------------------------------------------------------------------

def create_access_token(subject: str | int, expires_delta: Optional[timedelta] = None) -> str:
    """Generate a signed JWT for *subject*."""
    if expires_delta is None:
        expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {
        "sub": str(subject),
        "exp": datetime.now(UTC) + expires_delta,
    }
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def create_refresh_token(user_id: int) -> str:
    """Generate a refresh token for a user."""
    import secrets
    
    refresh_token = secrets.token_urlsafe(32)
    expires_at = datetime.now(UTC) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    
    # Store refresh token (in production, use Redis or database)
    _refresh_tokens[refresh_token] = {
        "user_id": user_id,
        "expires_at": expires_at,
        "created_at": datetime.now(UTC)
    }
    
    return refresh_token


async def verify_refresh_token(refresh_token: str) -> Optional[int]:
    """Verify a refresh token and return user ID if valid."""
    token_data = _refresh_tokens.get(refresh_token)
    
    if not token_data:
        return None
    
    # Check if token has expired
    if datetime.now(UTC) > token_data["expires_at"]:
        # Remove expired token
        _refresh_tokens.pop(refresh_token, None)
        return None
    
    return token_data["user_id"]


async def revoke_refresh_token(refresh_token: str) -> bool:
    """Revoke a refresh token."""
    return _refresh_tokens.pop(refresh_token, None) is not None


# ---------------------------------------------------------------------------
# DB helpers
# ---------------------------------------------------------------------------

async def _get_user_by_email(session: AsyncSession, email: str) -> Optional[UserModel]:
    stmt = select(UserModel).where(UserModel.email == email)
    result = await session.execute(stmt)
    return result.scalar_one_or_none()


async def authenticate_user(session: AsyncSession, email: str, password: str) -> Optional[UserModel]:
    """Return user if credentials are valid, else None."""
    user = await _get_user_by_email(session, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


# ---------------------------------------------------------------------------
# Current user dependencies
# ---------------------------------------------------------------------------

async def _decode_token(token: str) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        subject: str = payload.get("sub")
        if subject is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return subject
    except JWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials") from exc


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    session: Annotated[AsyncSession, Depends(get_async_session)],
):
    from shared.mappers.user import UserMapper
    from domain.entities.user import User as DomainUser
    
    user_id = await _decode_token(token)
    stmt = select(UserModel).where(UserModel.id == int(user_id))
    result = await session.execute(stmt)
    user_model: Optional[UserModel] = result.scalar_one_or_none()
    if user_model is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    
    # Convert to domain entity
    return UserMapper.model_to_entity(user_model)


async def get_current_active_user(
    current_user: Annotated[DomainUser, Depends(get_current_user)]
):
    """
    Return the user if they are active, otherwise raise a 403 Forbidden error.
    """
    if not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Inactive user")
    return current_user


# ---------------------------------------------------------------------------
# Role-based access helper
# ---------------------------------------------------------------------------

def require_roles(*allowed_roles: UserRole):
    """Dependency factory ensuring the current user has one of *allowed_roles*."""

    async def _checker(user: Annotated[DomainUser, Depends(get_current_active_user)]):
        if user.role not in allowed_roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return user

    return _checker
