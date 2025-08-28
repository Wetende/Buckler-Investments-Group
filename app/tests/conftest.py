"""
Pytest configuration and shared fixtures for authentication tests.

This file provides common fixtures and test setup for all test modules.
"""
import pytest
import asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from unittest.mock import Mock

from api.main import app
from infrastructure.config.database import Base
from domain.entities.user import User
from shared.constants.user_roles import UserRole


# Test database URL - use PostgreSQL like production
import os
TEST_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://user:pass@localhost/test_db")


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
async def test_db_engine():
    """Create test database engine."""
    engine = create_async_engine(TEST_DATABASE_URL, echo=True)
    
    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    yield engine
    
    # Cleanup
    await engine.dispose()


@pytest.fixture
async def test_db_session(test_db_engine):
    """Create test database session."""
    async_session = sessionmaker(
        test_db_engine, class_=AsyncSession, expire_on_commit=False
    )
    
    async with async_session() as session:
        yield session


@pytest.fixture
async def test_client():
    """Create test HTTP client."""
    async with AsyncClient(app=app, base_url="http://testserver") as client:
        yield client


@pytest.fixture
def sample_user_data():
    """Sample user data for testing."""
    return {
        "email": "test.user@example.com",
        "password": "SecurePassword123!",
        "first_name": "Test",
        "last_name": "User",
        "phone_number": "+254712345678"
    }


@pytest.fixture
def sample_user_entity():
    """Sample user entity for testing."""
    return User(
        id=1,
        email="test.user@example.com",
        hashed_password="$2b$12$hashed_password_example",
        full_name="Test User",
        is_active=True,
        role=UserRole.USER
    )


@pytest.fixture
def mock_user_repository():
    """Mock user repository for unit tests."""
    from domain.repositories.user import UserRepository
    return Mock(spec=UserRepository)


@pytest.fixture
def mock_password_service():
    """Mock password service for unit tests."""
    from domain.services.password_service import PasswordService
    mock_service = Mock(spec=PasswordService)
    mock_service.hash_password.return_value = "$2b$12$mocked_hash"
    mock_service.verify_password.return_value = True
    return mock_service


# Pytest configuration
def pytest_configure(config):
    """Configure pytest with custom markers."""
    config.addinivalue_line(
        "markers", "asyncio: mark test as async"
    )
    config.addinivalue_line(
        "markers", "integration: mark test as integration test"
    )
    config.addinivalue_line(
        "markers", "security: mark test as security test"
    )


# Skip integration tests if no database is available
def pytest_collection_modifyitems(config, items):
    """Modify test collection to handle integration tests."""
    import os
    
    # Skip integration tests if SKIP_INTEGRATION_TESTS is set
    if os.getenv("SKIP_INTEGRATION_TESTS"):
        skip_integration = pytest.mark.skip(reason="Integration tests disabled")
        for item in items:
            if "integration" in item.keywords:
                item.add_marker(skip_integration)