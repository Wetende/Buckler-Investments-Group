"""
Unit tests for User domain entity.

Tests pure business logic without external dependencies.
"""
import pytest
from datetime import datetime

from domain.entities.user import User, UserRole


class TestUserEntity:
    """Test suite for User domain entity business logic."""

    @pytest.fixture
    def basic_user_role(self):
        """Create a basic user role for testing."""
        return UserRole(name="user", permissions=["view_own_profile", "update_own_profile"])

    @pytest.fixture
    def agent_user_role(self):
        """Create an agent role for testing."""
        return UserRole(name="agent", permissions=["view_own_profile", "create_listings", "manage_listings"])

    @pytest.fixture
    def basic_user(self, basic_user_role):
        """Create a basic user for testing."""
        return User(
            id=1,
            email="test.user@example.com",
            hashed_password="hashed_password_123",
            full_name="Test User",
            is_active=True,
            roles=[basic_user_role]
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
            roles=[basic_user_role]
        )

        # Assert
        assert user.id == 123
        assert user.email == "john.doe@example.com"
        assert user.hashed_password == "hashed_password_456"
        assert user.full_name == "John Doe"
        assert user.is_active is True
        assert len(user.roles) == 1
        assert user.roles[0].name == "user"

    def test_user_creation_with_empty_roles_succeeds(self):
        """Test creating a user with empty roles list succeeds."""
        # Arrange & Act
        user = User(
            id=1,
            email="noroles@example.com",
            hashed_password="hash123",
            full_name="No Roles User",
            is_active=True,
            roles=[]
        )

        # Assert
        assert user.roles == []
        assert user.email == "noroles@example.com"

    def test_user_is_agent_returns_true_when_user_has_agent_role(self, agent_user_role):
        """Test is_agent() returns True when user has agent role."""
        # Arrange
        user = User(
            id=1,
            email="agent@example.com",
            hashed_password="hash123",
            full_name="Agent User",
            is_active=True,
            roles=[agent_user_role]
        )

        # Act & Assert
        assert user.is_agent() is True

    def test_user_is_agent_returns_false_when_user_has_no_agent_role(self, basic_user_role):
        """Test is_agent() returns False when user doesn't have agent role."""
        # Arrange
        user = User(
            id=1,
            email="user@example.com",
            hashed_password="hash123",
            full_name="Regular User",
            is_active=True,
            roles=[basic_user_role]
        )

        # Act & Assert
        assert user.is_agent() is False

    def test_user_is_agent_returns_false_when_user_has_no_roles(self):
        """Test is_agent() returns False when user has no roles."""
        # Arrange
        user = User(
            id=1,
            email="user@example.com",
            hashed_password="hash123",
            full_name="No Roles User",
            is_active=True,
            roles=[]
        )

        # Act & Assert
        assert user.is_agent() is False

    def test_user_is_agent_returns_true_with_multiple_roles_including_agent(
        self, basic_user_role, agent_user_role
    ):
        """Test is_agent() returns True when user has multiple roles including agent."""
        # Arrange
        user = User(
            id=1,
            email="multiuser@example.com",
            hashed_password="hash123",
            full_name="Multi Role User",
            is_active=True,
            roles=[basic_user_role, agent_user_role]
        )

        # Act & Assert
        assert user.is_agent() is True

    def test_user_full_name_can_be_none(self):
        """Test that user can be created with None full_name."""
        # Arrange & Act
        user = User(
            id=1,
            email="minimal@example.com",
            hashed_password="hash123",
            full_name=None,
            is_active=True,
            roles=[]
        )

        # Assert
        assert user.full_name is None
        assert user.email == "minimal@example.com"

    def test_user_active_status_can_be_false(self, basic_user_role):
        """Test that user can be created with is_active=False."""
        # Arrange & Act
        user = User(
            id=1,
            email="inactive@example.com",
            hashed_password="hash123",
            full_name="Inactive User",
            is_active=False,
            roles=[basic_user_role]
        )

        # Assert
        assert user.is_active is False
        assert user.email == "inactive@example.com"

    def test_user_email_preserves_case(self):
        """Test that user email preserves original case."""
        # Arrange & Act
        user = User(
            id=1,
            email="Test.User@Example.COM",
            hashed_password="hash123",
            full_name="Case Test User",
            is_active=True,
            roles=[]
        )

        # Assert
        assert user.email == "Test.User@Example.COM"

    def test_user_to_dict_contains_all_attributes(self, basic_user_role):
        """Test that to_dict() method includes all user attributes."""
        # Arrange
        user = User(
            id=123,
            email="dict.test@example.com",
            hashed_password="hash123",
            full_name="Dict Test User",
            is_active=True,
            roles=[basic_user_role]
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
        assert user_dict["roles"] == [basic_user_role]
        assert user_dict["created_at"] == datetime(2024, 1, 15, 10, 30, 0)
        assert user_dict["updated_at"] == datetime(2024, 1, 16, 11, 45, 0)

    def test_user_role_contains_permissions(self):
        """Test that UserRole properly stores permissions."""
        # Arrange & Act
        role = UserRole(
            name="test_role",
            permissions=["permission1", "permission2", "permission3"]
        )

        # Assert
        assert role.name == "test_role"
        assert len(role.permissions) == 3
        assert "permission1" in role.permissions
        assert "permission2" in role.permissions
        assert "permission3" in role.permissions

    def test_user_role_can_have_empty_permissions(self):
        """Test that UserRole can be created with empty permissions list."""
        # Arrange & Act
        role = UserRole(name="empty_role", permissions=[])

        # Assert
        assert role.name == "empty_role"
        assert role.permissions == []

    def test_user_equality_based_on_id(self, basic_user_role):
        """Test that user equality is based on ID (if implemented)."""
        # Arrange
        user1 = User(
            id=123,
            email="user1@example.com",
            hashed_password="hash1",
            full_name="User One",
            is_active=True,
            roles=[basic_user_role]
        )
        
        user2 = User(
            id=123,
            email="user2@example.com",  # Different email but same ID
            hashed_password="hash2",
            full_name="User Two",
            is_active=False,
            roles=[]
        )
        
        user3 = User(
            id=456,  # Different ID
            email="user1@example.com",
            hashed_password="hash1",
            full_name="User One",
            is_active=True,
            roles=[basic_user_role]
        )

        # Act & Assert
        # If equality is implemented based on ID
        if hasattr(user1, '__eq__'):
            assert user1 == user2  # Same ID
            assert user1 != user3  # Different ID
        else:
            # If no custom equality, they should be different objects
            assert user1 is not user2
