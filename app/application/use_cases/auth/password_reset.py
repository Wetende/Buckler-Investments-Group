"""
Password reset use cases.

Handles password reset request and confirmation.
"""
import secrets
from datetime import datetime, timedelta
from typing import Optional

from application.dto.user import PasswordResetRequest, PasswordResetConfirm, GenericResponse
from domain.repositories.user import UserRepository
from domain.services.password_service import PasswordService
from shared.exceptions.auth import InvalidResetTokenError
from shared.exceptions.user import UserNotFoundError


class PasswordResetRequestUseCase:
    """Use case for requesting password reset."""
    
    def __init__(self, user_repository: UserRepository):
        self._user_repository = user_repository
    
    async def execute(self, request: PasswordResetRequest) -> GenericResponse:
        """
        Request a password reset for a user.
        
        Args:
            request: Password reset request containing email
            
        Returns:
            Generic success response (always returns success for security)
        """
        # Find user by email
        user = await self._user_repository.get_by_email(request.email)
        
        if user and user.is_active:
            # Generate reset token (in production, store this in database)
            reset_token = secrets.token_urlsafe(32)
            from datetime import timezone
            expires_at = datetime.now(timezone.utc) + timedelta(hours=1)  # 1 hour expiry
            
            # TODO: Store reset token in database with expiry
            # TODO: Send reset email with token
            # For now, we'll just log it (in production, send email)
            print(f"Password reset token for {request.email}: {reset_token}")
        
        # Always return success for security (don't reveal if email exists)
        return GenericResponse(
            ok=True,
            message="If the email exists, a password reset link has been sent"
        )


class PasswordResetConfirmUseCase:
    """Use case for confirming password reset."""
    
    def __init__(self, user_repository: UserRepository, password_service: PasswordService):
        self._user_repository = user_repository
        self._password_service = password_service
    
    async def execute(self, request: PasswordResetConfirm) -> GenericResponse:
        """
        Confirm password reset with token and set new password.
        
        Args:
            request: Password reset confirmation with token and new password
            
        Returns:
            Generic success response
            
        Raises:
            InvalidResetTokenError: If reset token is invalid or expired
        """
        # TODO: Verify reset token from database
        # For now, we'll simulate token verification
        user_id = await self._verify_reset_token(request.token)
        if not user_id:
            raise InvalidResetTokenError("Invalid or expired reset token")
        
        # Get user
        user = await self._user_repository.get_by_id(user_id)
        if not user:
            raise UserNotFoundError("User not found")
        
        # Hash new password
        hashed_password = self._password_service.hash_password(request.new_password)
        
        # Update user password and timestamp
        from datetime import timezone
        user.hashed_password = hashed_password
        user.updated_at = datetime.now(timezone.utc)
        await self._user_repository.update(user)
        
        # TODO: Invalidate reset token
        # TODO: Revoke all existing refresh tokens for security
        
        return GenericResponse(
            ok=True,
            message="Password successfully reset"
        )
    
    async def _verify_reset_token(self, token: str) -> Optional[int]:
        """
        Verify reset token and return user ID.
        
        In production, this would check the database for the token
        and verify it hasn't expired.
        """
        # TODO: Implement actual token verification from database
        # For now, return None to simulate invalid token
        return None

