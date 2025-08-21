from datetime import datetime

from application.dto.property import CreatePropertyRequestDTO, PropertyResponseDTO
from domain.entities.property import Property, PropertyFeatures
from domain.repositories.property import PropertyRepository
from domain.value_objects.money import Money

class CreatePropertyUseCase:
    def __init__(self, property_repository: PropertyRepository):
        self._property_repository = property_repository

    async def execute(self, request: CreatePropertyRequestDTO) -> PropertyResponseDTO:
        features = PropertyFeatures(**request.features.model_dump())

        property_entity = Property(
            id=0,  # Will be set by the repository
            agent_id=request.agent_id,
            title=request.title,
            description=request.description,
            address=request.address,
            listing_price=Money(amount=request.listing_price, currency="KES"),
            property_type=request.property_type,
            status='FOR_SALE',
            features=features,
            image_urls=request.image_urls,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        created_property = await self._property_repository.create(property_entity)

        return PropertyResponseDTO.from_entity(created_property)
