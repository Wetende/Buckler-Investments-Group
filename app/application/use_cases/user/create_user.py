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
            id=0,  # Assigned by repository/DB
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

        return UserResponseDTO.from_entity(created_user)
