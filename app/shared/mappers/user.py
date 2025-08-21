from domain.entities.user import User, UserRole
from infrastructure.database.models.user import User as UserModel, UserRole as RoleModel

class UserMapper:
    @staticmethod
    def model_to_entity(model: UserModel) -> User:
        return User(
            id=model.id,
            email=model.email,
            hashed_password=model.hashed_password,
            full_name=model.full_name,
            is_active=model.is_active,
            roles=[UserRole(name=role.name) for role in model.roles],
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    @staticmethod
    def entity_to_model(entity: User) -> UserModel:
        # Note: This mapper does not handle role creation/association directly.
        # That logic would typically reside in the repository or a dedicated service
        # to avoid duplicating roles.
        return UserModel(
            id=entity.id if entity.id != 0 else None,
            email=entity.email,
            hashed_password=entity.hashed_password,
            full_name=entity.full_name,
            is_active=entity.is_active,
        )
