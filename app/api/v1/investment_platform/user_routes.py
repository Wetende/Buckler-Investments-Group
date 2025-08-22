"""
User investment routes - requires authentication.

Consolidated from:
- invest.py (user-specific endpoints)
- investment/routes.py (make investment functionality)
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from dependency_injector.wiring import inject, Provide

from infrastructure.config.database import get_async_session
from infrastructure.config.dependencies import current_active_user
from infrastructure.database.models import InvOrder, InvPosition, KycRecord
from infrastructure.database.models.investment import OrderStatus, KycStatus
from infrastructure.database.models.user import User
from application.dto.invest import OrderCU, OrderRead, PositionRead, KycCU, KycRead
from application.dto.investment import (
    InvestmentHoldingResponseDTO,
    MakeInvestmentRequestDTO,
)
from application.use_cases.investment.make_investment import MakeInvestmentUseCase
from api.containers import AppContainer
from shared.exceptions.investment import (
    InvestmentNotFoundError,
    InvestmentClosedError,
    InvalidInvestmentAmountError,
)

router = APIRouter()

# Make investment using use case pattern
@router.post("/invest", response_model=InvestmentHoldingResponseDTO, status_code=status.HTTP_201_CREATED)
@inject
async def make_investment(
    request: MakeInvestmentRequestDTO = Body(...),
    use_case: MakeInvestmentUseCase = Depends(Provide[AppContainer.investment_use_cases.make_investment_use_case]),
) -> InvestmentHoldingResponseDTO:
    """Make an investment using business use case."""
    try:
        return await use_case.execute(request)
    except InvestmentNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except (InvestmentClosedError, InvalidInvestmentAmountError) as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

# Place investment order
@router.post("/orders", response_model=OrderRead)
async def create_order(
    payload: OrderCU,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user),
):
    """Place an investment order."""
    new_order = InvOrder(
        **payload.model_dump(),
        user_id=user.id,
        status=OrderStatus.PENDING,
    )
    session.add(new_order)
    await session.commit()
    await session.refresh(new_order)
    return new_order

# Get user's orders
@router.get("/orders", response_model=List[OrderRead])
async def list_user_orders(
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user),
):
    """Get current user's investment orders."""
    stmt = select(InvOrder).where(InvOrder.user_id == user.id).order_by(InvOrder.created_at.desc())
    res = await session.execute(stmt)
    return res.scalars().all()

# Get user's positions
@router.get("/positions", response_model=List[PositionRead])
async def list_user_positions(
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user),
):
    """Get current user's investment positions."""
    stmt = select(InvPosition).where(InvPosition.user_id == user.id)
    res = await session.execute(stmt)
    return res.scalars().all()

# KYC submission
@router.post("/kyc", response_model=KycRead)
async def submit_kyc(
    payload: KycCU,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user),
):
    """Submit KYC information."""
    existing_kyc = (await session.execute(select(KycRecord).where(KycRecord.user_id == user.id))).scalar_one_or_none()
    if existing_kyc:
        raise HTTPException(status_code=400, detail="KYC already submitted")
    
    new_kyc = KycRecord(
        **payload.model_dump(),
        user_id=user.id,
        status=KycStatus.SUBMITTED,
    )
    session.add(new_kyc)
    await session.commit()
    await session.refresh(new_kyc)
    return new_kyc
