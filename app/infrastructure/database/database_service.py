"""Database service for managing sessions and transactions."""

from typing import TypeVar, Generic, Callable, Any
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import AsyncSession

from .config.database import AsyncSessionLocal

T = TypeVar('T')


class DatabaseService:
    """Service for managing database sessions and transactions."""

    @staticmethod
    @asynccontextmanager
    async def session_scope():
        """Provide a transactional scope around a series of operations."""
        session = AsyncSessionLocal()
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

    @classmethod
    async def execute_in_session(
        cls,
        operation: Callable[[AsyncSession], Any]
    ) -> Any:
        """Execute an operation within a managed session."""
        async with cls.session_scope() as session:
            return await operation(session)

    @classmethod
    async def execute_read_operation(
        cls,
        operation: Callable[[AsyncSession], T]
    ) -> T:
        """Execute a read-only operation within a managed session."""
        session = AsyncSessionLocal()
        try:
            return await operation(session)
        finally:
            await session.close()

