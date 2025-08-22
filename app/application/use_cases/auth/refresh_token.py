"""
Refresh token use case.

Handles refreshing access tokens using refresh tokens.
"""
from datetime import datetime, timedelta
from typing import Optional

from application.dto.user import RefreshTokenRequest, TokenResponse
from domain.repositories.user import UserRepository
from infrastructure.config.auth import create_access_token, verify_refresh_token
from shared.exceptions.auth import InvalidRefreshTokenError


class RefreshTokenUseCase:
    """Use case for refreshing access tokens."""
    
    def __init__(self, user_repository: UserRepository):
        self._user_repository = user_repository
    
    async def execute(self, request: RefreshTokenRequest) -> TokenResponse:
        """
        Refresh an access token using a refresh token.
        
        Args:
            request: Refresh token request containing the refresh token
            
        Returns:
            New token response with access token and optional new refresh token
            
        Raises:
            InvalidRefreshTokenError: If refresh token is invalid or expired
        """
        # Verify refresh token and get user ID
        user_id = await verify_refresh_token(request.refresh_token)
        if not user_id:
            raise InvalidRefreshTokenError("Invalid or expired refresh token")
        
        # Get user to ensure they still exist and are active
        user = await self._user_repository.get_by_id(user_id)
        if not user or not user.is_active:
            raise InvalidRefreshTokenError("User not found or inactive")
        
        # Create new access token
        access_token_expires = timedelta(minutes=15)  # 15 minutes
        access_token = create_access_token(
            subject=user.id, 
            expires_delta=access_token_expires
        )
        
        # For now, we'll reuse the same refresh token
        # In production, you might want to rotate refresh tokens
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=900,  # 15 minutes in seconds
            refresh_token=request.refresh_token  # Reuse existing refresh token
        )

