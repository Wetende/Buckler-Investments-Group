"""
Integration tests for user registration flow.

Tests the complete user registration process from API to database.
"""
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from infrastructure.database.models.user import User
from infrastructure.config.database import get_async_session
from api.main import app


class TestUserRegistrationIntegration:
    """Integration tests for user registration covering the full flow."""

    @pytest.fixture
    async def test_client(self):
        """HTTP client for testing API endpoints."""
        async with AsyncClient(app=app, base_url="http://testserver") as client:
            yield client

    @pytest.fixture
    async def db_session(self):
        """Database session for verification."""
        async for session in get_async_session():
            yield session
            # Cleanup after test
            await session.rollback()

    @pytest.mark.asyncio
    async def test_user_registration_complete_flow_creates_user_in_database(
        self, test_client, db_session
    ):
        """Test complete user registration flow creates user in database."""
        # Arrange
        registration_data = {
            "email": "integration.test@example.com",
            "password": "SecurePassword123!",
            "first_name": "Integration",
            "last_name": "Test",
            "phone_number": "+254712345678"
        }

        # Act - Register user via API
        response = await test_client.post("/api/v1/shared/users/", json=registration_data)

        # Assert API response
        assert response.status_code == 201
        response_data = response.json()
        assert response_data["email"] == "integration.test@example.com"
        assert response_data["first_name"] == "Integration"
        assert response_data["last_name"] == "Test"
        assert response_data["is_active"] is True
        assert "id" in response_data
        assert response_data["id"] > 0

        # Verify user was created in database
        user_id = response_data["id"]
        stmt = select(User).where(User.id == user_id)
        result = await db_session.execute(stmt)
        db_user = result.scalar_one_or_none()

        assert db_user is not None
        assert db_user.email == "integration.test@example.com"
        assert db_user.name == "Integration Test"  # Assuming name field combines first+last
        assert db_user.is_active is True
        assert db_user.hashed_password is not None
        assert db_user.hashed_password != "SecurePassword123!"  # Should be hashed

    @pytest.mark.asyncio
    async def test_user_registration_with_duplicate_email_returns_400_error(
        self, test_client
    ):
        """Test registering with duplicate email returns 400 error."""
        # Arrange
        registration_data = {
            "email": "duplicate.test@example.com",
            "password": "SecurePassword123!",
            "first_name": "First",
            "last_name": "User"
        }

        # Act - Register first user
        first_response = await test_client.post("/api/v1/shared/users/", json=registration_data)
        assert first_response.status_code == 201

        # Act - Try to register second user with same email
        second_response = await test_client.post("/api/v1/shared/users/", json=registration_data)

        # Assert
        assert second_response.status_code == 400
        error_data = second_response.json()
        assert "already exists" in error_data["detail"].lower()

    @pytest.mark.asyncio
    async def test_user_registration_with_invalid_email_returns_422_validation_error(
        self, test_client
    ):
        """Test registration with invalid email format returns validation error."""
        # Arrange
        registration_data = {
            "email": "invalid-email-format",  # Invalid email
            "password": "SecurePassword123!",
            "first_name": "Test",
            "last_name": "User"
        }

        # Act
        response = await test_client.post("/api/v1/shared/users/", json=registration_data)

        # Assert
        assert response.status_code == 422
        error_data = response.json()
        assert "detail" in error_data
        # Check that email validation error is mentioned
        assert any("email" in str(error).lower() for error in error_data["detail"])

    @pytest.mark.asyncio
    async def test_user_registration_with_missing_required_fields_returns_422_error(
        self, test_client
    ):
        """Test registration with missing required fields returns validation error."""
        # Arrange - Missing password field
        incomplete_data = {
            "email": "test@example.com",
            "first_name": "Test",
            "last_name": "User"
            # Missing password
        }

        # Act
        response = await test_client.post("/api/v1/shared/users/", json=incomplete_data)

        # Assert
        assert response.status_code == 422
        error_data = response.json()
        assert "detail" in error_data

    @pytest.mark.asyncio
    async def test_user_registration_password_is_properly_hashed(
        self, test_client, db_session
    ):
        """Test that user password is properly hashed and not stored in plain text."""
        # Arrange
        registration_data = {
            "email": "hash.test@example.com",
            "password": "PlainTextPassword123!",
            "first_name": "Hash",
            "last_name": "Test"
        }

        # Act
        response = await test_client.post("/api/v1/shared/users/", json=registration_data)

        # Assert
        assert response.status_code == 201
        user_id = response.json()["id"]

        # Verify password is hashed in database
        stmt = select(User).where(User.id == user_id)
        result = await db_session.execute(stmt)
        db_user = result.scalar_one_or_none()

        assert db_user.hashed_password != "PlainTextPassword123!"
        assert db_user.hashed_password.startswith("$2b$")  # bcrypt hash format
        assert len(db_user.hashed_password) > 50  # Proper hash length

    @pytest.mark.asyncio
    async def test_user_registration_optional_phone_number_handling(
        self, test_client, db_session
    ):
        """Test user registration handles optional phone number correctly."""
        # Test with phone number
        registration_with_phone = {
            "email": "phone.test@example.com",
            "password": "SecurePassword123!",
            "first_name": "Phone",
            "last_name": "Test",
            "phone_number": "+254712345678"
        }

        response = await test_client.post("/api/v1/shared/users/", json=registration_with_phone)
        assert response.status_code == 201

        # Test without phone number
        registration_without_phone = {
            "email": "nophone.test@example.com",
            "password": "SecurePassword123!",
            "first_name": "NoPhone",
            "last_name": "Test"
        }

        response = await test_client.post("/api/v1/shared/users/", json=registration_without_phone)
        assert response.status_code == 201

    @pytest.mark.asyncio
    async def test_user_registration_response_does_not_include_password(
        self, test_client
    ):
        """Test that registration response does not include password or hashed password."""
        # Arrange
        registration_data = {
            "email": "secure.test@example.com",
            "password": "SecurePassword123!",
            "first_name": "Secure",
            "last_name": "Test"
        }

        # Act
        response = await test_client.post("/api/v1/shared/users/", json=registration_data)

        # Assert
        assert response.status_code == 201
        response_data = response.json()
        
        # Ensure no password fields are in response
        assert "password" not in response_data
        assert "hashed_password" not in response_data
        
        # Ensure expected fields are present
        assert "id" in response_data
        assert "email" in response_data
        assert "first_name" in response_data
        assert "last_name" in response_data
        assert "is_active" in response_data

    @pytest.mark.asyncio
    async def test_user_registration_sets_default_user_role(
        self, test_client, db_session
    ):
        """Test that newly registered users get default USER role."""
        # Arrange
        registration_data = {
            "email": "role.test@example.com",
            "password": "SecurePassword123!",
            "first_name": "Role",
            "last_name": "Test"
        }

        # Act
        response = await test_client.post("/api/v1/shared/users/", json=registration_data)

        # Assert
        assert response.status_code == 201
        user_id = response.json()["id"]

        # Verify default role in database
        stmt = select(User).where(User.id == user_id)
        result = await db_session.execute(stmt)
        db_user = result.scalar_one_or_none()

        # Assuming default role is USER
        assert db_user.role.value == "USER" or db_user.role == "USER"

