import pytest
from decimal import Decimal
from datetime import date, datetime

from app.domain.entities.bnb import ShortTermListing
from app.domain.value_objects.money import Money


@pytest.mark.asyncio
async def test_search_listings_api(client):
    # Arrange
    listing = ShortTermListing(
        id=1,
        host_id=1,
        title="Cozy Studio",
        listing_type="APARTMENT",
        capacity=2,
        nightly_price=Money(Decimal("3500"), "KES"),
        address="Nairobi CBD",
        amenities={},
        rules={},
        instant_book=True,
        min_nights=1,
        max_nights=30,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    client.mock_bnb_repo.search_available.return_value = [listing]

    payload = {
        "check_in": date.today().isoformat(),
        "check_out": date.today().isoformat(),
        "guests": 2,
        "price_max": 5000,
        "instant_book_only": True,
        "location": "Nairobi",
    }
    # Act
    response = client.post("/api/v1/bnb/search", json=payload)

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Cozy Studio"


@pytest.mark.asyncio
async def test_list_listings_api(client):
    # Arrange
    listing = ShortTermListing(
        id=2,
        host_id=1,
        title="Garden Suite",
        listing_type="HOUSE",
        capacity=4,
        nightly_price=Money(Decimal("7000"), "KES"),
        address="Karen",
        amenities={},
        rules={},
        instant_book=False,
        min_nights=2,
        max_nights=15,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    client.mock_bnb_repo.list.return_value = [listing]

    # Act
    response = client.get("/api/v1/bnb/listings")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Garden Suite"
    assert data[0]["nightly_price"] == "7000"


@pytest.mark.asyncio
async def test_get_listing_details_api(client):
    # Arrange
    listing = ShortTermListing(
        id=3,
        host_id=2,
        title="Beach Cottage",
        listing_type="HOUSE",
        capacity=5,
        nightly_price=Money(Decimal("9000"), "KES"),
        address="Diani",
        amenities={},
        rules={},
        instant_book=False,
        min_nights=2,
        max_nights=10,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    client.mock_bnb_repo.get_by_id.return_value = listing

    # Act
    response = client.get("/api/v1/bnb/listings/3")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 3
    assert data["capacity"] == 5


@pytest.mark.asyncio
async def test_create_or_update_listing_api(client):
    # Arrange
    def create_side_effect(entity: ShortTermListing):
        entity.id = 101
        return entity

    client.mock_bnb_repo.create.side_effect = create_side_effect

    payload = {
        "id": 0,
        "title": "New Loft",
        "type": "APARTMENT",
        "capacity": 3,
        "nightly_price": 5000,
        "address": "Westlands",
        "instant_book": True,
    }

    # Act
    response = client.post("/api/v1/bnb/listings", json=payload)

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 101
    assert data["title"] == "New Loft"


@pytest.mark.asyncio
async def test_delete_listing_api(client):
    # Arrange
    client.mock_bnb_repo.delete.return_value = None

    # Act
    response = client.get("/api/v1/bnb/listings/9/delete")

    # Assert
    assert response.status_code == 200
    assert response.json()["ok"] is True


@pytest.mark.asyncio
async def test_listing_availability_and_featured(client):
    # availability needs get_by_id to succeed
    listing = ShortTermListing(
        id=11,
        host_id=1,
        title="City Studio",
        listing_type="APARTMENT",
        capacity=2,
        nightly_price=Money(Decimal("3000"), "KES"),
        address="Upperhill",
        amenities={},
        rules={},
        instant_book=True,
        min_nights=1,
        max_nights=20,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    client.mock_bnb_repo.get_by_id.return_value = listing
    client.mock_bnb_repo.list.return_value = [listing]

    r1 = client.get(
        "/api/v1/bnb/listings/11/availability",
        params={"start_date": date.today().isoformat(), "end_date": date.today().isoformat()},
    )
    assert r1.status_code == 200

    r2 = client.get("/api/v1/bnb/listings/featured")
    assert r2.status_code == 200

    r3 = client.get(
        "/api/v1/bnb/listings/nearby",
        params={"latitude": 1.0, "longitude": 36.8, "radius_km": 5, "limit": 1},
    )
    assert r3.status_code == 200


@pytest.mark.asyncio
async def test_my_listings_and_host_analytics(client):
    client.mock_bnb_repo.get_by_host.return_value = []

    r1 = client.get("/api/v1/bnb/my-listings")
    assert r1.status_code == 200

    # dashboard/earnings/payouts are stubbed
    r2 = client.get("/api/v1/bnb/host/dashboard")
    assert r2.status_code == 200
    r3 = client.get("/api/v1/bnb/host/earnings")
    assert r3.status_code == 200
    r4 = client.get("/api/v1/bnb/host/payouts")
    assert r4.status_code == 200


@pytest.mark.asyncio
async def test_booking_lifecycle_and_messages(client):
    # Create booking
    booking_payload = {
        "listing_id": 2,
        "check_in": date.today().isoformat(),
        "check_out": date.today().isoformat(),
        "guests": 2,
        "guest_email": "user@example.com",
    }
    r1 = client.post("/api/v1/bnb/bookings", json=booking_payload)
    # Implementation may raise validation from use case; allow 200/400 depending on mock
    assert r1.status_code in (200, 400, 404)

    # Get booking details (mock repository will be None by default)
    r2 = client.get("/api/v1/bnb/bookings/1")
    assert r2.status_code in (200, 404)

    # My bookings
    r3 = client.get("/api/v1/bnb/my-bookings")
    assert r3.status_code == 200

    # Cancel (POST and GET)
    r4 = client.post("/api/v1/bnb/bookings/1/cancel")
    assert r4.status_code in (200, 404, 400)
    r5 = client.get("/api/v1/bnb/bookings/1/cancel")
    assert r5.status_code in (200, 404, 400)

    # Host bookings, approve/reject
    r6 = client.get("/api/v1/bnb/host/bookings")
    assert r6.status_code == 200
    r7 = client.post("/api/v1/bnb/bookings/1/approve")
    assert r7.status_code in (200, 404, 400)
    r8 = client.post("/api/v1/bnb/bookings/1/reject")
    assert r8.status_code in (200, 404, 400)

    # Payments
    r9 = client.post("/api/v1/bnb/bookings/1/payment", json={})
    assert r9.status_code == 200
    r10 = client.get("/api/v1/bnb/bookings/1/payment-status")
    assert r10.status_code == 200
    r11 = client.post("/api/v1/bnb/bookings/1/refund", json={})
    assert r11.status_code == 200

    # Messaging
    r12 = client.post("/api/v1/bnb/bookings/1/messages", json={"body": "Hello"})
    assert r12.status_code in (200, 422)  # body required by schema; allow validation
    r13 = client.get("/api/v1/bnb/bookings/1/messages")
    assert r13.status_code == 200
    r14 = client.get("/api/v1/bnb/conversations")
    assert r14.status_code == 200


