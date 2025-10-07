"""
Use case: Enable hosting for the current user (upgrade role to HOST).
Idempotent: If already HOST (or higher like ADMIN), returns current state.
"""
from datetime import datetime

from domain.repositories.user import UserRepository
from shared.constants.user_roles import UserRole
from application.dto.user import UserResponseDTO


class EnableHostUseCase:
    def __init__(self, user_repository: UserRepository):
        self._user_repository = user_repository

    async def execute(self, user_id: int) -> UserResponseDTO:
        """Promote the given user to HOST if not already provider.
        - If role is USER -> set to HOST
                - If role is HOST/ADMIN/SUPER_ADMIN -> leave as-is
                        - If other provider roles (AGENT, TOUR_OPERATOR,
                            VEHICLE_OWNER), preserve role
        """
        user = await self._user_repository.get_by_id(user_id)
        if not user:
            raise ValueError("User not found")

        # Only upgrade plain USER to HOST; keep admins/providers unchanged
        if user.role == UserRole.USER:
            user.role = UserRole.HOST
            user.updated_at = datetime.now()
            user = await self._user_repository.update(user)

        return UserResponseDTO.from_entity(user)
