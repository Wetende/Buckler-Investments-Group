from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from domain.entities.user import User
from domain.repositories.user import UserRepository
from domain.value_objects.user_role import UserRole
from infrastructure.database.models.user import User as UserModel
from shared.mappers.user import UserMapper

class SqlAlchemyUserRepository(UserRepository):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def create(self, entity: User) -> User:
        model = UserMapper.entity_to_model(entity)
        self._session.add(model)
        await self._session.commit()
        await self._session.refresh(model)
        return UserMapper.model_to_entity(model)

    async def get_by_id(self, id: int) -> Optional[User]:
        stmt = select(UserModel).where(UserModel.id == id)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        return UserMapper.model_to_entity(model) if model else None

    async def get_by_email(self, email: str) -> Optional[User]:
        stmt = select(UserModel).where(UserModel.email == email)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        return UserMapper.model_to_entity(model) if model else None

    async def is_agent(self, user_id: int) -> bool:
        stmt = select(UserModel.role).where(UserModel.id == user_id)
        result = await self._session.execute(stmt)
        role = result.scalar_one_or_none()
        return role == UserRole.AGENT if role else False

    async def update(self, entity: User) -> User:
        """Update an existing user."""
        # Get the existing model
        stmt = select(UserModel).where(UserModel.id == entity.id)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        
        if not model:
            raise ValueError(f"User with id {entity.id} not found")
        
        # Update the model with new data
        updated_model = UserMapper.entity_to_model(entity)
        model.email = updated_model.email
        model.name = updated_model.name
        model.phone = updated_model.phone
        model.hashed_password = updated_model.hashed_password
        model.role = updated_model.role
        model.is_active = updated_model.is_active
        model.agent_license_id = updated_model.agent_license_id
        model.agency_name = updated_model.agency_name
        model.updated_at = updated_model.updated_at
        
        await self._session.commit()
        await self._session.refresh(model)
        return UserMapper.model_to_entity(model)

    async def delete(self, id: int) -> None:
        """Delete a user by ID."""
        stmt = select(UserModel).where(UserModel.id == id)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        
        if model:
            await self._session.delete(model)
            await self._session.commit()

    async def list(self, limit: int = 100, offset: int = 0) -> list[User]:
        """List users with pagination."""
        stmt = (
            select(UserModel)
            .limit(limit)
            .offset(offset)
        )
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [UserMapper.model_to_entity(model) for model in models]
