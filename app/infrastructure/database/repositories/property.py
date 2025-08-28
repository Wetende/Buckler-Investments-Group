from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from domain.entities.property import Property
from domain.repositories.property import PropertyRepository
from infrastructure.database.models.property import Property as PropertyModel
from shared.mappers.property import PropertyMapper

class SqlAlchemyPropertyRepository(PropertyRepository):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def create(self, entity: Property) -> Property:
        model = PropertyMapper.entity_to_model(entity)
        self._session.add(model)
        await self._session.commit()
        await self._session.refresh(model)
        return PropertyMapper.model_to_entity(model)

    async def get_by_id(self, id: int) -> Optional[Property]:
        stmt = select(PropertyModel).where(PropertyModel.id == id)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        return PropertyMapper.model_to_entity(model) if model else None

    async def update(self, entity: Property) -> Property:
        model = PropertyMapper.entity_to_model(entity)
        await self._session.merge(model)
        await self._session.commit()
        return entity

    async def delete(self, id: int) -> None:
        stmt = select(PropertyModel).where(PropertyModel.id == id)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        if model:
            await self._session.delete(model)
            await self._session.commit()

    async def search(
        self,
        location: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        min_bedrooms: Optional[int] = None,
        min_bathrooms: Optional[float] = None,
    ) -> List[Property]:
        stmt = select(PropertyModel)
        if location:
            stmt = stmt.where(PropertyModel.address.ilike(f"%{location}%"))
        if min_price:
            stmt = stmt.where(PropertyModel.listing_price >= min_price)
        if max_price:
            stmt = stmt.where(PropertyModel.listing_price <= max_price)
        if min_bedrooms:
            stmt = stmt.where(PropertyModel.features['bedrooms'].as_integer() >= min_bedrooms)
        if min_bathrooms:
            stmt = stmt.where(PropertyModel.features['bathrooms'].as_float() >= min_bathrooms)
        
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [PropertyMapper.model_to_entity(m) for m in models]

    async def list(self, limit: int = 100, offset: int = 0) -> List[Property]:
        stmt = select(PropertyModel).limit(limit).offset(offset)
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [PropertyMapper.model_to_entity(m) for m in models]

    async def find_by_agent(self, agent_id: int) -> List[Property]:
        stmt = select(PropertyModel).where(PropertyModel.agent_id == agent_id)
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [PropertyMapper.model_to_entity(m) for m in models]
