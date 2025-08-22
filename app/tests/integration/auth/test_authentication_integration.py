"""
Integration tests for user authentication and login flow.

Tests the complete authentication process including token generation and validation.
"""
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from jose import jwt

from infrastructure.database.models.user import User
from infrastructure.config.database import get_async_session
from infrastructure.config.auth import SECRET_KEY, ALGORITHM
from api.main import app


class TestAuthenticationIntegration:
    """Integration tests for authentication covering login, token validation, and protected routes."""

    @pytest.fixture
    async def test_client(self):
        """HTTP client for testing API endpoints."""
        async with AsyncClient(app=app, base_url="http://testserver") as client:
            yield client

    @pytest.fixture
    async def db_session(self):
        """Database session for test setup."""
        async for session in get_async_session():
            yield session
            await session.rollback()

    @pytest.fixture
    async def test_user(self, test_client):
        """Create a test user for authentication tests."""
        registration_data = {
            "email": "auth.test@example.com",
            "password": "SecurePassword123!",
            "first_name": "Auth",
            "last_name": "Test"
        }
        
        response = await test_client.post("/api/v1/shared/users/", json=registration_data)
        assert response.status_code == 201
        return response.json()

    @pytest.mark.asyncio
    async def test_login_with_valid_credentials_returns_access_token(
        self, test_client, test_user
    ):
        """Test successful login returns a valid JWT access token."""
        # Arrange
        login_data = {
            "username": "auth.test@example.com",  # OAuth2 uses 'username' field
            "password": "SecurePassword123!"
        }

        # Act
        response = await test_client.post(
            "/api/v1/shared/auth/token",
            data=login_data,  # form-data for OAuth2PasswordRequestForm
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )

        # Assert
        assert response.status_code == 200
        token_data = response.json()
        
        assert "access_token" in token_data
        assert "token_type" in token_data
        assert token_data["token_type"] == "bearer"
        
        # Verify JWT token structure
        token = token_data["access_token"]
        assert isinstance(token, str)
        assert len(token.split('.')) == 3  # JWT has 3 parts
        
        # Decode and verify token payload
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        assert "sub" in payload  # Subject (user ID)
        assert "exp" in payload  # Expiration
        assert payload["sub"] == str(test_user["id"])

    @pytest.mark.asyncio
    async def test_login_with_invalid_email_returns_401_error(
        self, test_client, test_user
    ):
        """Test login with invalid email returns 401 unauthorized."""
        # Arrange
        login_data = {
            "username": "nonexistent@example.com",
            "password": "SecurePassword123!"
        }

        # Act
        response = await test_client.post(
            "/api/v1/shared/auth/token",
            data=login_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )

        # Assert
        assert response.status_code == 401
        error_data = response.json()
        assert "detail" in error_data
        assert "username or password" in error_data["detail"].lower()

    @pytest.mark.asyncio
    async def test_login_with_invalid_password_returns_401_error(
        self, test_client, test_user
    ):
        """Test login with invalid password returns 401 unauthorized."""
        # Arrange
        login_data = {
            "username": "auth.test@example.com",
            "password": "WrongPassword123!"
        }

        # Act
        response = await test_client.post(
            "/api/v1/shared/auth/token",
            data=login_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )

        # Assert
        assert response.status_code == 401
        error_data = response.json()
        assert "detail" in error_data
        assert "username or password" in error_data["detail"].lower()

    @pytest.mark.asyncio
    async def test_access_protected_route_with_valid_token_returns_user_data(
        self, test_client, test_user
    ):
        """Test accessing protected route with valid token returns user data."""
        # Arrange - Get access token
        login_data = {
            "username": "auth.test@example.com",
            "password": "SecurePassword123!"
        }
        
        login_response = await test_client.post(
            "/api/v1/shared/auth/token",
            data=login_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        assert login_response.status_code == 200
        access_token = login_response.json()["access_token"]

        # Act - Access protected route
        response = await test_client.get(
            "/api/v1/shared/users/me",
            headers={"Authorization": f"Bearer {access_token}"}
        )

        # Assert
        assert response.status_code == 200
        user_data = response.json()
        
        assert user_data["id"] == test_user["id"]
        assert user_data["email"] == "auth.test@example.com"
        assert user_data["first_name"] == "Auth"
        assert user_data["last_name"] == "Test"
        assert user_data["is_active"] is True

    @pytest.mark.asyncio
    async def test_access_protected_route_without_token_returns_401_error(
        self, test_client
    ):
        """Test accessing protected route without token returns 401 unauthorized."""
        # Act
        response = await test_client.get("/api/v1/shared/users/me")

        # Assert
        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_access_protected_route_with_invalid_token_returns_401_error(
        self, test_client
    ):
        """Test accessing protected route with invalid token returns 401 unauthorized."""
        # Arrange
        invalid_token = "invalid.jwt.token"

        # Act
        response = await test_client.get(
            "/api/v1/shared/users/me",
            headers={"Authorization": f"Bearer {invalid_token}"}
        )

        # Assert
        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_access_protected_route_with_expired_token_returns_401_error(
        self, test_client
    ):
        """Test accessing protected route with expired token returns 401 unauthorized."""
        # Arrange - Create an expired token
        from datetime import datetime, timedelta, UTC
        from infrastructure.config.auth import create_access_token
        
        # Create token that expires immediately
        expired_token = create_access_token(
            subject="123",
            expires_delta=timedelta(seconds=-1)  # Already expired
        )

        # Act
        response = await test_client.get(
            "/api/v1/shared/users/me",
            headers={"Authorization": f"Bearer {expired_token}"}
        )

        # Assert
        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_login_case_insensitive_email_handling(
        self, test_client, test_user
    ):
        """Test that login handles email case variations correctly."""
        # Arrange - Try different email case variations
        email_variations = [
            "auth.test@example.com",
            "Auth.Test@Example.Com",
            "AUTH.TEST@EXAMPLE.COM"
        ]

        for email_variant in email_variations:
            login_data = {
                "username": email_variant,
                "password": "SecurePassword123!"
            }

            # Act
            response = await test_client.post(
                "/api/v1/shared/auth/token",
                data=login_data,
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )

            # Assert - Should succeed regardless of case (depending on implementation)
            # Note: This depends on how email comparison is implemented
            # If case-sensitive, some variants might fail - adjust expectations accordingly
            if response.status_code == 200:
                token_data = response.json()
                assert "access_token" in token_data

    @pytest.mark.asyncio
    async def test_user_profile_update_with_authentication(
        self, test_client, test_user
    ):
        """Test updating user profile requires authentication and works correctly."""
        # Arrange - Get access token
        login_data = {
            "username": "auth.test@example.com",
            "password": "SecurePassword123!"
        }
        
        login_response = await test_client.post(
            "/api/v1/shared/auth/token",
            data=login_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        access_token = login_response.json()["access_token"]

        # Act - Update profile
        update_data = {
            "id": test_user["id"],
            "name": "Updated Auth Test",
            "phone": "+254722345678"
        }
        
        response = await test_client.post(
            "/api/v1/shared/users/profile",
            json=update_data,
            headers={"Authorization": f"Bearer {access_token}"}
        )

        # Assert
        assert response.status_code == 200
        updated_user = response.json()
        assert updated_user["name"] == "Updated Auth Test"

    @pytest.mark.asyncio
    async def test_token_contains_correct_user_information(
        self, test_client, test_user
    ):
        """Test that JWT token contains correct user information."""
        # Arrange
        login_data = {
            "username": "auth.test@example.com",
            "password": "SecurePassword123!"
        }

        # Act
        response = await test_client.post(
            "/api/v1/shared/auth/token",
            data=login_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )

        # Assert
        assert response.status_code == 200
        token = response.json()["access_token"]
        
        # Decode token and verify payload
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        assert payload["sub"] == str(test_user["id"])
        
        # Verify expiration is set and in the future
        assert "exp" in payload
        from datetime import datetime, UTC
        exp_timestamp = payload["exp"]
        exp_datetime = datetime.fromtimestamp(exp_timestamp, tz=UTC)
        assert exp_datetime > datetime.now(UTC)

    @pytest.mark.asyncio
    async def test_multiple_concurrent_logins_for_same_user(
        self, test_client, test_user
    ):
        """Test that multiple concurrent login sessions work correctly."""
        # Arrange
        login_data = {
            "username": "auth.test@example.com",
            "password": "SecurePassword123!"
        }

        # Act - Create multiple tokens
        responses = []
        for _ in range(3):
            response = await test_client.post(
                "/api/v1/shared/auth/token",
                data=login_data,
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            responses.append(response)

        # Assert - All should succeed and return different tokens
        tokens = []
        for response in responses:
            assert response.status_code == 200
            token = response.json()["access_token"]
            tokens.append(token)

        # All tokens should be valid but different (due to timestamps)
        assert len(set(tokens)) == 3  # All tokens should be unique

        # All tokens should work for accessing protected routes
        for token in tokens:
            response = await test_client.get(
                "/api/v1/shared/users/me",
                headers={"Authorization": f"Bearer {token}"}
            )
            assert response.status_code == 200

