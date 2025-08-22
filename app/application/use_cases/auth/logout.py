"""
Logout use case.

Handles user logout by revoking refresh tokens.
"""
from application.dto.user import GenericResponse
from domain.repositories.user import UserRepository
from infrastructure.config.auth import revoke_refresh_token


class LogoutUseCase:
    """Use case for logging out users."""
    
    def __init__(self, user_repository: UserRepository):
        self._user_repository = user_repository
    
    async def execute(self, user_id: int = None, refresh_token: str = None) -> GenericResponse:
        """
        Logout a user by revoking their refresh token.
        
        Args:
            user_id: ID of the user logging out (optional)
            refresh_token: Optional refresh token to revoke
            
        Returns:
            Generic success response
        """
        # Revoke the specific refresh token if provided
        if refresh_token:
            await revoke_refresh_token(refresh_token)
        
        # In a more complex system, you might also:
        # - Add the access token to a blacklist
        # - Log the logout event
        # - Clear any server-side sessions
        
        message = "Successfully logged out"
        if refresh_token and not user_id:
            message = "Refresh token revoked successfully"
        
        return GenericResponse(
            ok=True,
            message=message
        )
