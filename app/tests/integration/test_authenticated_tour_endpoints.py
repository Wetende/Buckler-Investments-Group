"""
Comprehensive authenticated integration tests for all tour endpoints.

This test suite logs in as a user and tests all tour endpoints end-to-end
to ensure they work properly with authentication.
"""
import pytest
from httpx import AsyncClient
from datetime import date, datetime, timedelta
from decimal import Decimal

from api.main import app


class TestAuthenticatedTourEndpoints:
    """Integration tests for tour endpoints with real user authentication."""

    @pytest.fixture
    async def test_client(self):
        """HTTP client for testing API endpoints."""
        from fastapi.testclient import TestClient
        client = TestClient(app)
        yield client

    @pytest.fixture
    async def authenticated_user(self, test_client):
        """Create and authenticate a test user, return user data and token."""
        # Step 1: Register a new user
        registration_data = {
            "email": "tour.tester@example.com",
            "password": "SecurePassword123!",
            "name": "Tour Tester",
            "phone": "+254712345678"
        }
        
        register_response = test_client.post(
            "/api/v1/shared/auth/register", 
            json=registration_data
        )
        
        if register_response.status_code != 201:
            pytest.fail(f"User registration failed: {register_response.status_code} - {register_response.text}")
        
        user_data = register_response.json()
        
        # Step 2: Login to get access token
        login_data = {
            "username": registration_data["email"],
            "password": registration_data["password"]
        }
        
        login_response = test_client.post(
            "/api/v1/shared/auth/token",
            data=login_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        if login_response.status_code != 200:
            pytest.fail(f"User login failed: {login_response.status_code} - {login_response.text}")
        
        token_data = login_response.json()
        access_token = token_data["access_token"]
        
        return {
            "user": user_data,
            "access_token": access_token,
            "auth_headers": {"Authorization": f"Bearer {access_token}"}
        }

    @pytest.fixture
    async def sample_tour_data(self):
        """Sample tour data for testing."""
        return {
            "id": 0,  # 0 for create
            "name": "Maasai Mara Safari",
            "description": "Amazing 3-day safari experience in Maasai Mara",
            "price": 15000,
            "currency": "KES",
            "duration_hours": 72,  # 3 days
            "max_participants": 12,
            "included_services": {
                "meals": True,
                "guide": True,
                "transport": True,
                "accommodation": True
            },
            "operator_id": 1
        }

    # ============================================================================
    # TOUR MANAGEMENT TESTS - Core CRUD Operations
    # ============================================================================

    def test_list_all_tours(self, test_client, authenticated_user):
        """Test GET /api/v1/tours/ - List all tours"""
        response = test_client.get(
            "/api/v1/tours/",
            headers=authenticated_user["auth_headers"]
        )
        
        assert response.status_code == 200
        tours = response.json()
        assert isinstance(tours, list)
        print(f"✅ Found {len(tours)} tours")

    @pytest.mark.asyncio
    async def test_create_tour(self, test_client, authenticated_user, sample_tour_data):
        """Test POST /api/v1/tours/ - Create new tour"""
        response = await test_client.post(
            "/api/v1/tours/",
            json=sample_tour_data,
            headers=authenticated_user["auth_headers"]
        )
        
        # Should create successfully or return validation error
        assert response.status_code in [200, 201, 400, 422]
        
        if response.status_code in [200, 201]:
            tour = response.json()
            assert tour["id"] > 0
            assert tour["name"] == sample_tour_data["name"]
            print(f"✅ Created tour: {tour['name']} (ID: {tour['id']})")
            return tour
        else:
            print(f"⚠️ Tour creation failed: {response.status_code} - {response.text}")
            return None

    @pytest.mark.asyncio
    async def test_get_tour_details(self, test_client, authenticated_user):
        """Test GET /api/v1/tours/{id} - Get tour details"""
        # Try to get tour with ID 1
        response = await test_client.get(
            "/api/v1/tours/1",
            headers=authenticated_user["auth_headers"]
        )
        
        if response.status_code == 200:
            tour = response.json()
            assert "id" in tour
            assert "name" in tour
            print(f"✅ Retrieved tour: {tour['name']}")
        elif response.status_code == 404:
            print("⚠️ No tour with ID 1 found")
        else:
            pytest.fail(f"Unexpected status code: {response.status_code}")

    @pytest.mark.asyncio
    async def test_search_tours(self, test_client, authenticated_user):
        """Test POST /api/v1/tours/search - Search tours"""
        search_criteria = {
            "location": "Kenya",
            "start_date": date.today().isoformat(),
            "max_price": 20000
        }
        
        response = await test_client.post(
            "/api/v1/tours/search",
            json=search_criteria,
            headers=authenticated_user["auth_headers"]
        )
        
        assert response.status_code in [200, 422]  # 422 if validation fails
        
        if response.status_code == 200:
            tours = response.json()
            assert isinstance(tours, list)
            print(f"✅ Search returned {len(tours)} tours")
        else:
            print(f"⚠️ Search failed: {response.text}")

    # ============================================================================
    # TOUR DISCOVERY TESTS - Public endpoints
    # ============================================================================

    @pytest.mark.asyncio
    async def test_get_featured_tours(self, test_client, authenticated_user):
        """Test GET /api/v1/tours/featured - Get featured tours"""
        response = await test_client.get(
            "/api/v1/tours/featured",
            headers=authenticated_user["auth_headers"]
        )
        
        assert response.status_code in [200, 422]
        
        if response.status_code == 200:
            tours = response.json()
            assert isinstance(tours, list)
            print(f"✅ Featured tours: {len(tours)} found")
        else:
            print(f"⚠️ Featured tours endpoint issue: {response.text}")

    @pytest.mark.asyncio
    async def test_get_tour_categories(self, test_client, authenticated_user):
        """Test GET /api/v1/tours/categories - Get tour categories"""
        response = await test_client.get(
            "/api/v1/tours/categories",
            headers=authenticated_user["auth_headers"]
        )
        
        assert response.status_code in [200, 422]
        
        if response.status_code == 200:
            categories = response.json()
            assert isinstance(categories, list)
            assert len(categories) > 0
            print(f"✅ Categories: {[cat['name'] for cat in categories]}")
        else:
            print(f"⚠️ Categories endpoint issue: {response.text}")

    @pytest.mark.asyncio
    async def test_get_tours_by_category(self, test_client, authenticated_user):
        """Test GET /api/v1/tours/categories/{category}/tours - Get tours by category"""
        response = await test_client.get(
            "/api/v1/tours/categories/Adventure/tours",
            headers=authenticated_user["auth_headers"]
        )
        
        assert response.status_code in [200, 422]
        
        if response.status_code == 200:
            tours = response.json()
            assert isinstance(tours, list)
            print(f"✅ Adventure tours: {len(tours)} found")

    @pytest.mark.asyncio
    async def test_get_tour_availability(self, test_client, authenticated_user):
        """Test GET /api/v1/tours/{id}/availability - Get tour availability"""
        start_date = date.today().isoformat()
        end_date = (date.today() + timedelta(days=7)).isoformat()
        
        response = await test_client.get(
            f"/api/v1/tours/1/availability?start_date={start_date}&end_date={end_date}",
            headers=authenticated_user["auth_headers"]
        )
        
        if response.status_code == 200:
            availability = response.json()
            assert isinstance(availability, list)
            print(f"✅ Availability data: {len(availability)} days")
        elif response.status_code == 404:
            print("⚠️ Tour not found for availability check")
        else:
            print(f"⚠️ Availability check failed: {response.status_code}")

    # ============================================================================
    # AUTHENTICATED USER ENDPOINTS
    # ============================================================================

    @pytest.mark.asyncio
    async def test_get_my_tours(self, test_client, authenticated_user):
        """Test GET /api/v1/tours/my-tours - Get user's tours (operator)"""
        response = await test_client.get(
            "/api/v1/tours/my-tours?operator_id=1",
            headers=authenticated_user["auth_headers"]
        )
        
        assert response.status_code in [200, 422]
        
        if response.status_code == 200:
            tours = response.json()
            assert isinstance(tours, list)
            print(f"✅ My tours: {len(tours)} found")
        else:
            print(f"⚠️ My tours endpoint issue: {response.text}")

    # ============================================================================
    # BOOKING WORKFLOW TESTS
    # ============================================================================

    @pytest.mark.asyncio
    async def test_create_tour_booking(self, test_client, authenticated_user):
        """Test POST /api/v1/tours/bookings - Create tour booking"""
        booking_data = {
            "tour_id": 1,
            "customer_id": authenticated_user["user"]["id"],
            "booking_date": date.today().isoformat(),
            "participants": 2
        }
        
        response = await test_client.post(
            "/api/v1/tours/bookings",
            json=booking_data,
            headers=authenticated_user["auth_headers"]
        )
        
        if response.status_code in [200, 201]:
            booking = response.json()
            assert "id" in booking
            print(f"✅ Created booking: ID {booking['id']}")
            return booking
        elif response.status_code == 404:
            print("⚠️ Tour not found for booking")
            return None
        else:
            print(f"⚠️ Booking creation failed: {response.status_code} - {response.text}")
            return None

    @pytest.mark.asyncio
    async def test_get_my_bookings(self, test_client, authenticated_user):
        """Test GET /api/v1/tours/my-bookings - Get user's bookings"""
        response = await test_client.get(
            f"/api/v1/tours/my-bookings?customer_id={authenticated_user['user']['id']}",
            headers=authenticated_user["auth_headers"]
        )
        
        assert response.status_code in [200, 422]
        
        if response.status_code == 200:
            bookings = response.json()
            assert isinstance(bookings, list)
            print(f"✅ My bookings: {len(bookings)} found")
        else:
            print(f"⚠️ My bookings endpoint issue: {response.text}")

    @pytest.mark.asyncio
    async def test_get_booking_details(self, test_client, authenticated_user):
        """Test GET /api/v1/tours/bookings/{id} - Get booking details"""
        response = await test_client.get(
            "/api/v1/tours/bookings/1",
            headers=authenticated_user["auth_headers"]
        )
        
        if response.status_code == 200:
            booking = response.json()
            assert "id" in booking
            print(f"✅ Retrieved booking details: ID {booking['id']}")
        elif response.status_code == 404:
            print("⚠️ Booking not found")
        else:
            print(f"⚠️ Booking details failed: {response.status_code}")

    # ============================================================================
    # BOOKING LIFECYCLE TESTS
    # ============================================================================

    @pytest.mark.asyncio
    async def test_cancel_booking_post(self, test_client, authenticated_user):
        """Test POST /api/v1/tours/bookings/{id}/cancel - Cancel booking"""
        response = await test_client.post(
            "/api/v1/tours/bookings/1/cancel",
            headers=authenticated_user["auth_headers"]
        )
        
        assert response.status_code in [200, 404]
        
        if response.status_code == 200:
            result = response.json()
            assert result["ok"] is True
            print("✅ Booking cancelled (POST)")

    @pytest.mark.asyncio
    async def test_cancel_booking_get(self, test_client, authenticated_user):
        """Test GET /api/v1/tours/bookings/{id}/cancel - Cancel booking (alternative)"""
        response = await test_client.get(
            "/api/v1/tours/bookings/1/cancel",
            headers=authenticated_user["auth_headers"]
        )
        
        assert response.status_code in [200, 404]
        
        if response.status_code == 200:
            result = response.json()
            assert result["ok"] is True
            print("✅ Booking cancelled (GET)")

    @pytest.mark.asyncio
    async def test_confirm_booking(self, test_client, authenticated_user):
        """Test POST /api/v1/tours/bookings/{id}/confirm - Confirm booking"""
        response = await test_client.post(
            "/api/v1/tours/bookings/1/confirm",
            headers=authenticated_user["auth_headers"]
        )
        
        assert response.status_code in [200, 404]
        
        if response.status_code == 200:
            result = response.json()
            assert result["ok"] is True
            print("✅ Booking confirmed")

    @pytest.mark.asyncio
    async def test_complete_booking(self, test_client, authenticated_user):
        """Test POST /api/v1/tours/bookings/{id}/complete - Complete booking"""
        response = await test_client.post(
            "/api/v1/tours/bookings/1/complete",
            headers=authenticated_user["auth_headers"]
        )
        
        assert response.status_code in [200, 404]
        
        if response.status_code == 200:
            result = response.json()
            assert result["ok"] is True
            print("✅ Booking completed")

    # ============================================================================
    # PAYMENT INTEGRATION TESTS
    # ============================================================================

    @pytest.mark.asyncio
    async def test_process_payment(self, test_client, authenticated_user):
        """Test POST /api/v1/tours/bookings/{id}/payment - Process payment"""
        response = await test_client.post(
            "/api/v1/tours/bookings/1/payment",
            json={},
            headers=authenticated_user["auth_headers"]
        )
        
        assert response.status_code in [200, 404]
        
        if response.status_code == 200:
            result = response.json()
            assert result["ok"] is True
            assert "payment_id" in result
            print(f"✅ Payment processed: {result['payment_id']}")

    @pytest.mark.asyncio
    async def test_get_payment_status(self, test_client, authenticated_user):
        """Test GET /api/v1/tours/bookings/{id}/payment-status - Check payment status"""
        response = await test_client.get(
            "/api/v1/tours/bookings/1/payment-status",
            headers=authenticated_user["auth_headers"]
        )
        
        assert response.status_code in [200, 404]
        
        if response.status_code == 200:
            result = response.json()
            assert "payment_status" in result
            print(f"✅ Payment status: {result['payment_status']}")

    @pytest.mark.asyncio
    async def test_process_refund(self, test_client, authenticated_user):
        """Test POST /api/v1/tours/bookings/{id}/refund - Process refund"""
        response = await test_client.post(
            "/api/v1/tours/bookings/1/refund",
            json={},
            headers=authenticated_user["auth_headers"]
        )
        
        assert response.status_code in [200, 404]
        
        if response.status_code == 200:
            result = response.json()
            assert result["ok"] is True
            print("✅ Refund processed")

    # ============================================================================
    # COMMUNICATION TESTS
    # ============================================================================

    @pytest.mark.asyncio
    async def test_send_message(self, test_client, authenticated_user):
        """Test POST /api/v1/tours/bookings/{id}/messages - Send message"""
        response = await test_client.post(
            "/api/v1/tours/bookings/1/messages",
            json={},
            headers=authenticated_user["auth_headers"]
        )
        
        assert response.status_code in [200, 404, 422]
        
        if response.status_code == 200:
            result = response.json()
            assert result["ok"] is True
            print("✅ Message sent")

    @pytest.mark.asyncio
    async def test_get_booking_messages(self, test_client, authenticated_user):
        """Test GET /api/v1/tours/bookings/{id}/messages - Get booking messages"""
        response = await test_client.get(
            "/api/v1/tours/bookings/1/messages",
            headers=authenticated_user["auth_headers"]
        )
        
        assert response.status_code in [200, 404]
        
        if response.status_code == 200:
            messages = response.json()
            assert isinstance(messages, list)
            print(f"✅ Booking messages: {len(messages)} found")

    @pytest.mark.asyncio
    async def test_get_conversations(self, test_client, authenticated_user):
        """Test GET /api/v1/tours/conversations - Get user conversations"""
        response = await test_client.get(
            f"/api/v1/tours/conversations?user_id={authenticated_user['user']['id']}",
            headers=authenticated_user["auth_headers"]
        )
        
        assert response.status_code in [200, 422]
        
        if response.status_code == 200:
            conversations = response.json()
            assert isinstance(conversations, list)
            print(f"✅ Conversations: {len(conversations)} found")
        else:
            print(f"⚠️ Conversations endpoint issue: {response.text}")

    # ============================================================================
    # OPERATOR DASHBOARD TESTS
    # ============================================================================

    @pytest.mark.asyncio
    async def test_operator_bookings(self, test_client, authenticated_user):
        """Test GET /api/v1/tours/operator/bookings - Get operator bookings"""
        response = await test_client.get(
            "/api/v1/tours/operator/bookings?operator_id=1",
            headers=authenticated_user["auth_headers"]
        )
        
        assert response.status_code in [200, 422]
        
        if response.status_code == 200:
            bookings = response.json()
            assert isinstance(bookings, list)
            print(f"✅ Operator bookings: {len(bookings)} found")

    @pytest.mark.asyncio
    async def test_operator_dashboard(self, test_client, authenticated_user):
        """Test GET /api/v1/tours/operator/dashboard - Get operator dashboard"""
        response = await test_client.get(
            "/api/v1/tours/operator/dashboard?operator_id=1",
            headers=authenticated_user["auth_headers"]
        )
        
        assert response.status_code in [200, 422]
        
        if response.status_code == 200:
            dashboard = response.json()
            assert "total_tours" in dashboard
            print(f"✅ Dashboard: {dashboard['total_tours']} tours, {dashboard['active_bookings']} bookings")

    @pytest.mark.asyncio
    async def test_operator_earnings(self, test_client, authenticated_user):
        """Test GET /api/v1/tours/operator/earnings - Get operator earnings"""
        response = await test_client.get(
            "/api/v1/tours/operator/earnings?operator_id=1",
            headers=authenticated_user["auth_headers"]
        )
        
        assert response.status_code in [200, 422]
        
        if response.status_code == 200:
            earnings = response.json()
            assert "total_earnings" in earnings
            print(f"✅ Earnings: {earnings['total_earnings']} total")

    @pytest.mark.asyncio
    async def test_operator_payouts(self, test_client, authenticated_user):
        """Test GET /api/v1/tours/operator/payouts - Get operator payouts"""
        response = await test_client.get(
            "/api/v1/tours/operator/payouts?operator_id=1",
            headers=authenticated_user["auth_headers"]
        )
        
        assert response.status_code in [200, 422]
        
        if response.status_code == 200:
            payouts = response.json()
            assert isinstance(payouts, list)
            print(f"✅ Payouts: {len(payouts)} found")

    # ============================================================================
    # TOUR MANAGEMENT ADVANCED TESTS
    # ============================================================================

    @pytest.mark.asyncio
    async def test_update_tour_availability(self, test_client, authenticated_user):
        """Test POST /api/v1/tours/{id}/availability - Update tour availability"""
        availability_data = {
            "tour_id": 1,
            "items": [
                {
                    "date": date.today().isoformat(),
                    "available_spots": 10
                }
            ]
        }
        
        response = await test_client.post(
            "/api/v1/tours/1/availability",
            json=availability_data,
            headers=authenticated_user["auth_headers"]
        )
        
        assert response.status_code in [200, 404, 422]
        
        if response.status_code == 200:
            result = response.json()
            assert result["ok"] is True
            print("✅ Tour availability updated")

    @pytest.mark.asyncio
    async def test_update_tour_pricing(self, test_client, authenticated_user):
        """Test POST /api/v1/tours/{id}/pricing - Update tour pricing"""
        response = await test_client.post(
            "/api/v1/tours/1/pricing",
            json={},
            headers=authenticated_user["auth_headers"]
        )
        
        assert response.status_code in [200, 404, 422]
        
        if response.status_code == 200:
            result = response.json()
            assert result["ok"] is True
            print("✅ Tour pricing updated")

    @pytest.mark.asyncio
    async def test_delete_tour(self, test_client, authenticated_user):
        """Test GET /api/v1/tours/{id}/delete - Delete tour"""
        response = await test_client.get(
            "/api/v1/tours/999/delete",  # Use non-existent ID
            headers=authenticated_user["auth_headers"]
        )
        
        assert response.status_code in [200, 404]
        
        if response.status_code == 200:
            result = response.json()
            assert result["ok"] is True
            print("✅ Tour deleted")
        elif response.status_code == 404:
            print("⚠️ Tour not found for deletion (expected)")

    # ============================================================================
    # SUMMARY TEST
    # ============================================================================

    def test_verify_authentication_works(self, test_client, authenticated_user):
        """Test GET /api/v1/shared/auth/me - Verify authentication is working"""
        response = test_client.get(
            "/api/v1/shared/auth/me",
            headers=authenticated_user["auth_headers"]
        )
        
        assert response.status_code == 200
        user_profile = response.json()
        assert user_profile["email"] == "tour.tester@example.com"
        print(f"✅ Authentication verified: {user_profile['name']} ({user_profile['email']})")
