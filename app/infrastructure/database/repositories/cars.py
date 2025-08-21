from typing import List, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from ....domain.repositories.cars import VehicleRepository, CarRentalRepository
from ....domain.entities.cars import Vehicle, CarRental
from ..models.vehicle import Vehicle as VehicleModel
from ..models.car_rental import CarRental as CarRentalModel
from ....shared.mappers.cars import CarMapper

class SqlAlchemyVehicleRepository(VehicleRepository):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def create(self, entity: Vehicle) -> Vehicle:
        model = CarMapper.entity_to_model(entity)
        self._session.add(model)
        await self._session.commit()
        await self._session.refresh(model)
        return CarMapper.model_to_entity(model)

    async def get_by_id(self, id: int) -> Optional[Vehicle]:
        stmt = select(VehicleModel).where(VehicleModel.id == id)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        return CarMapper.model_to_entity(model) if model else None

    async def update(self, entity: Vehicle) -> Vehicle:
        model = CarMapper.entity_to_model(entity)
        await self._session.merge(model)
        await self._session.commit()
        return entity

    async def delete(self, id: int) -> None:
        model = await self._session.get(VehicleModel, id)
        if model:
            await self._session.delete(model)
            await self._session.commit()

    async def list(self, limit: int = 100, offset: int = 0) -> List[Vehicle]:
        stmt = select(VehicleModel).limit(limit).offset(offset)
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [CarMapper.model_to_entity(model) for model in models]

    async def search_available(
        self, start_date: datetime, end_date: datetime
    ) -> List[Vehicle]:
        # NOTE: This is a simplified search. A real implementation would check for booking conflicts.
        stmt = select(VehicleModel)
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [CarMapper.model_to_entity(model) for model in models]


class SqlAlchemyCarRentalRepository(CarRentalRepository):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def create(self, entity: CarRental) -> CarRental:
        model = CarMapper.rental_entity_to_model(entity)
        self._session.add(model)
        await self._session.commit()
        await self._session.refresh(model)
        return CarMapper.rental_model_to_entity(model)

    async def get_by_id(self, id: int) -> Optional[CarRental]:
        stmt = select(CarRentalModel).where(CarRentalModel.id == id)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        return CarMapper.rental_model_to_entity(model) if model else None

    async def update(self, entity: CarRental) -> CarRental:
        model = CarMapper.rental_entity_to_model(entity)
        await self._session.merge(model)
        await self._session.commit()
        return entity

    async def delete(self, id: int) -> None:
        model = await self._session.get(CarRentalModel, id)
        if model:
            await self._session.delete(model)
            await self._session.commit()

    async def list(self, limit: int = 100, offset: int = 0) -> List[CarRental]:
        stmt = select(CarRentalModel).limit(limit).offset(offset)
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [CarMapper.rental_model_to_entity(model) for model in models]

    async def get_by_renter(self, renter_id: int) -> List[CarRental]:
        stmt = select(CarRentalModel).where(CarRentalModel.renter_id == renter_id)
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [CarMapper.rental_model_to_entity(model) for model in models]
