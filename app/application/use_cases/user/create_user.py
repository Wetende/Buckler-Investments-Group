from datetime import datetime
from application.dto.user import UserCreateDTO, UserResponseDTO
from domain.entities.user import User
from domain.repositories.user import UserRepository
from domain.services.password_service import PasswordService
from domain.value_objects.user_role import UserRole
from shared.exceptions.user import UserAlreadyExistsError

class CreateUserUseCase:
    def __init__(self, user_repository: UserRepository, password_service: PasswordService):
        self._user_repository = user_repository
        self._password_service = password_service

    async def execute(self, user_data: UserCreateDTO) -> UserResponseDTO:
        existing_user = await self._user_repository.get_by_email(user_data.email)
        if existing_user:
            raise UserAlreadyExistsError(f"User with email {user_data.email} already exists.")

        hashed_password = self._password_service.hash_password(user_data.password)

        new_user = User(
            id=0, # Set by repository
            created_at=datetime.now(),
            updated_at=datetime.now(),
            email=user_data.email,
            hashed_password=hashed_password,
            full_name=user_data.name,
            is_active=True,
            role=user_data.role if user_data.role else UserRole.BUYER,
            phone_number=user_data.phone,
        )

        created_user = await self._user_repository.create(new_user)

        return UserResponseDTO(
            id=created_user.id,
            email=created_user.email,
            name=created_user.full_name,
            phone=created_user.phone_number,
            role=created_user.role,
            is_active=created_user.is_active,
            created_at=created_user.created_at
        )
