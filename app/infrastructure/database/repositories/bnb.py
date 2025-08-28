from typing import List, Optional
from datetime import date
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from domain.repositories.bnb import BnbRepository, BookingRepository
from domain.entities.bnb import ShortTermListing, Booking
from infrastructure.database.models.bnb_listing import StListing as StListingModel
from infrastructure.database.models.booking import Booking as BookingModel
from shared.mappers.bnb import BnbMapper
from infrastructure.config.database import AsyncSessionLocal

class SqlAlchemyBnbRepository(BnbRepository):
    def __init__(self, session: AsyncSession = None):
        self._session = session
        self._managed_session = session is None

    @asynccontextmanager
    async def _get_session(self):
        """Context manager for session handling."""
        if self._session and not self._managed_session:
            # Use provided session
            yield self._session
        else:
            # Create and manage our own session
            session = AsyncSessionLocal()
            try:
                yield session
            finally:
                await session.close()

    async def _execute_in_session(self, operation):
        """Execute operation with proper session management."""
        async with self._get_session() as session:
            # Update session reference for operations
            if self._managed_session:
                self._session = session
            return await operation()

    async def create(self, entity: ShortTermListing) -> ShortTermListing:
        async def _create():
            model = BnbMapper.entity_to_model(entity)
            self._session.add(model)
            try:
                await self._session.commit()
                await self._session.refresh(model)
                return BnbMapper.model_to_entity(model)
            except Exception as e:
                await self._session.rollback()
                raise e

        return await self._execute_in_session(_create)

    async def get_by_id(self, id: int) -> Optional[ShortTermListing]:
        async def _get():
            stmt = select(StListingModel).where(StListingModel.id == id)
            result = await self._session.execute(stmt)
            model = result.scalar_one_or_none()
            return BnbMapper.model_to_entity(model) if model else None

        return await self._execute_in_session(_get)

    async def update(self, entity: ShortTermListing) -> ShortTermListing:
        async def _update():
            model = BnbMapper.entity_to_model(entity)
            try:
                await self._session.merge(model)
                await self._session.commit()
                return entity
            except Exception as e:
                await self._session.rollback()
                raise e

        return await self._execute_in_session(_update)

    async def delete(self, id: int) -> None:
        async def _delete():
            try:
                model = await self._session.get(StListingModel, id)
                if model:
                    await self._session.delete(model)
                    await self._session.commit()
            except Exception as e:
                await self._session.rollback()
                raise e

        await self._execute_in_session(_delete)

    async def list(self, limit: int = 100, offset: int = 0) -> List[ShortTermListing]:
        async def _list():
            stmt = select(StListingModel).limit(limit).offset(offset)
            result = await self._session.execute(stmt)
            models = result.scalars().all()
            return [BnbMapper.model_to_entity(model) for model in models]

        return await self._execute_in_session(_list)

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
    def __init__(self, session: AsyncSession = None):
        self._session = session
        self._managed_session = session is None

    @asynccontextmanager
    async def _get_session(self):
        """Context manager for session handling."""
        if self._session and not self._managed_session:
            # Use provided session
            yield self._session
        else:
            # Create and manage our own session
            session = AsyncSessionLocal()
            try:
                yield session
            finally:
                await session.close()

    async def _execute_in_session(self, operation):
        """Execute operation with proper session management."""
        async with self._get_session() as session:
            # Update session reference for operations
            if self._managed_session:
                self._session = session
            return await operation()

    async def create(self, entity: Booking) -> Booking:
        async def _create():
            model = BnbMapper.booking_entity_to_model(entity)
            self._session.add(model)
            try:
                await self._session.commit()
                await self._session.refresh(model)
                return BnbMapper.booking_model_to_entity(model)
            except Exception as e:
                await self._session.rollback()
                raise e

        return await self._execute_in_session(_create)

    async def get_by_id(self, id: int) -> Optional[Booking]:
        async def _get():
            stmt = select(BookingModel).where(BookingModel.id == id)
            result = await self._session.execute(stmt)
            model = result.scalar_one_or_none()
            return BnbMapper.booking_model_to_entity(model) if model else None

        return await self._execute_in_session(_get)

    async def update(self, entity: Booking) -> Booking:
        async def _update():
            model = BnbMapper.booking_entity_to_model(entity)
            try:
                await self._session.merge(model)
                await self._session.commit()
                return entity
            except Exception as e:
                await self._session.rollback()
                raise e

        return await self._execute_in_session(_update)

    async def delete(self, id: int) -> None:
        async def _delete():
            try:
                model = await self._session.get(BookingModel, id)
                if model:
                    await self._session.delete(model)
                    await self._session.commit()
            except Exception as e:
                await self._session.rollback()
                raise e

        await self._execute_in_session(_delete)

    async def list(self, limit: int = 100, offset: int = 0) -> List[Booking]:
        async def _list():
            stmt = select(BookingModel).limit(limit).offset(offset)
            result = await self._session.execute(stmt)
            models = result.scalars().all()
            return [BnbMapper.booking_model_to_entity(model) for model in models]

        return await self._execute_in_session(_list)

    async def get_by_guest(self, guest_id: int) -> List[Booking]:
        async def _get_guest():
            stmt = select(BookingModel).where(BookingModel.guest_id == guest_id)
            result = await self._session.execute(stmt)
            models = result.scalars().all()
            return [BnbMapper.booking_model_to_entity(model) for model in models]

        return await self._execute_in_session(_get_guest)

    async def get_by_listing_id(self, listing_id: int) -> List[Booking]:
        async def _get_listing():
            stmt = select(BookingModel).where(BookingModel.listing_id == listing_id)
            result = await self._session.execute(stmt)
            models = result.scalars().all()
            return [BnbMapper.booking_model_to_entity(model) for model in models]

        return await self._execute_in_session(_get_listing)