"""
Comprehensive API tests for ALL Tours endpoints.
Tests cover all 29 endpoints across tour management and booking operations.
"""
import pytest
from decimal import Decimal
from datetime import date, datetime

from app.domain.entities.tours import Tour, TourBooking
from app.domain.value_objects.money import Money


# ============================================================================
# TOUR MANAGEMENT TESTS (12 endpoints)
# ============================================================================

@pytest.mark.asyncio
async def test_search_tours_endpoint(client):
    """POST /search - Search tours based on criteria"""
    # Arrange
    tour = Tour(
        id=1,
        name="Safari Adventure",
        description="Amazing wildlife safari",
        price=Money(Decimal("15000"), "KES"),
        duration_hours=8,
        operator_id=1,
        max_participants=10,
        included_services={"guide": True, "lunch": True},
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    client.mock_tour_repo.search_by_location_and_date.return_value = [tour]

    # Act
    payload = {
        "location": "Maasai Mara",
        "start_date": date.today().isoformat(),
        "max_price": 20000
    }
    response = client.post("/api/v1/tours/search", json=payload)

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Safari Adventure"


@pytest.mark.asyncio
async def test_list_all_tours_endpoint(client):
    """GET / - List all tours with pagination"""
    # Arrange
    tours = [
        Tour(
            id=1,
            name="City Tour",
            description="Urban exploration",
            price=Money(Decimal("5000"), "KES"),
            duration_hours=4,
            operator_id=1,
            max_participants=15,
            included_services={},
            created_at=datetime.now(),
            updated_at=datetime.now(),
        ),
        Tour(
            id=2,
            name="Beach Tour",
            description="Coastal adventure",
            price=Money(Decimal("8000"), "KES"),
            duration_hours=6,
            operator_id=2,
            max_participants=12,
            included_services={"transport": True},
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )
    ]
    client.mock_tour_repo.list.return_value = tours

    # Act
    response = client.get("/api/v1/tours/")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["name"] == "City Tour"
    assert data[1]["name"] == "Beach Tour"


@pytest.mark.asyncio
async def test_get_tour_details_endpoint(client):
    """GET /{tour_id} - Get detailed tour information"""
    # Arrange
    tour = Tour(
        id=42,
        name="Mountain Hiking",
        description="Scenic mountain trail",
        price=Money(Decimal("12000"), "KES"),
        duration_hours=10,
        operator_id=3,
        max_participants=8,
        included_services={"equipment": True, "guide": True},
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
    assert data["name"] == "Mountain Hiking"
    assert data["duration_hours"] == 10


@pytest.mark.asyncio
async def test_get_tour_availability_endpoint(client):
    """GET /{tour_id}/availability - Get tour availability for date range"""
    # Arrange
    tour = Tour(
        id=10,
        name="Wildlife Safari",
        description="Big 5 safari",
        price=Money(Decimal("25000"), "KES"),
        duration_hours=12,
        operator_id=1,
        max_participants=6,
        included_services={},
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    client.mock_tour_repo.get_by_id.return_value = tour

    # Act
    response = client.get(
        "/api/v1/tours/10/availability",
        params={
            "start_date": date.today().isoformat(),
            "end_date": date.today().isoformat()
        }
    )

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


@pytest.mark.asyncio
async def test_get_featured_tours_endpoint(client):
    """GET /featured - Get featured tours"""
    # Arrange
    client.mock_tour_repo.list.return_value = []

    # Act
    response = client.get("/api/v1/tours/featured")

    # Assert
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_get_tour_categories_endpoint(client):
    """GET /categories - Get tour categories"""
    # Act
    response = client.get("/api/v1/tours/categories")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "Wildlife Safari" in [cat["name"] for cat in data]


@pytest.mark.asyncio
async def test_get_tours_by_category_endpoint(client):
    """GET /categories/{category}/tours - Get tours by category"""
    # Arrange
    client.mock_tour_repo.list.return_value = []

    # Act
    response = client.get("/api/v1/tours/categories/Adventure/tours")

    # Assert
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_create_or_update_tour_endpoint(client):
    """POST / - Create new tour (id=0) or update existing tour (id>0)"""
    # Arrange
    def create_side_effect(entity: Tour):
        entity.id = 123
        return entity

    client.mock_tour_repo.create.side_effect = create_side_effect

    # Act - Create new tour
    payload = {
        "id": 0,
        "name": "Cultural Heritage Tour",
        "description": "Explore local culture and traditions",
        "price": 18000,
        "currency": "KES",
        "duration_hours": 7,
        "max_participants": 20,
        "included_services": {"guide": True, "cultural_show": True},
        "operator_id": 1
    }
    response = client.post("/api/v1/tours/", json=payload)

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 123
    assert data["name"] == "Cultural Heritage Tour"
    assert data["currency"] == "KES"


@pytest.mark.asyncio
async def test_delete_tour_endpoint(client):
    """GET /{tour_id}/delete - Delete a tour"""
    # Arrange
    client.mock_tour_repo.delete.return_value = None

    # Act
    response = client.get("/api/v1/tours/15/delete")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True
    assert data["tour_id"] == 15


@pytest.mark.asyncio
async def test_get_my_tours_endpoint(client):
    """GET /my-tours - Get all tours for authenticated operator"""
    # Arrange
    client.mock_tour_repo.list.return_value = []

    # Act
    response = client.get("/api/v1/tours/my-tours", params={"operator_id": 1})

    # Assert
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_update_tour_availability_endpoint(client):
    """POST /{tour_id}/availability - Update tour availability"""
    # Act
    payload = {
        "tour_id": 20,
        "items": [
            {
                "date": date.today().isoformat(),
                "available_spots": 5,
                "price_override": None
            }
        ]
    }
    response = client.post("/api/v1/tours/20/availability", json=payload)

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True


@pytest.mark.asyncio
async def test_update_tour_pricing_endpoint(client):
    """POST /{tour_id}/pricing - Update tour pricing"""
    # Act
    response = client.post("/api/v1/tours/25/pricing", json={})

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True


# ============================================================================
# TOUR BOOKING TESTS (17 endpoints)
# ============================================================================

@pytest.mark.asyncio
async def test_create_tour_booking_endpoint(client):
    """POST /bookings - Create a new tour booking"""
    # Arrange
    tour = Tour(
        id=5,
        name="Lake Nakuru Tour",
        description="Flamingo watching",
        price=Money(Decimal("8000"), "KES"),
        duration_hours=6,
        operator_id=1,
        max_participants=15,
        included_services={},
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    client.mock_tour_repo.get_by_id.return_value = tour

    def create_booking_side_effect(entity: TourBooking):
        entity.id = 501
        return entity

    client.mock_tour_booking_repo.create.side_effect = create_booking_side_effect

    # Act
    payload = {
        "tour_id": 5,
        "customer_id": 101,
        "booking_date": date.today().isoformat(),
        "participants": 3
    }
    response = client.post("/api/v1/tours/bookings", json=payload)

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 501
    assert data["tour_id"] == 5


@pytest.mark.asyncio
async def test_get_tour_booking_details_endpoint(client):
    """GET /bookings/{booking_id} - Get detailed booking information"""
    # Arrange
    booking = TourBooking(
        id=75,
        tour_id=5,
        customer_id=101,
        booking_date=date.today(),
        participants=3,
        total_price=Money(Decimal("24000"), "KES"),
        status="CONFIRMED",
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    client.mock_tour_booking_repo.get_by_id.return_value = booking

    # Act
    response = client.get("/api/v1/tours/bookings/75")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 75
    assert data["participants"] == 3
    assert data["status"] == "CONFIRMED"


@pytest.mark.asyncio
async def test_get_my_tour_bookings_endpoint(client):
    """GET /my-bookings - Get all tour bookings for authenticated user"""
    # Arrange
    client.mock_tour_booking_repo.get_by_customer.return_value = []

    # Act
    response = client.get("/api/v1/tours/my-bookings", params={"customer_id": 1})

    # Assert
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_cancel_tour_booking_post_endpoint(client):
    """POST /bookings/{booking_id}/cancel - Cancel booking (POST method)"""
    # Act
    response = client.post("/api/v1/tours/bookings/80/cancel")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True


@pytest.mark.asyncio
async def test_cancel_tour_booking_get_endpoint(client):
    """GET /bookings/{booking_id}/cancel - Cancel booking (GET method)"""
    # Act
    response = client.get("/api/v1/tours/bookings/80/cancel")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True


@pytest.mark.asyncio
async def test_get_operator_tour_bookings_endpoint(client):
    """GET /operator/bookings - Get all bookings for operator's tours"""
    # Act
    response = client.get("/api/v1/tours/operator/bookings", params={"operator_id": 1})

    # Assert
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_confirm_tour_booking_endpoint(client):
    """POST /bookings/{booking_id}/confirm - Confirm a tour booking"""
    # Act
    response = client.post("/api/v1/tours/bookings/85/confirm")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True


@pytest.mark.asyncio
async def test_complete_tour_booking_endpoint(client):
    """POST /bookings/{booking_id}/complete - Mark tour as completed"""
    # Act
    response = client.post("/api/v1/tours/bookings/90/complete")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True


@pytest.mark.asyncio
async def test_process_tour_payment_endpoint(client):
    """POST /bookings/{booking_id}/payment - Process payment for booking"""
    # Act
    response = client.post("/api/v1/tours/bookings/95/payment", json={})

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True
    assert "payment_id" in data


@pytest.mark.asyncio
async def test_get_tour_payment_status_endpoint(client):
    """GET /bookings/{booking_id}/payment-status - Check payment status"""
    # Act
    response = client.get("/api/v1/tours/bookings/95/payment-status")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert "payment_status" in data


@pytest.mark.asyncio
async def test_process_tour_refund_endpoint(client):
    """POST /bookings/{booking_id}/refund - Process refund for booking"""
    # Act
    response = client.post("/api/v1/tours/bookings/100/refund", json={})

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True


@pytest.mark.asyncio
async def test_send_tour_message_endpoint(client):
    """POST /bookings/{booking_id}/messages - Send message about booking"""
    # Act
    response = client.post("/api/v1/tours/bookings/105/messages", json={})

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True


@pytest.mark.asyncio
async def test_get_tour_booking_messages_endpoint(client):
    """GET /bookings/{booking_id}/messages - Get all messages for booking"""
    # Act
    response = client.get("/api/v1/tours/bookings/105/messages")

    # Assert
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_get_tour_conversations_endpoint(client):
    """GET /conversations - Get all tour conversations for user"""
    # Act
    response = client.get("/api/v1/tours/conversations", params={"user_id": 1})

    # Assert
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_get_operator_dashboard_endpoint(client):
    """GET /operator/dashboard - Get operator dashboard statistics"""
    # Act
    response = client.get("/api/v1/tours/operator/dashboard", params={"operator_id": 1})

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert "total_tours" in data
    assert "active_bookings" in data
    assert "total_revenue" in data


@pytest.mark.asyncio
async def test_get_operator_earnings_endpoint(client):
    """GET /operator/earnings - Get operator earnings summary"""
    # Act
    response = client.get("/api/v1/tours/operator/earnings", params={"operator_id": 1})

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert "total_earnings" in data
    assert "pending_payouts" in data


@pytest.mark.asyncio
async def test_get_operator_payouts_endpoint(client):
    """GET /operator/payouts - Get operator payout history"""
    # Act
    response = client.get("/api/v1/tours/operator/payouts", params={"operator_id": 1})

    # Assert
    assert response.status_code == 200
    assert isinstance(response.json(), list)
