"""
Unit tests for CreateUserUseCase.

Tests business logic without external dependencies.
"""
import pytest
from unittest.mock import Mock, AsyncMock
from datetime import datetime

from application.use_cases.user.create_user import CreateUserUseCase
from application.dto.user import UserCreateDTO, UserResponseDTO
from domain.entities.user import User, UserRole
from domain.repositories.user import UserRepository
from domain.services.password_service import PasswordService
from shared.exceptions.user import UserAlreadyExistsError


class TestCreateUserUseCase:
    """Test suite for CreateUserUseCase following our testing standards."""

    @pytest.fixture
    def mock_user_repository(self):
        """Mock user repository for testing."""
        return Mock(spec=UserRepository)

    @pytest.fixture
    def mock_password_service(self):
        """Mock password service for testing."""
        mock_service = Mock(spec=PasswordService)
        mock_service.hash_password.return_value = "hashed_password_123"
        return mock_service

    @pytest.fixture
    def create_user_use_case(self, mock_user_repository, mock_password_service):
        """Create use case instance with mocked dependencies."""
        return CreateUserUseCase(mock_user_repository, mock_password_service)

    @pytest.fixture
    def valid_user_create_dto(self):
        """Valid user creation data."""
        return UserCreateDTO(
            email="john.doe@example.com",
            password="SecurePassword123!",
            name="John Doe",
            phone="+254712345678"
        )

    @pytest.mark.asyncio
    async def test_create_user_success_returns_user_response_dto(
        self, 
        create_user_use_case, 
        mock_user_repository, 
        mock_password_service,
        valid_user_create_dto
    ):
        """Test successful user creation returns proper response DTO."""
        # Arrange
        mock_user_repository.get_by_email.return_value = None  # No existing user
        
        created_user = User(
            id=123,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            email="john.doe@example.com",
            hashed_password="hashed_password_123",
            full_name="John Doe",
            is_active=True,
            role=UserRole.USER
        )
        created_user.created_at = datetime(2024, 1, 15, 10, 30, 0)
        
        mock_user_repository.create.return_value = created_user

        # Act
        result = await create_user_use_case.execute(valid_user_create_dto)

        # Assert
        assert isinstance(result, UserResponseDTO)
        assert result.id == 123
        assert result.email == "john.doe@example.com"
        assert result.name == "John Doe"
        assert result.is_active is True
        assert result.role == UserRole.USER
        
        # Verify password was hashed
        mock_password_service.hash_password.assert_called_once_with("SecurePassword123!")
        
        # Verify repository interactions
        mock_user_repository.get_by_email.assert_called_once_with("john.doe@example.com")
        mock_user_repository.create.assert_called_once()

    @pytest.mark.asyncio
    async def test_create_user_with_existing_email_raises_user_already_exists_error(
        self,
        create_user_use_case,
        mock_user_repository,
        valid_user_create_dto
    ):
        """Test creating user with existing email raises UserAlreadyExistsError."""
        # Arrange
        existing_user = User(
            id=456,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            email="john.doe@example.com",
            hashed_password="existing_hash",
            full_name="Existing User",
            is_active=True,
            role=UserRole.USER
        )
        mock_user_repository.get_by_email.return_value = existing_user

        # Act & Assert
        with pytest.raises(UserAlreadyExistsError) as exc_info:
            await create_user_use_case.execute(valid_user_create_dto)
        
        assert "john.doe@example.com" in str(exc_info.value)
        
        # Verify repository was checked but create was not called
        mock_user_repository.get_by_email.assert_called_once_with("john.doe@example.com")
        mock_user_repository.create.assert_not_called()

    @pytest.mark.asyncio
    async def test_create_user_calls_password_service_with_correct_password(
        self,
        create_user_use_case,
        mock_user_repository,
        mock_password_service,
        valid_user_create_dto
    ):
        """Test that password service is called with the correct plain text password."""
        # Arrange
        mock_user_repository.get_by_email.return_value = None
        mock_user_repository.create.return_value = User(
            id=1,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            email="john.doe@example.com",
            hashed_password="hashed_password_123",
            full_name="John Doe",
            is_active=True,
            role=UserRole.USER
        )

        # Act
        await create_user_use_case.execute(valid_user_create_dto)

        # Assert
        mock_password_service.hash_password.assert_called_once_with("SecurePassword123!")

    @pytest.mark.asyncio
    async def test_create_user_creates_user_entity_with_correct_attributes(
        self,
        create_user_use_case,
        mock_user_repository,
        mock_password_service,
        valid_user_create_dto
    ):
        """Test that User entity is created with correct attributes."""
        # Arrange
        mock_user_repository.get_by_email.return_value = None
        
                # Capture the User entity passed to create()
        captured_user_entity = None

        def capture_user_entity(user):
            nonlocal captured_user_entity
            # Create a copy of the user before modifying it
            import copy
            captured_user_entity = copy.deepcopy(user)
            # Simulate repository assigning an ID and returning the user
            user.id = 789
            return user

        mock_user_repository.create.side_effect = capture_user_entity

        # Mock the returned user entity
        returned_user = User(
            id=789,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            email="john.doe@example.com",
            hashed_password="hashed_password_123",
            full_name="John Doe",
            is_active=True,
            role=UserRole.USER
        )
        mock_user_repository.create.return_value = returned_user

        # Act
        result = await create_user_use_case.execute(valid_user_create_dto)

        # Assert
        assert captured_user_entity is not None
        assert captured_user_entity.id == 0  # Should be 0 when passed to repository
        assert captured_user_entity.email == "john.doe@example.com"
        assert captured_user_entity.hashed_password == "hashed_password_123"
        assert captured_user_entity.full_name == "John Doe"
        assert captured_user_entity.is_active is True
        assert captured_user_entity.role == UserRole.USER

    @pytest.mark.asyncio
    async def test_create_user_handles_optional_phone_number(
        self,
        create_user_use_case,
        mock_user_repository,
        mock_password_service
    ):
        """Test user creation works with and without phone number."""
        # Arrange - user without phone number
        user_dto_no_phone = UserCreateDTO(
            email="jane.doe@example.com",
            password="SecurePassword123!",
            name="Jane Doe",
            phone=None
        )
        
        mock_user_repository.get_by_email.return_value = None
        mock_user_repository.create.return_value = User(
            id=1,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            email="jane.doe@example.com",
            hashed_password="hashed_password_123",
            full_name="Jane Doe",
            is_active=True,
            role=UserRole.USER
        )

        # Act
        result = await create_user_use_case.execute(user_dto_no_phone)

        # Assert
        assert result.name == "Jane Doe"
        assert result.email == "jane.doe@example.com"
        # phone_number should be None in the DTO but not break the flow

    @pytest.mark.asyncio
    async def test_create_user_preserves_email_case(
        self,
        create_user_use_case,
        mock_user_repository,
        mock_password_service
    ):
        """Test that email case is preserved during user creation."""
        # Arrange
        user_dto = UserCreateDTO(
            email="John.DOE@Example.COM",
            password="SecurePassword123!",
            name="John Doe"
        )
        
        mock_user_repository.get_by_email.return_value = None
        mock_user_repository.create.return_value = User(
            id=1,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            email="John.DOE@example.com",  # Normalized by EmailStr
            hashed_password="hashed_password_123",
            full_name="John Doe",
            is_active=True,
            role=UserRole.USER
        )

        # Act
        result = await create_user_use_case.execute(user_dto)

        # Assert
        assert result.email == "John.DOE@example.com"  # EmailStr normalizes domain to lowercase
        mock_user_repository.get_by_email.assert_called_once_with("John.DOE@example.com")

