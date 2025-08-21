import pytest
from unittest.mock import AsyncMock
from decimal import Decimal

from app.application.dto.property import CreatePropertyRequestDTO, PropertyFeaturesDTO, SearchPropertiesRequestDTO
from app.application.use_cases.property.create_property import CreatePropertyUseCase
from app.application.use_cases.property.search_properties import SearchPropertiesUseCase
from app.domain.entities.property import Property, PropertyFeatures
from app.domain.value_objects.money import Money

@pytest.mark.asyncio
async def test_search_properties_use_case():
    # Arrange
    mock_repo = AsyncMock()
    mock_repo.search.return_value = []
    use_case = SearchPropertiesUseCase(property_repository=mock_repo)
    request = SearchPropertiesRequestDTO(location="Test Location", min_price=100000)

    # Act
    await use_case.execute(request)

    # Assert
    mock_repo.search.assert_called_once_with(
        location="Test Location",
        min_price=100000,
        max_price=None,
        min_bedrooms=None,
        min_bathrooms=None,
    )

@pytest.mark.asyncio
async def test_create_property_use_case():
    # Arrange
    mock_repo = AsyncMock()
    mock_repo.create.side_effect = lambda prop: prop  # Return the same property passed in
    use_case = CreatePropertyUseCase(property_repository=mock_repo)
    request = CreatePropertyRequestDTO(
        agent_id=1,
        title="Beautiful Villa",
        description="A lovely villa.",
        address="123 Test St",
        listing_price=Decimal("500000"),
        property_type="SINGLE_FAMILY",
        features=PropertyFeaturesDTO(bedrooms=4, bathrooms=3, square_feet=2500)
    )

    # Act
    result = await use_case.execute(request)

    # Assert
    mock_repo.create.assert_called_once()
    created_entity = mock_repo.create.call_args[0][0]
    
    assert isinstance(created_entity, Property)
    assert created_entity.title == "Beautiful Villa"
    assert created_entity.listing_price.amount == Decimal("500000")
    assert result.title == "Beautiful Villa"
