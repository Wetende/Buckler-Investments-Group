"""
Public investment routes - accessible without authentication.

Consolidated from:
- invest.py (public endpoints)
- investment/routes.py (list functionality)
"""
from decimal import Decimal
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from dependency_injector.wiring import inject, Provide

from infrastructure.config.database import get_async_session
from infrastructure.database.models import InvProduct
from application.dto.invest import ProductRead
from application.dto.investment import InvestmentResponseDTO
from application.use_cases.investment.list_investments import ListInvestmentsUseCase
from api.containers import AppContainer

router = APIRouter()

# Investment products catalog
@router.get("/products", response_model=List[ProductRead])
async def list_products(
    active: Optional[bool] = Query(None),
    max_min_invest: Optional[Decimal] = None,
    session: AsyncSession = Depends(get_async_session),
):
    """List available investment products."""
    stmt = select(InvProduct)
    if active is not None:
        stmt = stmt.where(InvProduct.is_active == active)
    if max_min_invest is not None:
        stmt = stmt.where(InvProduct.min_invest <= max_min_invest)
    stmt = stmt.order_by(InvProduct.created_at.desc())
    res = await session.execute(stmt)
    return res.scalars().all()

# Product details
@router.get("/products/{slug}", response_model=ProductRead)
async def get_product(slug: str, session: AsyncSession = Depends(get_async_session)):
    """Get investment product details by slug."""
    stmt = select(InvProduct).where(InvProduct.slug == slug)
    res = await session.execute(stmt)
    product = res.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Investment product not found")
    return product

# General investment opportunities (using use case)
@router.get("/opportunities", response_model=List[InvestmentResponseDTO])
@inject
async def list_investment_opportunities(
    status: Optional[str] = None,
    use_case: ListInvestmentsUseCase = Depends(Provide[AppContainer.investment_use_cases.list_investments_use_case]),
) -> List[InvestmentResponseDTO]:
    """List available investment opportunities using business use case."""
    return await use_case.execute(status=status)
