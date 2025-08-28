import pytest
from unittest.mock import AsyncMock, MagicMock
from datetime import datetime, timedelta

from application.use_cases.cars.create_rental import CreateRentalUseCase
from application.dto.cars import CreateRentalRequest
from domain.entities.cars import Vehicle, CarRental
from domain.value_objects.money import Money
from shared.exceptions.cars import VehicleNotFoundError

@pytest.fixture
def mock_vehicle_repository():
    return AsyncMock()

@pytest.fixture
def mock_car_rental_repository():
    return AsyncMock()

@pytest.mark.asyncio
async def test_create_rental_success(mock_vehicle_repository, mock_car_rental_repository):
    # Arrange
    use_case = CreateRentalUseCase(mock_vehicle_repository, mock_car_rental_repository)
    
    vehicle = Vehicle(
        id=1,
        created_at=datetime.now(),
        updated_at=datetime.now(),
        make="Toyota",
        model="Corolla",
        year=2022,
        daily_rate=Money(5000, "KES"),
        owner_id=1,
        features={}
    )
    mock_vehicle_repository.get_by_id.return_value = vehicle
    
    # Mock the return value of the create method
    mock_car_rental_repository.create.side_effect = lambda rental: rental

    request = CreateRentalRequest(
        vehicle_id=1,
        renter_id=1,
        pickup_date=datetime.now(),
        return_date=datetime.now() + timedelta(days=3)
    )

    # Act
    result = await use_case.execute(request)

    # Assert
    assert result.vehicle_id == 1
    assert result.status == "CONFIRMED"
    assert result.total_cost.amount == 15000
    mock_vehicle_repository.get_by_id.assert_called_once_with(1)
    mock_car_rental_repository.create.assert_called_once()

@pytest.mark.asyncio
async def test_create_rental_vehicle_not_found(mock_vehicle_repository, mock_car_rental_repository):
    # Arrange
    use_case = CreateRentalUseCase(mock_vehicle_repository, mock_car_rental_repository)
    mock_vehicle_repository.get_by_id.return_value = None
    
    request = CreateRentalRequest(
        vehicle_id=999,
        renter_id=1,
        pickup_date=datetime.now(),
        return_date=datetime.now() + timedelta(days=3)
    )

    # Act & Assert
    with pytest.raises(VehicleNotFoundError):
        await use_case.execute(request)
    
    mock_vehicle_repository.get_by_id.assert_called_once_with(999)
    mock_car_rental_repository.create.assert_not_called()
