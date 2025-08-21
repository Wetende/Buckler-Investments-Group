import pytest
from unittest.mock import AsyncMock
from fastapi.testclient import TestClient

from app.main import app
from app.containers import AppContainer

@pytest.fixture(scope="module")
def client():
    container = AppContainer()
    
    # Mock repositories
    mock_vehicle_repo = AsyncMock()
    mock_rental_repo = AsyncMock()
    mock_property_repo = AsyncMock()
    mock_investment_repo = AsyncMock()
    mock_holding_repo = AsyncMock()
    
    with container.vehicle_repository.override(mock_vehicle_repo), \
         container.car_rental_repository.override(mock_rental_repo), \
         container.property_repository.override(mock_property_repo), \
         container.investment_repository.override(mock_investment_repo), \
         container.investment_holding_repository.override(mock_holding_repo):
        
        test_client = TestClient(app)
        # Add mocks to the client instance to allow access in tests
        test_client.mock_vehicle_repo = mock_vehicle_repo
        test_client.mock_rental_repo = mock_rental_repo
        test_client.mock_property_repo = mock_property_repo
        test_client.mock_investment_repo = mock_investment_repo
        test_client.mock_holding_repo = mock_holding_repo
        yield test_client
