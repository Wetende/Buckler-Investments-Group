from typing import List, Optional
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from ....domain.repositories.bnb import BnbRepository, BookingRepository
from ....domain.entities.bnb import ShortTermListing, Booking
from ..models.bnb import StListing as StListingModel
from ..models.booking import Booking as BookingModel
from ....shared.mappers.bnb import BnbMapper

class SqlAlchemyBnbRepository(BnbRepository):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def create(self, entity: ShortTermListing) -> ShortTermListing:
        model = BnbMapper.entity_to_model(entity)
        self._session.add(model)
        await self._session.commit()
        await self._session.refresh(model)
        return BnbMapper.model_to_entity(model)

    async def get_by_id(self, id: int) -> Optional[ShortTermListing]:
        stmt = select(StListingModel).where(StListingModel.id == id)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        return BnbMapper.model_to_entity(model) if model else None

    async def update(self, entity: ShortTermListing) -> ShortTermListing:
        model = BnbMapper.entity_to_model(entity)
        await self._session.merge(model)
        await self._session.commit()
        return entity

    async def delete(self, id: int) -> None:
        model = await self._session.get(StListingModel, id)
        if model:
            await self._session.delete(model)
            await self._session.commit()

    async def list(self, limit: int = 100, offset: int = 0) -> List[ShortTermListing]:
        stmt = select(StListingModel).limit(limit).offset(offset)
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [BnbMapper.model_to_entity(model) for model in models]

    async def search_available(
        self, check_in: date, check_out: date, guests: int
    ) -> List[ShortTermListing]:
        # NOTE: This is a simplified search. A real implementation would check for booking conflicts.
        stmt = select(StListingModel).where(
            and_(
                StListingModel.capacity >= guests,
            )
        )
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [BnbMapper.model_to_entity(model) for model in models]

    async def get_by_host(self, host_id: int) -> List[ShortTermListing]:
        stmt = select(StListingModel).where(StListingModel.host_id == host_id)
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [BnbMapper.model_to_entity(model) for model in models]


class SqlAlchemyBookingRepository(BookingRepository):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def create(self, entity: Booking) -> Booking:
        model = BnbMapper.booking_entity_to_model(entity)
        self._session.add(model)
        await self._session.commit()
        await self._session.refresh(model)
        return BnbMapper.booking_model_to_entity(model)

    async def get_by_id(self, id: int) -> Optional[Booking]:
        stmt = select(BookingModel).where(BookingModel.id == id)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        return BnbMapper.booking_model_to_entity(model) if model else None

    async def update(self, entity: Booking) -> Booking:
        model = BnbMapper.booking_entity_to_model(entity)
        await self._session.merge(model)
        await self._session.commit()
        return entity

    async def delete(self, id: int) -> None:
        model = await self._session.get(BookingModel, id)
        if model:
            await self._session.delete(model)
            await self._session.commit()

    async def list(self, limit: int = 100, offset: int = 0) -> List[Booking]:
        stmt = select(BookingModel).limit(limit).offset(offset)
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [BnbMapper.booking_model_to_entity(model) for model in models]

    async def get_by_guest(self, guest_id: int) -> List[Booking]:
        stmt = select(BookingModel).where(BookingModel.guest_id == guest_id)
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [BnbMapper.booking_model_to_entity(model) for model in models]
