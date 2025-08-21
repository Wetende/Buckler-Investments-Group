from typing import List, Optional
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from domain.repositories.tours import TourRepository, TourBookingRepository
from domain.entities.tours import Tour, TourBooking
from infrastructure.database.models.tours import Tour as TourModel
from infrastructure.database.models.tour_booking import TourBooking as TourBookingModel
from shared.mappers.tours import TourMapper

class SqlAlchemyTourRepository(TourRepository):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def create(self, entity: Tour) -> Tour:
        model = TourMapper.entity_to_model(entity)
        self._session.add(model)
        await self._session.commit()
        await self._session.refresh(model)
        return TourMapper.model_to_entity(model)

    async def get_by_id(self, id: int) -> Optional[Tour]:
        stmt = select(TourModel).where(TourModel.id == id)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        return TourMapper.model_to_entity(model) if model else None

    async def update(self, entity: Tour) -> Tour:
        model = TourMapper.entity_to_model(entity)
        await self._session.merge(model)
        await self._session.commit()
        return entity

    async def delete(self, id: int) -> None:
        model = await self._session.get(TourModel, id)
        if model:
            await self._session.delete(model)
            await self._session.commit()

    async def list(self, limit: int = 100, offset: int = 0) -> List[Tour]:
        stmt = select(TourModel).limit(limit).offset(offset)
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [TourMapper.model_to_entity(model) for model in models]

    async def search_by_location_and_date(
        self, location: str, start_date: date
    ) -> List[Tour]:
        # NOTE: This is a simplified search. A real implementation would be more complex.
        stmt = select(TourModel) # .where(TourModel.location == location)
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [TourMapper.model_to_entity(model) for model in models]


class SqlAlchemyTourBookingRepository(TourBookingRepository):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def create(self, entity: TourBooking) -> TourBooking:
        model = TourMapper.booking_entity_to_model(entity)
        self._session.add(model)
        await self._session.commit()
        await self._session.refresh(model)
        return TourMapper.booking_model_to_entity(model)

    async def get_by_id(self, id: int) -> Optional[TourBooking]:
        stmt = select(TourBookingModel).where(TourBookingModel.id == id)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        return TourMapper.booking_model_to_entity(model) if model else None

    async def update(self, entity: TourBooking) -> TourBooking:
        model = TourMapper.booking_entity_to_model(entity)
        await self._session.merge(model)
        await self._session.commit()
        return entity

    async def delete(self, id: int) -> None:
        model = await self._session.get(TourBookingModel, id)
        if model:
            await self._session.delete(model)
            await self._session.commit()

    async def list(self, limit: int = 100, offset: int = 0) -> List[TourBooking]:
        stmt = select(TourBookingModel).limit(limit).offset(offset)
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [TourMapper.booking_model_to_entity(model) for model in models]

    async def get_by_customer(self, customer_id: int) -> List[TourBooking]:
        stmt = select(TourBookingModel).where(TourBookingModel.customer_id == customer_id)
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [TourMapper.booking_model_to_entity(model) for model in models]
