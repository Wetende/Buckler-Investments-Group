import pytest
from decimal import Decimal
from datetime import date, datetime

from app.domain.entities.tours import Tour, TourBooking
from app.domain.value_objects.money import Money


@pytest.mark.asyncio
async def test_list_tours_api(client):
    # Arrange
    tour = Tour(
        id=1,
        name="Safari",
        description="A great tour",
        price=Money(Decimal("10000"), "KES"),
        duration_hours=8,
        operator_id=1,
        max_participants=10,
        included_services={"guide": True},
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    client.mock_tour_repo.list.return_value = [tour]

    # Act
    response = client.get("/api/v1/tours/")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Safari"
    assert data[0]["price"] == "10000"


@pytest.mark.asyncio
async def test_create_tour_api(client):
    # Arrange
    def create_side_effect(entity: Tour):
        entity.id = 123
        return entity

    client.mock_tour_repo.create.side_effect = create_side_effect

    # Act
    payload = {
        "id": 0,
        "name": "Maasai Mara",
        "description": "2-day safari",
        "price": 15000,
        "currency": "KES",
        "duration_hours": 8,
        "max_participants": 10,
        "included_services": {"meals": True, "guide": True},
        "operator_id": 1,
    }
    response = client.post("/api/v1/tours/", json=payload)

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 123
    assert data["name"] == "Maasai Mara"
    assert data["currency"] == "KES"


@pytest.mark.asyncio
async def test_get_tour_details_api(client):
    # Arrange
    tour = Tour(
        id=42,
        name="Amboseli",
        description="Elephants",
        price=Money(Decimal("20000"), "KES"),
        duration_hours=6,
        operator_id=1,
        max_participants=8,
        included_services={"pickup": True},
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    client.mock_tour_repo.get_by_id.return_value = tour

    # Act
    response = client.get("/api/v1/tours/42")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 42
    assert data["duration_hours"] == 6


@pytest.mark.asyncio
async def test_create_tour_booking_api(client):
    # Arrange
    tour = Tour(
        id=10,
        name="Nakuru",
        description="Flamingos",
        price=Money(Decimal("5000"), "KES"),
        duration_hours=4,
        operator_id=1,
        max_participants=12,
        included_services={},
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    client.mock_tour_repo.get_by_id.return_value = tour

    def create_booking_side_effect(entity: TourBooking):
        entity.id = 999
        return entity

    client.mock_tour_booking_repo.create.side_effect = create_booking_side_effect

    # Act
    payload = {
        "tour_id": 10,
        "customer_id": 1,
        "booking_date": date.today().isoformat(),
        "participants": 2,
    }
    response = client.post("/api/v1/tours/bookings", json=payload)

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 999
    assert data["tour_id"] == 10
    assert data["total_price"] == "10000"


@pytest.mark.asyncio
async def test_search_tours_api(client):
    # Arrange
    tour = Tour(
        id=2,
        name="Beach Ride",
        description="Coastal tour",
        price=Money(Decimal("7500"), "KES"),
        duration_hours=3,
        operator_id=1,
        max_participants=6,
        included_services={},
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    client.mock_tour_repo.search_by_location_and_date.return_value = [tour]

    # Act
    payload = {"location": "Mombasa", "start_date": date.today().isoformat(), "max_price": 10000}
    response = client.post("/api/v1/tours/search", json=payload)

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Beach Ride"


@pytest.mark.asyncio
async def test_delete_tour_api(client):
    # Arrange
    client.mock_tour_repo.delete.return_value = None

    # Act
    response = client.get("/api/v1/tours/7/delete")

    # Assert
    assert response.status_code == 200
    assert response.json()["ok"] is True


@pytest.mark.asyncio
async def test_get_tour_booking_details_api(client):
    # Arrange
    booking = TourBooking(
        id=55,
        tour_id=10,
        customer_id=1,
        booking_date=date.today(),
        participants=2,
        total_price=Money(Decimal("10000"), "KES"),
        status="CONFIRMED",
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    client.mock_tour_booking_repo.get_by_id.return_value = booking

    # Act
    response = client.get("/api/v1/tours/bookings/55")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 55
    assert data["total_price"] == "10000"


@pytest.mark.asyncio
async def test_my_tour_bookings_and_operator_endpoints(client):
    # Minimal sanity against wiring/unimplemented responses
    # my-bookings
    client.mock_tour_booking_repo.get_by_customer.return_value = []
    r1 = client.get("/api/v1/tours/my-bookings")
    assert r1.status_code == 200

    # operator aggregations return mocked empties
    r2 = client.get("/api/v1/tours/operator/bookings")
    assert r2.status_code == 200
    r3 = client.get("/api/v1/tours/operator/dashboard")
    assert r3.status_code == 200
    r4 = client.get("/api/v1/tours/operator/earnings")
    assert r4.status_code == 200
    r5 = client.get("/api/v1/tours/operator/payouts")
    assert r5.status_code == 200


@pytest.mark.asyncio
async def test_tour_misc_endpoints(client):
    # categories and featured
    r1 = client.get("/api/v1/tours/categories")
    assert r1.status_code == 200
    r2 = client.get("/api/v1/tours/featured")
    assert r2.status_code == 200
    r2b = client.get("/api/v1/tours/categories/Adventure/tours")
    assert r2b.status_code == 200

    # availability mock
    tour = Tour(
        id=11,
        name="City Tour",
        description="CBD walk",
        price=Money(Decimal("2000"), "KES"),
        duration_hours=2,
        operator_id=1,
        max_participants=15,
        included_services={},
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    client.mock_tour_repo.get_by_id.return_value = tour
    r3 = client.get(
        "/api/v1/tours/11/availability",
        params={"start_date": date.today().isoformat(), "end_date": date.today().isoformat()},
    )
    assert r3.status_code == 200

    # pricing/availability POST placeholders
    r4 = client.post("/api/v1/tours/11/availability", json={"tour_id": 11, "items": []})
    assert r4.status_code == 200
    r5 = client.post("/api/v1/tours/11/pricing", json={})
    assert r5.status_code == 200
    r5b = client.get("/api/v1/tours/my-tours")
    assert r5b.status_code == 200

    # booking lifecycle stub endpoints
    r6 = client.post("/api/v1/tours/bookings/55/cancel")
    assert r6.status_code == 200
    r7 = client.get("/api/v1/tours/bookings/55/cancel")
    assert r7.status_code == 200
    r8 = client.post("/api/v1/tours/bookings/55/confirm")
    assert r8.status_code == 200
    r9 = client.post("/api/v1/tours/bookings/55/complete")
    assert r9.status_code == 200

    # payments stubs
    r10 = client.post("/api/v1/tours/bookings/55/payment", json={})
    assert r10.status_code == 200
    r11 = client.get("/api/v1/tours/bookings/55/payment-status")
    assert r11.status_code == 200
    r12 = client.post("/api/v1/tours/bookings/55/refund", json={})
    assert r12.status_code == 200

    # messaging stubs
    r13 = client.post("/api/v1/tours/bookings/55/messages", json={})
    assert r13.status_code == 200
    r14 = client.get("/api/v1/tours/bookings/55/messages")
    assert r14.status_code == 200
    r15 = client.get("/api/v1/tours/conversations")
    assert r15.status_code == 200


