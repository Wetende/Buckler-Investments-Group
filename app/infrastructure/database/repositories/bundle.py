from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ....domain.entities.bundle import Bundle
from ....domain.repositories.bundle import BundleRepository
from ..models.bundle import BundleModel
from ....shared.mappers.bundle import BundleMapper

class SqlAlchemyBundleRepository(BundleRepository):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def create(self, entity: Bundle) -> Bundle:
        model = BundleMapper.entity_to_model(entity)
        self._session.add(model)
        await self._session.commit()
        await self._session.refresh(model, ['items'])
        return BundleMapper.model_to_entity(model)

    async def find_by_id(self, bundle_id: int) -> Optional[Bundle]:
        stmt = select(BundleModel).options(selectinload(BundleModel.items)).where(BundleModel.id == bundle_id)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        return BundleMapper.model_to_entity(model) if model else None
