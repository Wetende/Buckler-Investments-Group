import pytest
from unittest.mock import AsyncMock
from datetime import datetime

from app.application.use_cases.cars.search_vehicles import SearchVehiclesUseCase
from app.application.dto.cars import SearchVehiclesRequest, VehicleResponse
from app.domain.entities.cars import Vehicle
from app.domain.value_objects.money import Money

@pytest.fixture
def mock_vehicle_repository():
    return AsyncMock()

@pytest.mark.asyncio
async def test_search_vehicles_returns_all_when_no_max_price(mock_vehicle_repository):
    # Arrange
    use_case = SearchVehiclesUseCase(mock_vehicle_repository)
    
    vehicles = [
        Vehicle(id=1, make="Toyota", model="Corolla", year=2022, daily_rate=Money(5000, "KES"), owner_id=1, features={}),
        Vehicle(id=2, make="Honda", model="Civic", year=2021, daily_rate=Money(6000, "KES"), owner_id=1, features={})
    ]
    mock_vehicle_repository.search_available.return_value = vehicles
    
    request = SearchVehiclesRequest(start_date=datetime.now(), end_date=datetime.now())

    # Act
    result = await use_case.execute(request)

    # Assert
    assert len(result) == 2
    assert isinstance(result[0], VehicleResponse)
    assert result[0].make == "Toyota"
    mock_vehicle_repository.search_available.assert_called_once_with(
        start_date=request.start_date,
        end_date=request.end_date
    )

@pytest.mark.asyncio
async def test_search_vehicles_filters_by_max_price(mock_vehicle_repository):
    # Arrange
    use_case = SearchVehiclesUseCase(mock_vehicle_repository)
    
    vehicles = [
        Vehicle(id=1, make="Toyota", model="Corolla", year=2022, daily_rate=Money(5000, "KES"), owner_id=1, features={}),
        Vehicle(id=2, make="Honda", model="Civic", year=2021, daily_rate=Money(6000, "KES"), owner_id=1, features={})
    ]
    mock_vehicle_repository.search_available.return_value = vehicles
    
    request = SearchVehiclesRequest(start_date=datetime.now(), end_date=datetime.now(), max_price=5500)

    # Act
    result = await use_case.execute(request)

    # Assert
    assert len(result) == 1
    assert result[0].id == 1
    assert result[0].make == "Toyota"
    mock_vehicle_repository.search_available.assert_called_once_with(
        start_date=request.start_date,
        end_date=request.end_date
    )
