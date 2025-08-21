from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from domain.entities.bundle_booking import BundleBooking
from domain.repositories.bundle_booking import BundleBookingRepository
from infrastructure.database.models.bundle_booking import BundleBookingModel
from shared.mappers.bundle_booking import BundleBookingMapper

class SqlAlchemyBundleBookingRepository(BundleBookingRepository):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def create(self, entity: BundleBooking) -> BundleBooking:
        model = BundleBookingMapper.entity_to_model(entity)
        self._session.add(model)
        await self._session.commit()
        await self._session.refresh(model)
        return BundleBookingMapper.model_to_entity(model)

    async def get_by_id(self, booking_id: int) -> Optional[BundleBooking]:
        stmt = select(BundleBookingModel).where(BundleBookingModel.id == booking_id)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        return BundleBookingMapper.model_to_entity(model) if model else None

    async def get_by_user_id(self, user_id: int) -> List[BundleBooking]:
        stmt = select(BundleBookingModel).where(BundleBookingModel.user_id == user_id)
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [BundleBookingMapper.model_to_entity(model) for model in models]
