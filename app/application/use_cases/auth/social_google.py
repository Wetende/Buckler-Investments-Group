"""Use cases for Google OAuth social login."""
from __future__ import annotations

from dataclasses import dataclass
from datetime import timedelta


from application.dto.user import TokenResponse
from domain.repositories.user import UserRepository
from domain.services.oauth_service import SocialAuthService, SocialProfile
from infrastructure.config.auth import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    create_access_token,
    create_refresh_token,
)
from shared.constants.user_roles import UserRole


@dataclass
class StartGoogleOAuthRequest:
    state: str
    redirect_uri: str


@dataclass
class HandleGoogleCallbackRequest:
    code: str
    redirect_uri: str


class StartGoogleOAuthUseCase:
    """Build the Google authorize URL using the provider service."""

    def __init__(self, google_service: SocialAuthService) -> None:
        self._google = google_service

    async def execute(self, request: StartGoogleOAuthRequest) -> str:
        return self._google.get_authorize_url(
            state=request.state,
            redirect_uri=request.redirect_uri,
        )


class HandleGoogleCallbackUseCase:
    """Handle Google callback: create/find user and issue tokens."""

    def __init__(
        self,
        user_repository: UserRepository,
        google_service: SocialAuthService,
    ) -> None:
        self._users = user_repository
        self._google = google_service

    async def execute(
        self, request: HandleGoogleCallbackRequest
    ) -> TokenResponse:
        profile: SocialProfile = await self._google.fetch_profile_from_code(
            code=request.code, redirect_uri=request.redirect_uri
        )

        # Find existing user by email; else create minimal user
        user = await self._users.get_by_email(profile.email)
        if not user:
            # Create a new active user with a placeholder password marker
            # Password isn't used for social login, but our model requires one.
            from datetime import datetime
            from domain.entities.user import User as DomainUser

            # Marker (not a credential) required by our model for social
            # accounts
            PLACEHOLDER = "!social-login!"  # nosec B106
            user = DomainUser(
                id=0,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
                email=profile.email,
                # Marker string; not used for password auth for social accounts
                hashed_password=PLACEHOLDER,
                full_name=profile.name or "",
                is_active=True,
                role=UserRole.USER,
                phone_number=None,
            )
            user = await self._users.create(user)

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            subject=user.id,
            expires_delta=access_token_expires,
        )
        refresh_token = create_refresh_token(user.id)

        return TokenResponse(
            access_token=access_token,
            expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            refresh_token=refresh_token,
        )
