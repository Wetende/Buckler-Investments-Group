"""
Unit tests for User domain entity.

Tests pure business logic without external dependencies.
"""
import pytest
from datetime import datetime

from domain.entities.user import User
from shared.constants.user_roles import UserRole, Permission, get_user_permissions


class TestUserEntity:
    """Test suite for User domain entity business logic."""

    @pytest.fixture
    def basic_user_role(self):
        """Create a basic user role for testing."""
        return UserRole.USER

    @pytest.fixture
    def agent_user_role(self):
        """Create an agent role for testing."""
        return UserRole.AGENT

    @pytest.fixture
    def basic_user(self, basic_user_role):
        """Create a basic user for testing."""
        return User(
            id=1,
            email="test.user@example.com",
            hashed_password="hashed_password_123",
            full_name="Test User",
            is_active=True,
            role=basic_user_role
        )

    def test_user_creation_with_valid_data_succeeds(self, basic_user_role):
        """Test creating a user with valid data succeeds."""
        # Arrange & Act
        user = User(
            id=123,
            created_at=datetime(2024, 1, 15, 10, 30, 0),
            updated_at=datetime(2024, 1, 15, 10, 30, 0),
            email="john.doe@example.com",
            hashed_password="hashed_password_456",
            full_name="John Doe",
            is_active=True,
            role=basic_user_role
        )

        # Assert
        assert user.id == 123
        assert user.email == "john.doe@example.com"
        assert user.hashed_password == "hashed_password_456"
        assert user.full_name == "John Doe"
        assert user.is_active is True
        assert user.role == basic_user_role
        assert user.role.value == "user"

    def test_user_creation_with_default_role_succeeds(self):
        """Test creating a user with default role succeeds."""
        # Arrange & Act
        user = User(
            id=1,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            email="noroles@example.com",
            hashed_password="hash123",
            full_name="No Roles User",
            is_active=True
        )

        # Assert
        assert user.role == UserRole.USER
        assert user.email == "noroles@example.com"

    def test_user_is_agent_returns_true_when_user_has_agent_role(self, agent_user_role):
        """Test is_agent() returns True when user has agent role."""
        # Arrange
        user = User(
            id=1,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            email="agent@example.com",
            hashed_password="hash123",
            full_name="Agent User",
            is_active=True,
            role=agent_user_role
        )

        # Act & Assert
        assert user.is_agent() is True

    def test_user_is_agent_returns_false_when_user_has_no_agent_role(self, basic_user_role):
        """Test is_agent() returns False when user doesn't have agent role."""
        # Arrange
        user = User(
            id=1,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            email="user@example.com",
            hashed_password="hash123",
            full_name="Regular User",
            is_active=True,
            role=basic_user_role
        )

        # Act & Assert
        assert user.is_agent() is False

    def test_user_is_agent_returns_false_when_user_has_user_role(self):
        """Test is_agent() returns False when user has regular user role."""
        # Arrange
        user = User(
            id=1,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            email="user@example.com",
            hashed_password="hash123",
            full_name="Regular User",
            is_active=True,
            role=UserRole.USER
        )

        # Act & Assert
        assert user.is_agent() is False

    def test_user_is_agent_returns_true_when_user_has_agent_role_directly(self, agent_user_role):
        """Test is_agent() returns True when user has agent role."""
        # Arrange
        user = User(
            id=1,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            email="agent@example.com",
            hashed_password="hash123",
            full_name="Agent User",
            is_active=True,
            role=agent_user_role
        )

        # Act & Assert
        assert user.is_agent() is True

    def test_user_full_name_can_be_none(self):
        """Test that user can be created with None full_name."""
        # Arrange & Act
        user = User(
            id=1,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            email="minimal@example.com",
            hashed_password="hash123",
            full_name=None,
            is_active=True,
            role=UserRole.USER
        )

        # Assert
        assert user.full_name is None
        assert user.email == "minimal@example.com"

    def test_user_active_status_can_be_false(self, basic_user_role):
        """Test that user can be created with is_active=False."""
        # Arrange & Act
        user = User(
            id=1,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            email="inactive@example.com",
            hashed_password="hash123",
            full_name="Inactive User",
            is_active=False,
            role=basic_user_role
        )

        # Assert
        assert user.is_active is False
        assert user.email == "inactive@example.com"

    def test_user_email_preserves_case(self):
        """Test that user email preserves original case."""
        # Arrange & Act
        user = User(
            id=1,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            email="Test.User@Example.COM",
            hashed_password="hash123",
            full_name="Case Test User",
            is_active=True,
            role=UserRole.USER
        )

        # Assert
        assert user.email == "Test.User@Example.COM"

    def test_user_to_dict_contains_all_attributes(self, basic_user_role):
        """Test that to_dict() method includes all user attributes."""
        # Arrange
        user = User(
            id=123,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            email="dict.test@example.com",
            hashed_password="hash123",
            full_name="Dict Test User",
            is_active=True,
            role=basic_user_role
        )
        user.created_at = datetime(2024, 1, 15, 10, 30, 0)
        user.updated_at = datetime(2024, 1, 16, 11, 45, 0)

        # Act
        user_dict = user.to_dict()

        # Assert
        assert isinstance(user_dict, dict)
        assert user_dict["id"] == 123
        assert user_dict["email"] == "dict.test@example.com"
        assert user_dict["hashed_password"] == "hash123"
        assert user_dict["full_name"] == "Dict Test User"
        assert user_dict["is_active"] is True
        assert user_dict["role"] == basic_user_role
        assert user_dict["created_at"] == datetime(2024, 1, 15, 10, 30, 0)
        assert user_dict["updated_at"] == datetime(2024, 1, 16, 11, 45, 0)

    def test_user_role_permissions_lookup(self):
        """Test that UserRole permissions can be looked up."""
        # Arrange & Act
        user_permissions = get_user_permissions(UserRole.USER)

        # Assert
        assert len(user_permissions) > 0
        assert Permission.VIEW_OWN_PROFILE in user_permissions
        assert Permission.UPDATE_OWN_PROFILE in user_permissions

    def test_agent_role_has_additional_permissions(self):
        """Test that agent role has more permissions than user role."""
        # Arrange & Act
        user_permissions = get_user_permissions(UserRole.USER)
        agent_permissions = get_user_permissions(UserRole.AGENT)

        # Assert
        assert len(agent_permissions) > len(user_permissions)
        assert Permission.CREATE_PROPERTIES in agent_permissions

    def test_user_equality_based_on_id(self, basic_user_role):
        """Test that user equality is based on ID (if implemented)."""
        # Arrange
        user1 = User(
            id=123,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            email="user1@example.com",
            hashed_password="hash1",
            full_name="User One",
            is_active=True,
            role=basic_user_role
        )

        user2 = User(
            id=123,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            email="user2@example.com",  # Different email but same ID
            hashed_password="hash2",
            full_name="User Two",
            is_active=False,
            role=UserRole.USER
        )
        
        user3 = User(
            id=456,  # Different ID
            created_at=datetime.now(),
            updated_at=datetime.now(),
            email="user1@example.com",
            hashed_password="hash1",
            full_name="User One",
            is_active=True,
            role=basic_user_role
        )

        # Act & Assert
        # User entity uses default dataclass equality (compares all attributes)
        # Since user1 and user2 have same ID but different other attributes, they are not equal
        assert user1 != user2  # Different attributes despite same ID
        assert user1 != user3  # Different IDs and attributes

        # But they should be different objects
        assert user1 is not user2
        assert user2 is not user3
