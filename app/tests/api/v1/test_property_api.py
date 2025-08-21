import pytest
from decimal import Decimal

from domain.entities.property import Property, PropertyFeatures
from domain.value_objects.money import Money

@pytest.mark.asyncio
async def test_search_properties_api(client):
    # Arrange
    mock_property = Property(
        id=1, agent_id=1, title="Test Property", description="", address="123 Test",
        listing_price=Money(Decimal("200000"), "KES"), property_type="HOUSE", status="FOR_SALE",
        features=PropertyFeatures(bedrooms=3, bathrooms=2, square_feet=1500),
        image_urls=[], created_at=None, updated_at=None
    )
    client.mock_property_repo.search.return_value = [mock_property]

    # Act
    response = client.post("/api/v1/property/search", json={
        "location": "Test",
        "min_price": 150000
    })

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Test Property"
    assert data[0]["listing_price"]["amount"] == "200000.00"

@pytest.mark.asyncio
async def test_create_property_api(client):
    # Arrange
    def side_effect(prop):
        prop.id = 1 # Simulate setting ID on creation
        return prop
    client.mock_property_repo.create.side_effect = side_effect

    property_data = {
        "agent_id": 1,
        "title": "New Modern Home",
        "description": "Brand new construction.",
        "address": "456 New Ave, Nairobi",
        "listing_price": 750000.00,
        "property_type": "APARTMENT",
        "features": {"bedrooms": 3, "bathrooms": 2.5, "square_feet": 1800}
    }

    # Act
    response = client.post("/api/v1/property/", json=property_data)

    # Assert
    assert response.status_code == 201
    data = response.json()
    assert data["id"] == 1
    assert data["title"] == "New Modern Home"
    assert data["status"] == "FOR_SALE"
    assert data["features"]["bathrooms"] == 2.5
