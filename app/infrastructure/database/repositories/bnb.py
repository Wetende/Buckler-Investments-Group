from typing import List, Optional
from datetime import date
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload
from domain.repositories.bnb import BnbRepository, BookingRepository
from domain.entities.bnb import ShortTermListing, Booking
from infrastructure.database.models.bnb_listing import StListing as StListingModel
from infrastructure.database.models.bnb_listing import Booking as BookingModel
from infrastructure.database.models.user import User as UserModel
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
    
    async def get_with_host(self, listing_id: int) -> tuple[Optional[ShortTermListing], Optional[dict]]:
        """Get listing with host information"""
        async def _get_with_host():
            # Join listing with user (host) information
            stmt = select(StListingModel, UserModel).join(
                UserModel, StListingModel.host_id == UserModel.id
            ).where(StListingModel.id == listing_id)
            
            result = await self._session.execute(stmt)
            row = result.first()
            
            if not row:
                return None, None
            
            listing_model, user_model = row
            
            # Convert listing to entity
            listing_entity = BnbMapper.model_to_entity(listing_model) if listing_model else None
            
            # Convert user to dict for host information
            host_info = None
            if user_model:
                host_info = {
                    'id': user_model.id,
                    'full_name': user_model.name,
                    'phone_number': user_model.phone,
                    'email': user_model.email
                }
            
            return listing_entity, host_info

        return await self._execute_in_session(_get_with_host)

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
        async def _search_available():
            # NOTE: This is a simplified search. A real implementation would check for booking conflicts.
            stmt = select(StListingModel).where(
                and_(
                    StListingModel.capacity >= guests,
                )
            )
            result = await self._session.execute(stmt)
            models = result.scalars().all()
            return [BnbMapper.model_to_entity(model) for model in models]
        
        return await self._execute_in_session(_search_available)

    async def get_by_host(self, host_id: int) -> List[ShortTermListing]:
        async def _get_by_host():
            stmt = select(StListingModel).where(StListingModel.host_id == host_id)
            result = await self._session.execute(stmt)
            models = result.scalars().all()
            return [BnbMapper.model_to_entity(model) for model in models]
        
        return await self._execute_in_session(_get_by_host)
    
    async def list_with_location(self, limit: int = 100, offset: int = 0) -> List[ShortTermListing]:
        """Get listings with location data populated for grouping"""
        async def _list_with_location():
            stmt = select(StListingModel).where(
                and_(
                    StListingModel.county.isnot(None),  # Only listings with county data
                    StListingModel.county != ''
                )
            ).order_by(StListingModel.created_at.desc()).limit(limit).offset(offset)
            result = await self._session.execute(stmt)
            models = result.scalars().all()
            return [BnbMapper.model_to_entity(model) for model in models]
        
        return await self._execute_in_session(_list_with_location)
    
    async def list_by_location(
        self, 
        county: str = None, 
        town: str = None,
        limit: int = 20, 
        offset: int = 0
    ) -> List[ShortTermListing]:
        """Get listings filtered by county and/or town"""
        async def _list_by_location():
            conditions = []
            
            if county:
                conditions.append(StListingModel.county.ilike(f"%{county}%"))
            
            if town:
                conditions.append(StListingModel.town.ilike(f"%{town}%"))
            
            stmt = select(StListingModel)
            if conditions:
                stmt = stmt.where(and_(*conditions))
            
            stmt = stmt.order_by(StListingModel.created_at.desc()).limit(limit).offset(offset)
            result = await self._session.execute(stmt)
            models = result.scalars().all()
            return [BnbMapper.model_to_entity(model) for model in models]
        
        return await self._execute_in_session(_list_by_location)
    
    async def get_location_stats(self) -> List[dict]:
        """Get statistics about listings grouped by location"""
        async def _get_location_stats():
            from sqlalchemy import func, text
            
            # Query to group by county and get counts
            stmt = select(
                StListingModel.county,
                StListingModel.town,
                func.count(StListingModel.id).label('listing_count'),
                func.avg(StListingModel.nightly_price).label('avg_price')
            ).where(
                and_(
                    StListingModel.county.isnot(None),
                    StListingModel.county != ''
                )
            ).group_by(
                StListingModel.county, 
                StListingModel.town
            ).order_by(
                text('listing_count DESC')
            ).limit(20)
            
            result = await self._session.execute(stmt)
            rows = result.fetchall()
            
            return [
                {
                    'county': row.county,
                    'town': row.town,
                    'listing_count': row.listing_count,
                    'average_price': float(row.avg_price) if row.avg_price else 0
                }
                for row in rows
            ]
        
        return await self._execute_in_session(_get_location_stats)


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