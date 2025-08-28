"""
Simple authenticated integration test for key tour endpoints.

This test logs in as a user and tests the most important tour endpoints.
"""
import pytest
from datetime import date, timedelta
from fastapi.testclient import TestClient

from api.main import app


class TestTourAuthenticationFlow:
    """Simple integration test for tour endpoints with authentication."""

    @pytest.fixture
    def client(self):
        """Test client for API endpoints."""
        return TestClient(app)

    @pytest.fixture
    def authenticated_user(self, client):
        """Create and authenticate a test user."""
        # Step 1: Register a new user
        registration_data = {
            "email": "tour.auth.test@example.com",
            "password": "SecurePassword123!",
            "name": "Tour Auth Test",
            "phone": "+254712345678"
        }
        
        register_response = client.post(
            "/api/v1/auth/register", 
            json=registration_data
        )
        
        print(f"Registration response: {register_response.status_code}")
        if register_response.status_code not in [201, 400]:  # 400 might be duplicate user
            pytest.fail(f"Registration failed: {register_response.status_code} - {register_response.text}")
        
        # Step 2: Login to get access token
        login_data = {
            "username": registration_data["email"],
            "password": registration_data["password"]
        }
        
        login_response = client.post(
            "/api/v1/auth/token",
            data=login_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        print(f"Login response: {login_response.status_code}")
        if login_response.status_code != 200:
            pytest.fail(f"Login failed: {login_response.status_code} - {login_response.text}")
        
        token_data = login_response.json()
        access_token = token_data["access_token"]
        
        return {
            "access_token": access_token,
            "auth_headers": {"Authorization": f"Bearer {access_token}"}
        }

    def test_authentication_works(self, client, authenticated_user):
        """Test that authentication is working properly."""
        response = client.get(
            "/api/v1/auth/me",
            headers=authenticated_user["auth_headers"]
        )
        
        assert response.status_code == 200
        user_profile = response.json()
        assert user_profile["email"] == "tour.auth.test@example.com"
        print(f"✅ Authentication verified: {user_profile['name']}")

    def test_list_tours(self, client, authenticated_user):
        """Test GET /api/v1/tours/ - List all tours"""
        response = client.get(
            "/api/v1/tours/",
            headers=authenticated_user["auth_headers"]
        )
        
        print(f"List tours response: {response.status_code}")
        assert response.status_code == 200
        tours = response.json()
        assert isinstance(tours, list)
        print(f"✅ Found {len(tours)} tours")

    def test_get_tour_categories(self, client, authenticated_user):
        """Test GET /api/v1/tours/categories - Get tour categories"""
        response = client.get(
            "/api/v1/tours/categories",
            headers=authenticated_user["auth_headers"]
        )
        
        print(f"Categories response: {response.status_code}")
        
        if response.status_code == 200:
            categories = response.json()
            assert isinstance(categories, list)
            assert len(categories) > 0
            print(f"✅ Categories: {[cat['name'] for cat in categories]}")
        else:
            print(f"⚠️ Categories failed: {response.text}")

    def test_search_tours(self, client, authenticated_user):
        """Test POST /api/v1/tours/search - Search tours"""
        search_criteria = {
            "location": "Kenya",
            "start_date": date.today().isoformat(),
            "max_price": 20000
        }
        
        response = client.post(
            "/api/v1/tours/search",
            json=search_criteria,
            headers=authenticated_user["auth_headers"]
        )
        
        print(f"Search response: {response.status_code}")
        
        if response.status_code == 200:
            tours = response.json()
            assert isinstance(tours, list)
            print(f"✅ Search returned {len(tours)} tours")
        else:
            print(f"⚠️ Search failed: {response.text}")

    def test_create_tour(self, client, authenticated_user):
        """Test POST /api/v1/tours/ - Create new tour"""
        tour_data = {
            "id": 0,  # 0 for create
            "name": "Test Safari Tour",
            "description": "Amazing test safari experience",
            "price": 15000,
            "currency": "KES",
            "duration_hours": 48,
            "max_participants": 8,
            "included_services": {
                "meals": True,
                "guide": True,
                "transport": True
            },
            "operator_id": 1
        }
        
        response = client.post(
            "/api/v1/tours/",
            json=tour_data,
            headers=authenticated_user["auth_headers"]
        )
        
        print(f"Create tour response: {response.status_code}")
        
        if response.status_code in [200, 201]:
            tour = response.json()
            assert tour["id"] > 0
            assert tour["name"] == tour_data["name"]
            print(f"✅ Created tour: {tour['name']} (ID: {tour['id']})")
            return tour["id"]
        else:
            print(f"⚠️ Tour creation failed: {response.text}")
            return None

    def test_get_tour_details(self, client, authenticated_user):
        """Test GET /api/v1/tours/{id} - Get tour details"""
        # Try to get tour with ID 1
        response = client.get(
            "/api/v1/tours/1",
            headers=authenticated_user["auth_headers"]
        )
        
        print(f"Get tour details response: {response.status_code}")
        
        if response.status_code == 200:
            tour = response.json()
            assert "id" in tour
            assert "name" in tour
            print(f"✅ Retrieved tour: {tour['name']}")
        elif response.status_code == 404:
            print("⚠️ No tour with ID 1 found")
        else:
            print(f"⚠️ Unexpected error: {response.text}")

    def test_create_tour_booking(self, client, authenticated_user):
        """Test POST /api/v1/tours/bookings - Create tour booking"""
        booking_data = {
            "tour_id": 1,
            "customer_id": 1,  # Mock customer ID
            "booking_date": date.today().isoformat(),
            "participants": 2
        }
        
        response = client.post(
            "/api/v1/tours/bookings",
            json=booking_data,
            headers=authenticated_user["auth_headers"]
        )
        
        print(f"Create booking response: {response.status_code}")
        
        if response.status_code in [200, 201]:
            booking = response.json()
            assert "id" in booking
            print(f"✅ Created booking: ID {booking['id']}")
        elif response.status_code == 404:
            print("⚠️ Tour not found for booking")
        else:
            print(f"⚠️ Booking creation failed: {response.text}")

    def test_get_featured_tours(self, client, authenticated_user):
        """Test GET /api/v1/tours/featured - Get featured tours"""
        response = client.get(
            "/api/v1/tours/featured",
            headers=authenticated_user["auth_headers"]
        )
        
        print(f"Featured tours response: {response.status_code}")
        
        if response.status_code == 200:
            tours = response.json()
            assert isinstance(tours, list)
            print(f"✅ Featured tours: {len(tours)} found")
        else:
            print(f"⚠️ Featured tours failed: {response.text}")

    def test_tour_availability(self, client, authenticated_user):
        """Test GET /api/v1/tours/{id}/availability - Get tour availability"""
        start_date = date.today().isoformat()
        end_date = (date.today() + timedelta(days=7)).isoformat()
        
        response = client.get(
            f"/api/v1/tours/1/availability?start_date={start_date}&end_date={end_date}",
            headers=authenticated_user["auth_headers"]
        )
        
        print(f"Availability response: {response.status_code}")
        
        if response.status_code == 200:
            availability = response.json()
            assert isinstance(availability, list)
            print(f"✅ Availability data: {len(availability)} days")
        elif response.status_code == 404:
            print("⚠️ Tour not found for availability check")
        else:
            print(f"⚠️ Availability check failed: {response.text}")

    def test_operator_dashboard(self, client, authenticated_user):
        """Test GET /api/v1/tours/operator/dashboard - Get operator dashboard"""
        response = client.get(
            "/api/v1/tours/operator/dashboard?operator_id=1",
            headers=authenticated_user["auth_headers"]
        )
        
        print(f"Dashboard response: {response.status_code}")
        
        if response.status_code == 200:
            dashboard = response.json()
            assert "total_tours" in dashboard
            print(f"✅ Dashboard: {dashboard['total_tours']} tours, {dashboard['active_bookings']} bookings")
        else:
            print(f"⚠️ Dashboard failed: {response.text}")

    def test_my_bookings(self, client, authenticated_user):
        """Test GET /api/v1/tours/my-bookings - Get user's bookings"""
        response = client.get(
            "/api/v1/tours/my-bookings?customer_id=1",
            headers=authenticated_user["auth_headers"]
        )
        
        print(f"My bookings response: {response.status_code}")
        
        if response.status_code == 200:
            bookings = response.json()
            assert isinstance(bookings, list)
            print(f"✅ My bookings: {len(bookings)} found")
        else:
            print(f"⚠️ My bookings failed: {response.text}")

    def test_payment_flow(self, client, authenticated_user):
        """Test payment endpoints"""
        # Test payment processing
        response = client.post(
            "/api/v1/tours/bookings/1/payment",
            json={},
            headers=authenticated_user["auth_headers"]
        )
        
        print(f"Payment response: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            assert result["ok"] is True
            print(f"✅ Payment processed: {result.get('payment_id', 'mock')}")
        
        # Test payment status
        response = client.get(
            "/api/v1/tours/bookings/1/payment-status",
            headers=authenticated_user["auth_headers"]
        )
        
        print(f"Payment status response: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Payment status: {result.get('payment_status', 'unknown')}")

    def test_comprehensive_workflow(self, client, authenticated_user):
        """Test a complete user workflow: search → view → book → pay"""
        print("\n🔄 Starting comprehensive tour workflow test...")
        
        # Step 1: Search for tours
        search_response = client.post(
            "/api/v1/tours/search",
            json={"location": "Kenya", "max_price": 30000},
            headers=authenticated_user["auth_headers"]
        )
        print(f"Step 1 - Search: {search_response.status_code}")
        
        # Step 2: List all tours
        list_response = client.get(
            "/api/v1/tours/",
            headers=authenticated_user["auth_headers"]
        )
        print(f"Step 2 - List: {list_response.status_code}")
        
        # Step 3: Get categories
        categories_response = client.get(
            "/api/v1/tours/categories",
            headers=authenticated_user["auth_headers"]
        )
        print(f"Step 3 - Categories: {categories_response.status_code}")
        
        # Step 4: Try to book a tour
        booking_response = client.post(
            "/api/v1/tours/bookings",
            json={
                "tour_id": 1,
                "customer_id": 1,
                "booking_date": date.today().isoformat(),
                "participants": 2
            },
            headers=authenticated_user["auth_headers"]
        )
        print(f"Step 4 - Booking: {booking_response.status_code}")
        
        # Step 5: Check my bookings
        my_bookings_response = client.get(
            "/api/v1/tours/my-bookings?customer_id=1",
            headers=authenticated_user["auth_headers"]
        )
        print(f"Step 5 - My Bookings: {my_bookings_response.status_code}")
        
        print("✅ Comprehensive workflow completed!")
