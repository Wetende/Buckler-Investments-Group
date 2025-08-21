from typing import List
from fastapi import APIRouter, Depends, status
from dependency_injector.wiring import inject, Provide

from application.dto.property import (
    PropertyResponseDTO, 
    CreatePropertyRequestDTO, 
    SearchPropertiesRequestDTO
)
from application.use_cases.property.create_property import CreatePropertyUseCase
from application.use_cases.property.search_properties import SearchPropertiesUseCase
from ...containers import AppContainer

router = APIRouter()

@router.post("/search", response_model=List[PropertyResponseDTO])
@inject
async def search_properties(
    request: SearchPropertiesRequestDTO,
    use_case: SearchPropertiesUseCase = Depends(Provide[AppContainer.property_use_cases.search_properties_use_case]),
) -> List[PropertyResponseDTO]:
    return await use_case.execute(request)

@router.post("/", response_model=PropertyResponseDTO, status_code=status.HTTP_201_CREATED)
@inject
async def create_property(
    request: CreatePropertyRequestDTO,
    use_case: CreatePropertyUseCase = Depends(Provide[AppContainer.property_use_cases.create_property_use_case]),
) -> PropertyResponseDTO:
    return await use_case.execute(request)
