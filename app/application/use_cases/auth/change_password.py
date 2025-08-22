"""
Change password use case.

Handles authenticated users changing their passwords.
"""
from application.dto.user import ChangePasswordRequest, GenericResponse
from domain.repositories.user import UserRepository
from domain.services.password_service import PasswordService
from shared.exceptions.auth import InvalidPasswordError
from shared.exceptions.user import UserNotFoundError


class ChangePasswordUseCase:
    """Use case for changing user passwords."""
    
    def __init__(self, user_repository: UserRepository, password_service: PasswordService):
        self._user_repository = user_repository
        self._password_service = password_service
    
    async def execute(self, user_id: int, request: ChangePasswordRequest) -> GenericResponse:
        """
        Change a user's password.
        
        Args:
            user_id: ID of the authenticated user
            request: Change password request with old and new passwords
            
        Returns:
            Generic success response
            
        Raises:
            UserNotFoundError: If user not found
            InvalidPasswordError: If old password is incorrect
        """
        # Get user
        user = await self._user_repository.get_by_id(user_id)
        if not user:
            raise UserNotFoundError("User not found")
        
        # Verify old password
        if not self._password_service.verify_password(request.old_password, user.hashed_password):
            raise InvalidPasswordError("Current password is incorrect")
        
        # Hash new password
        new_hashed_password = self._password_service.hash_password(request.new_password)
        
        # Update user password
        user.hashed_password = new_hashed_password
        await self._user_repository.update(user)
        
        # TODO: In production, consider:
        # - Revoking all existing refresh tokens for security
        # - Logging the password change event
        # - Sending notification email
        
        return GenericResponse(
            ok=True,
            message="Password successfully changed"
        )

