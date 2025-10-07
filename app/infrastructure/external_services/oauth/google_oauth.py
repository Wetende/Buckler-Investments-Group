"""Google OAuth service implementation.

Implements the domain SocialAuthService interface for Google using
OAuth 2.0 Authorization Code flow with OIDC userinfo.
"""
from __future__ import annotations

from typing import Optional
from urllib.parse import urlencode

import httpx

from domain.services.oauth_service import SocialAuthService, SocialProfile


class GoogleOAuthService(SocialAuthService):
    """Google OAuth provider implementation."""

    _AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
    _TOKEN_URL = "https://oauth2.googleapis.com/token"  # nosec B105
    _USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo"

    def __init__(
        self,
        client_id: str,
        client_secret: str,
        default_redirect_uri: Optional[str] = None,
        scope: str = "openid email profile",
        access_type: str = "offline",
        prompt: str = "consent",
    ) -> None:
        self._client_id = client_id
        self._client_secret = client_secret
        self._default_redirect_uri = default_redirect_uri
        self._scope = scope
        self._access_type = access_type
        self._prompt = prompt

    def get_authorize_url(
        self, state: str, redirect_uri: Optional[str] = None
    ) -> str:
        """Return Google consent screen URL."""
        ru = redirect_uri or self._default_redirect_uri
        if not ru:
            raise ValueError("redirect_uri is required for Google OAuth")
        if not self._client_id:
            raise ValueError("GOOGLE_CLIENT_ID is not configured")
        params = {
            "client_id": self._client_id,
            "response_type": "code",
            "scope": self._scope,
            "redirect_uri": ru,
            "state": state,
            "access_type": self._access_type,
            "prompt": self._prompt,
            # Enable incremental authorization so previously granted scopes
            # are included automatically (recommended by Google docs)
            "include_granted_scopes": "true",
        }
        return f"{self._AUTH_URL}?{urlencode(params)}"

    async def fetch_profile_from_code(
        self,
        code: str,
        redirect_uri: Optional[str] = None,
    ) -> SocialProfile:
        """Exchange code, then fetch userinfo and return a SocialProfile."""
        ru = redirect_uri or self._default_redirect_uri
        if not ru:
            raise ValueError("redirect_uri is required for Google OAuth")
        if not self._client_id or not self._client_secret:
            raise ValueError(
                "Google OAuth client credentials are not configured"
            )

        async with httpx.AsyncClient(timeout=20.0) as client:
            token_resp = await client.post(
                self._TOKEN_URL,
                data={
                    "client_id": self._client_id,
                    "client_secret": self._client_secret,
                    "code": code,
                    "grant_type": "authorization_code",
                    "redirect_uri": ru,
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )
            token_data = token_resp.json()
            if token_resp.status_code >= 400 or "error" in token_data:
                msg = (
                    token_data.get("error_description")
                    or token_data.get("error")
                    or "token exchange failed"
                )
                raise RuntimeError(f"Google token error: {msg}")

            access_token = token_data.get("access_token")
            if not access_token:
                raise RuntimeError(
                    "Google token response missing access_token"
                )

            user_resp = await client.get(
                self._USERINFO_URL,
                headers={"Authorization": f"Bearer {access_token}"},
            )
            user_data = user_resp.json()
            if user_resp.status_code >= 400 or "error" in user_data:
                raise RuntimeError("Failed to fetch Google userinfo")

            email = user_data.get("email")
            name = user_data.get("name")
            sub = user_data.get("sub")
            if not email:
                raise RuntimeError("Google userinfo missing email")

            return SocialProfile(email=email, name=name, sub=sub)
