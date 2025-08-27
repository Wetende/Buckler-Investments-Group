import pytest
from datetime import datetime, timedelta

from domain.entities.cars import Vehicle
from domain.value_objects.money import Money

@pytest.mark.asyncio
async def test_search_vehicles_api(client):
    # Arrange
    vehicles = [
        Vehicle(id=1, make="Toyota", model="Corolla", year=2022, daily_rate=Money(5000, "KES"), owner_id=1, features={}, created_at=datetime.now(), updated_at=datetime.now()),
    ]
    client.mock_vehicle_repo.search_available.return_value = vehicles

    # Act
    response = client.post("/api/v1/cars/search", json={
        "start_date": datetime.now().isoformat(),
        "end_date": (datetime.now() + timedelta(days=5)).isoformat()
    })

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["make"] == "Toyota"

@pytest.mark.asyncio
async def test_create_rental_api(client):
    # Arrange
    vehicle = Vehicle(id=1, make="Toyota", model="Corolla", year=2022, daily_rate=Money(5000, "KES"), owner_id=1, features={}, created_at=datetime.now(), updated_at=datetime.now())
    client.mock_vehicle_repo.get_by_id.return_value = vehicle
    client.mock_rental_repo.create.side_effect = lambda rental: rental

    # Act
    response = client.post("/api/v1/cars/rentals", json={
        "vehicle_id": 1,
        "renter_id": 1,
        "pickup_date": datetime.now().isoformat(),
        "return_date": (datetime.now() + timedelta(days=3)).isoformat()
    })

    # Assert
    assert response.status_code == 201
    data = response.json()
    assert data["vehicle_id"] == 1
    assert data["status"] == "CONFIRMED"
    assert data["total_cost"]["amount"] == 15000

@pytest.mark.asyncio
async def test_create_rental_vehicle_not_found_api(client):
    # Arrange
    client.mock_vehicle_repo.get_by_id.return_value = None

    # Act
    response = client.post("/api/v1/cars/rentals", json={
        "vehicle_id": 999,
        "renter_id": 1,
        "pickup_date": datetime.now().isoformat(),
        "return_date": (datetime.now() + timedelta(days=3)).isoformat()
    })

    # Assert
    assert response.status_code == 404
    assert response.json()["detail"] == "Vehicle not found."
