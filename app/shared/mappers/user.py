from domain.entities.user import User
from infrastructure.database.models.user import User as UserModel
from domain.value_objects.user_role import UserRole

class UserMapper:
    @staticmethod
    def model_to_entity(model: UserModel) -> User:
        return User(
            id=model.id,
            email=model.email,
            hashed_password=model.hashed_password,
            full_name=model.name,  # Model uses 'name', entity uses 'full_name'
            is_active=model.is_active,
            role=model.role,  # Single role enum
            phone_number=model.phone,  # Optional phone field
            agent_license_id=model.agent_license_id,
            agency_name=model.agency_name,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    @staticmethod
    def entity_to_model(entity: User) -> UserModel:
        return UserModel(
            id=entity.id if entity.id != 0 else None,
            email=entity.email,
            hashed_password=entity.hashed_password,
            name=entity.full_name,  # Entity uses 'full_name', model uses 'name'
            phone=getattr(entity, 'phone_number', None),
            role=getattr(entity, 'role', UserRole.BUYER),
            agent_license_id=getattr(entity, 'agent_license_id', None),
            agency_name=getattr(entity, 'agency_name', None),
            is_active=entity.is_active,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
        )
