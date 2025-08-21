from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from dependency_injector.wiring import inject, Provide

from app.application.dto.investment import (
    InvestmentResponseDTO,
    InvestmentHoldingResponseDTO,
    MakeInvestmentRequestDTO,
)
from app.application.use_cases.investment.list_investments import ListInvestmentsUseCase
from app.application.use_cases.investment.make_investment import MakeInvestmentUseCase
from app.api.containers import AppContainer
from app.shared.exceptions.investment import (
    InvestmentNotFoundError,
    InvestmentClosedError,
    InvalidInvestmentAmountError,
)

router = APIRouter()

@router.get("/", response_model=List[InvestmentResponseDTO])
@inject
async def list_investments(
    status: Optional[str] = None,
    use_case: ListInvestmentsUseCase = Depends(Provide[AppContainer.investment_use_cases.list_investments_use_case]),
) -> List[InvestmentResponseDTO]:
    return await use_case.execute(status=status)

@router.post("/invest", response_model=InvestmentHoldingResponseDTO, status_code=status.HTTP_201_CREATED)
@inject
async def make_investment(
    request: MakeInvestmentRequestDTO,
    use_case: MakeInvestmentUseCase = Depends(Provide[AppContainer.investment_use_cases.make_investment_use_case]),
) -> InvestmentHoldingResponseDTO:
    try:
        return await use_case.execute(request)
    except InvestmentNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except (InvestmentClosedError, InvalidInvestmentAmountError) as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
