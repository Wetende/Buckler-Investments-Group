from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from domain.entities.investment import Investment, InvestmentHolding
from domain.repositories.investment import InvestmentRepository, InvestmentHoldingRepository
from infrastructure.database.models.investment import (
    InvProduct as InvestmentModel,
    InvPosition as InvestmentHoldingModel,
)
from shared.mappers.investment import InvestmentMapper

class SqlAlchemyInvestmentRepository(InvestmentRepository):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def create(self, entity: Investment) -> Investment:
        model = InvestmentMapper.entity_to_model(entity)
        self._session.add(model)
        await self._session.commit()
        await self._session.refresh(model)
        return InvestmentMapper.model_to_entity(model)

    async def get_by_id(self, id: int) -> Optional[Investment]:
        stmt = select(InvestmentModel).where(InvestmentModel.id == id)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        return InvestmentMapper.model_to_entity(model) if model else None

    async def list(self, limit: int = 100, offset: int = 0) -> List[Investment]:
        stmt = select(InvestmentModel).limit(limit).offset(offset)
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [InvestmentMapper.model_to_entity(m) for m in models]

    async def find_by_status(self, status: str) -> List[Investment]:
        stmt = select(InvestmentModel).where(InvestmentModel.status == status)
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [InvestmentMapper.model_to_entity(m) for m in models]


class SqlAlchemyInvestmentHoldingRepository(InvestmentHoldingRepository):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def create(self, entity: InvestmentHolding) -> InvestmentHolding:
        model = InvestmentMapper.holding_entity_to_model(entity)
        self._session.add(model)
        await self._session.commit()
        await self._session.refresh(model)
        return InvestmentMapper.holding_model_to_entity(model)

    async def get_by_id(self, id: int) -> Optional[InvestmentHolding]:
        stmt = select(InvestmentHoldingModel).where(InvestmentHoldingModel.id == id)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        return InvestmentMapper.holding_model_to_entity(model) if model else None

    async def find_by_user_id(self, user_id: int) -> List[InvestmentHolding]:
        stmt = select(InvestmentHoldingModel).where(InvestmentHoldingModel.user_id == user_id)
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [InvestmentMapper.holding_model_to_entity(m) for m in models]

    async def find_by_investment_id(self, investment_id: int) -> List[InvestmentHolding]:
        stmt = select(InvestmentHoldingModel).where(InvestmentHoldingModel.investment_id == investment_id)
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [InvestmentMapper.holding_model_to_entity(m) for m in models]
