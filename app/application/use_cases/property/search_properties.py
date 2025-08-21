from typing import List

from app.application.dto.property import PropertyResponseDTO, SearchPropertiesRequestDTO
from app.domain.repositories.property import PropertyRepository

class SearchPropertiesUseCase:
    def __init__(self, property_repository: PropertyRepository):
        self._property_repository = property_repository

    async def execute(self, request: SearchPropertiesRequestDTO) -> List[PropertyResponseDTO]:
        properties = await self._property_repository.search(
            location=request.location,
            min_price=request.min_price,
            max_price=request.max_price,
            min_bedrooms=request.min_bedrooms,
            min_bathrooms=request.min_bathrooms,
        )
        return [PropertyResponseDTO.from_entity(p) for p in properties]
