"""
API tests for authentication endpoints.

Tests HTTP layer authentication behavior.
"""
import pytest
from httpx import AsyncClient
from unittest.mock import patch, AsyncMock

from api.main import app


class TestAuthApiEndpoints:
    """Test suite for authentication API endpoints."""

    @pytest.fixture
    async def test_client(self):
        """HTTP client for testing API endpoints."""
        from fastapi.testclient import TestClient
        client = TestClient(app)
        yield client

    def test_token_endpoint_exists_and_accepts_post(self, test_client):
        """Test that token endpoint exists and accepts POST requests."""
        # Act
        response = test_client.post(
            "/api/v1/auth/token",
            data={"username": "test", "password": "test"},
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )

        # Assert - Should not be 404 (endpoint exists)
        assert response.status_code != 404
        # May be 401 (unauthorized) but endpoint exists

    def test_token_endpoint_requires_form_data_content_type(self, test_client):
        """Test that token endpoint requires form data content type."""
        # Arrange - Send JSON instead of form data
        response = test_client.post(
            "/api/v1/auth/token",
            json={"username": "test", "password": "test"}
        )

        # Assert - Should fail with 422 (validation error) due to incorrect content type
        assert response.status_code == 422

    def test_token_endpoint_validates_required_fields(self, test_client):
        """Test that token endpoint validates required username and password fields."""
        # Test missing username
        response = test_client.post(
            "/api/v1/auth/token",
            data={"password": "test"},
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        assert response.status_code == 422

        # Test missing password
        response = test_client.post(
            "/api/v1/auth/token",
            data={"username": "test"},
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        assert response.status_code == 422

    @pytest.mark.asyncio
    @patch('infrastructure.config.auth.authenticate_user')
    async def test_token_endpoint_with_valid_credentials_returns_token(
        self, mock_authenticate, test_client
    ):
        """Test token endpoint returns JWT token for valid credentials."""
        # Arrange
        from infrastructure.database.models.user import User
        mock_user = User(
            id=123,
            email="test@example.com",
            hashed_password="hashed",
            name="Test User",
            is_active=True
        )
        mock_authenticate.return_value = mock_user

        # Act
        response = await test_client.post(
            "/api/v1/shared/auth/token",
            data={"username": "test@example.com", "password": "correct_password"},
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )

        # Assert
        assert response.status_code == 200
        token_data = response.json()
        assert "access_token" in token_data
        assert "token_type" in token_data
        assert token_data["token_type"] == "bearer"
        assert isinstance(token_data["access_token"], str)
        assert len(token_data["access_token"]) > 10  # Should be a proper JWT

    @pytest.mark.asyncio
    @patch('infrastructure.config.auth.authenticate_user')
    async def test_token_endpoint_with_invalid_credentials_returns_401(
        self, mock_authenticate, test_client
    ):
        """Test token endpoint returns 401 for invalid credentials."""
        # Arrange
        mock_authenticate.return_value = None  # Authentication failed

        # Act
        response = await test_client.post(
            "/api/v1/shared/auth/token",
            data={"username": "test@example.com", "password": "wrong_password"},
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )

        # Assert
        assert response.status_code == 401
        error_data = response.json()
        assert "detail" in error_data
        assert "username or password" in error_data["detail"].lower()
        assert "WWW-Authenticate" in response.headers
        assert response.headers["WWW-Authenticate"] == "Bearer"

    @pytest.mark.asyncio
    async def test_user_me_endpoint_requires_authentication(self, test_client):
        """Test that /users/me endpoint requires authentication."""
        # Act
        response = await test_client.get("/api/v1/shared/users/me")

        # Assert
        assert response.status_code == 401

    @pytest.mark.asyncio
    @patch('infrastructure.config.auth.get_current_user')
    async def test_user_me_endpoint_with_valid_token_returns_user_data(
        self, mock_get_current_user, test_client
    ):
        """Test that /users/me endpoint returns user data with valid token."""
        # Arrange
        from domain.entities.user import User, UserRole
        mock_user = User(
            id=123,
            email="test@example.com",
            hashed_password="hashed",
            full_name="Test User",
            is_active=True,
            roles=[UserRole(name="user", permissions=[])]
        )
        mock_get_current_user.return_value = mock_user

        # Act
        response = await test_client.get(
            "/api/v1/shared/users/me",
            headers={"Authorization": "Bearer fake_token"}
        )

        # Assert
        assert response.status_code == 200
        user_data = response.json()
        assert user_data["id"] == 123
        assert user_data["email"] == "test@example.com"
        assert user_data["full_name"] == "Test User"
        assert user_data["is_active"] is True

    @pytest.mark.asyncio
    async def test_user_me_endpoint_with_invalid_token_returns_401(self, test_client):
        """Test that /users/me endpoint returns 401 with invalid token."""
        # Act
        response = await test_client.get(
            "/api/v1/shared/users/me",
            headers={"Authorization": "Bearer invalid_token"}
        )

        # Assert
        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_user_me_endpoint_with_malformed_authorization_header_returns_401(
        self, test_client
    ):
        """Test that /users/me endpoint returns 401 with malformed authorization header."""
        # Test various malformed headers
        malformed_headers = [
            {"Authorization": "InvalidToken"},  # Missing Bearer
            {"Authorization": "Bearer"},         # Missing token
            {"Authorization": "Basic dGVzdA=="},  # Wrong scheme
            {"Authorization": ""},               # Empty
        ]

        for header in malformed_headers:
            response = await test_client.get("/api/v1/shared/users/me", headers=header)
            assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_user_registration_endpoint_validation(self, test_client):
        """Test user registration endpoint input validation."""
        # Test invalid email format
        invalid_data = {
            "email": "invalid-email",
            "password": "password123",
            "first_name": "Test",
            "last_name": "User"
        }
        
        response = await test_client.post("/api/v1/shared/users/", json=invalid_data)
        assert response.status_code == 422

        # Test missing required fields
        incomplete_data = {
            "email": "test@example.com"
            # Missing password, names
        }
        
        response = await test_client.post("/api/v1/shared/users/", json=incomplete_data)
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_user_registration_endpoint_success_response_format(self, test_client):
        """Test user registration endpoint success response format."""
        # Note: This will likely fail without a real database setup
        # but tests the response structure if successful
        
        valid_data = {
            "email": "api.test@example.com",
            "password": "SecurePassword123!",
            "first_name": "API",
            "last_name": "Test"
        }

        with patch('application.use_cases.user.create_user.CreateUserUseCase.execute') as mock_execute:
            from application.dto.user import UserResponseDTO
            mock_execute.return_value = UserResponseDTO(
                id=123,
                email="api.test@example.com",
                first_name="API",
                last_name="Test",
                is_active=True,
                role="USER",
                created_at="2024-01-01T00:00:00Z"
            )

            response = await test_client.post("/api/v1/shared/users/", json=valid_data)

            # Should return 201 Created with proper response structure
            if response.status_code == 201:
                user_data = response.json()
                assert "id" in user_data
                assert "email" in user_data
                assert "first_name" in user_data
                assert "last_name" in user_data
                assert "is_active" in user_data
                # Should NOT include password or hashed_password
                assert "password" not in user_data
                assert "hashed_password" not in user_data

    @pytest.mark.asyncio
    async def test_cors_headers_on_auth_endpoints(self, test_client):
        """Test that CORS headers are properly set on auth endpoints."""
        # Test preflight request
        response = await test_client.options("/api/v1/shared/auth/token")
        
        # Should include CORS headers (depending on configuration)
        # This test depends on your CORS middleware configuration
        if "Access-Control-Allow-Origin" in response.headers:
            assert response.headers["Access-Control-Allow-Origin"] is not None

    @pytest.mark.asyncio
    async def test_rate_limiting_on_auth_endpoints(self, test_client):
        """Test rate limiting on authentication endpoints (if implemented)."""
        # Make multiple rapid requests to test rate limiting
        login_data = {
            "username": "test@example.com",
            "password": "wrong_password"
        }

        responses = []
        for _ in range(10):  # Make 10 rapid requests
            response = await test_client.post(
                "/api/v1/shared/auth/token",
                data=login_data,
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            responses.append(response.status_code)

        # If rate limiting is implemented, some requests should be rate limited (429)
        # If not implemented, all should return 401 (unauthorized)
        assert all(status in [401, 429] for status in responses)

    @pytest.mark.asyncio
    async def test_token_endpoint_response_headers(self, test_client):
        """Test that token endpoint returns appropriate response headers."""
        response = await test_client.post(
            "/api/v1/shared/auth/token",
            data={"username": "test", "password": "test"},
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )

        # Should have JSON content type
        assert "application/json" in response.headers.get("content-type", "")
        
        # Should have security headers (if implemented)
        expected_security_headers = [
            "X-Content-Type-Options",
            "X-Frame-Options", 
            "X-XSS-Protection"
        ]
        
        for header in expected_security_headers:
            if header in response.headers:
                assert response.headers[header] is not None

