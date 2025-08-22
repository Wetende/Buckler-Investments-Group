"""
Simple authentication endpoint test to verify basic functionality.
"""
import pytest
from fastapi.testclient import TestClient
from fastapi import status

from api.main import app


@pytest.fixture
def client():
    """Test client for making HTTP requests."""
    return TestClient(app)


class TestBasicAuthentication:
    """Basic authentication tests."""
    
    def test_register_user_success(self, client: TestClient):
        """Test successful user registration."""
        user_data = {
            "email": "test@example.com",
            "password": "SecurePassword123!",
            "name": "Test User",
            "phone": "+1234567890"
        }
        
        response = client.post("/api/v1/users/", json=user_data)
        
        print(f"Registration response status: {response.status_code}")
        print(f"Registration response: {response.json()}")
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert "id" in data
        assert data["email"] == user_data["email"]
        assert data["name"] == user_data["name"]
        assert "password" not in data  # Should not return password
    
    def test_login_user_success(self, client: TestClient):
        """Test successful user login."""
        # First register a user
        user_data = {
            "email": "logintest@example.com",
            "password": "SecurePassword123!",
            "name": "Login Test User",
            "phone": "+1234567890"
        }
        
        reg_response = client.post("/api/v1/users/", json=user_data)
        assert reg_response.status_code == status.HTTP_201_CREATED
        
        # Now login
        login_data = {
            "username": user_data["email"],  # OAuth2 uses 'username'
            "password": user_data["password"],
            "grant_type": "password"
        }
        
        login_response = client.post(
            "/api/v1/auth/token",
            data=login_data,  # Form data for OAuth2
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        print(f"Login response status: {login_response.status_code}")
        print(f"Login response: {login_response.json()}")
        
        assert login_response.status_code == status.HTTP_200_OK
        token_data = login_response.json()
        assert "access_token" in token_data
        assert "token_type" in token_data
        assert token_data["token_type"] == "bearer"
    
    def test_get_current_user(self, client: TestClient):
        """Test getting current user profile."""
        # Register and login
        user_data = {
            "email": "profiletest@example.com",
            "password": "SecurePassword123!",
            "name": "Profile Test User",
            "phone": "+1234567890"
        }
        
        # Register
        reg_response = client.post("/api/v1/users/", json=user_data)
        assert reg_response.status_code == status.HTTP_201_CREATED
        
        # Login to get token
        login_data = {
            "username": user_data["email"],
            "password": user_data["password"],
            "grant_type": "password"
        }
        
        login_response = client.post(
            "/api/v1/auth/token",
            data=login_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        assert login_response.status_code == status.HTTP_200_OK
        
        token_data = login_response.json()
        access_token = token_data["access_token"]
        
        # Get current user profile
        headers = {"Authorization": f"Bearer {access_token}"}
        profile_response = client.get("/api/v1/users/me", headers=headers)
        
        print(f"Profile response status: {profile_response.status_code}")
        print(f"Profile response: {profile_response.json()}")
        
        assert profile_response.status_code == status.HTTP_200_OK
        profile_data = profile_response.json()
        assert "id" in profile_data
        assert profile_data["email"] == user_data["email"]
    
    def test_logout_user(self, client: TestClient):
        """Test user logout."""
        # Register and login first
        user_data = {
            "email": "logouttest@example.com", 
            "password": "SecurePassword123!",
            "name": "Logout Test User",
            "phone": "+1234567890"
        }
        
        # Register
        reg_response = client.post("/api/v1/users/", json=user_data)
        assert reg_response.status_code == status.HTTP_201_CREATED
        
        # Login
        login_data = {
            "username": user_data["email"],
            "password": user_data["password"],
            "grant_type": "password"
        }
        
        login_response = client.post(
            "/api/v1/auth/token",
            data=login_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        assert login_response.status_code == status.HTTP_200_OK
        
        token_data = login_response.json()
        access_token = token_data["access_token"]
        
        # Logout
        headers = {"Authorization": f"Bearer {access_token}"}
        logout_response = client.post("/api/v1/auth/logout", headers=headers)
        
        print(f"Logout response status: {logout_response.status_code}")
        print(f"Logout response: {logout_response.json()}")
        
        assert logout_response.status_code == status.HTTP_200_OK
        logout_data = logout_response.json()
        assert logout_data["ok"] is True
    
    def test_duplicate_email_registration(self, client: TestClient):
        """Test that duplicate email registration fails."""
        user_data = {
            "email": "duplicate@example.com",
            "password": "SecurePassword123!",
            "name": "Duplicate Test User",
            "phone": "+1234567890"
        }
        
        # Register first user
        response1 = client.post("/api/v1/users/", json=user_data)
        assert response1.status_code == status.HTTP_201_CREATED
        
        # Try to register with same email
        response2 = client.post("/api/v1/users/", json=user_data)
        
        print(f"Duplicate registration response status: {response2.status_code}")
        print(f"Duplicate registration response: {response2.json()}")
        
        assert response2.status_code == status.HTTP_400_BAD_REQUEST
        error_data = response2.json()
        assert "already exists" in error_data["detail"].lower()
    
    def test_invalid_login_credentials(self, client: TestClient):
        """Test login with invalid credentials."""
        # Register user first
        user_data = {
            "email": "invalidlogin@example.com",
            "password": "SecurePassword123!",
            "name": "Invalid Login Test User", 
            "phone": "+1234567890"
        }
        
        reg_response = client.post("/api/v1/users/", json=user_data)
        assert reg_response.status_code == status.HTTP_201_CREATED
        
        # Try to login with wrong password
        login_data = {
            "username": user_data["email"],
            "password": "WrongPassword123!",  # Wrong password
            "grant_type": "password"
        }
        
        login_response = client.post(
            "/api/v1/auth/token",
            data=login_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        print(f"Invalid login response status: {login_response.status_code}")
        print(f"Invalid login response: {login_response.json()}")
        
        assert login_response.status_code == status.HTTP_401_UNAUTHORIZED
        error_data = login_response.json()
        assert "incorrect" in error_data["detail"].lower()


if __name__ == "__main__":
    # Manual testing if run directly
    import pytest
    pytest.main([__file__, "-v", "-s"])

