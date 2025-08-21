from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from domain.entities.user import User
from domain.repositories.user import UserRepository
from infrastructure.database.models.user import User as UserModel, UserRole as RoleModel
from shared.mappers.user import UserMapper

class SqlAlchemyUserRepository(UserRepository):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def create(self, entity: User) -> User:
        model = UserMapper.entity_to_model(entity)
        
        # Handle roles: find existing roles and associate them
        if entity.roles:
            role_names = [role.name for role in entity.roles]
            stmt = select(RoleModel).where(RoleModel.name.in_(role_names))
            result = await self._session.execute(stmt)
            roles = result.scalars().all()
            model.roles = roles

        self._session.add(model)
        await self._session.commit()
        await self._session.refresh(model, ['roles']) # Refresh to load roles
        return UserMapper.model_to_entity(model)

    async def get_by_id(self, id: int) -> Optional[User]:
        stmt = select(UserModel).options(selectinload(UserModel.roles)).where(UserModel.id == id)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        return UserMapper.model_to_entity(model) if model else None

    async def get_by_email(self, email: str) -> Optional[User]:
        stmt = select(UserModel).options(selectinload(UserModel.roles)).where(UserModel.email == email)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        return UserMapper.model_to_entity(model) if model else None

    async def is_agent(self, user_id: int) -> bool:
        stmt = (
            select(UserModel.id)
            .join(UserModel.roles)
            .where(UserModel.id == user_id, RoleModel.name == 'agent')
        )
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none() is not None
