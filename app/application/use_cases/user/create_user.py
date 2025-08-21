from application.dto.user import UserCreateDTO, UserResponseDTO
from infrastructure.config.auth import get_password_hash
from domain.entities.user import User
from domain.repositories.user import UserRepository
from shared.exceptions.user import UserAlreadyExistsError

class CreateUserUseCase:
    def __init__(self, user_repository: UserRepository):
        self._user_repository = user_repository

    async def execute(self, user_data: UserCreateDTO) -> UserResponseDTO:
        existing_user = await self._user_repository.get_by_email(user_data.email)
        if existing_user:
            raise UserAlreadyExistsError(f"User with email {user_data.email} already exists.")

        hashed_password = get_password_hash(user_data.password)

        new_user = User(
            id=0, # Set by repository
            email=user_data.email,
            hashed_password=hashed_password,
            full_name=user_data.full_name,
            is_active=True,
            roles=[] # Default roles can be assigned here if needed
        )

        created_user = await self._user_repository.create(new_user)

        return UserResponseDTO(
            id=created_user.id,
            email=created_user.email,
            full_name=created_user.full_name,
            is_active=created_user.is_active,
            roles=[role.name for role in created_user.roles]
        )
