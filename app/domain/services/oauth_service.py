from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional


@dataclass
class SocialProfile:
    """Minimal profile returned by social auth providers."""
    email: str
    name: Optional[str] = None
    sub: Optional[str] = None  # Provider-specific subject/ID


class SocialAuthService(ABC):
    """Abstract interface for social auth providers."""

    @abstractmethod
    def get_authorize_url(self, state: str, redirect_uri: str) -> str:
        # pragma: no cover - interface
        """
        Return the provider authorize URL for the given state and
        redirect URI.
        """
        raise NotImplementedError

    @abstractmethod
    async def fetch_profile_from_code(
        self,
        code: str,
        redirect_uri: str,
    ) -> SocialProfile:
        # pragma: no cover - interface
        """
        Exchange code for tokens and return a minimal profile.
        """
        raise NotImplementedError
