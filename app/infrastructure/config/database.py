from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base

from .config import settings

engine = create_async_engine(settings.DATABASE_URL, echo=True)

# Primary async session maker with improved configuration
AsyncSessionLocal = async_sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False,  # Prevent automatic expiration of objects
    class_=AsyncSession,
)

Base = declarative_base()

# ---------------------------------------------------------------------------
# Backwards-compatibility alias (legacy imports expect `async_session_maker`)
# ---------------------------------------------------------------------------
# NOTE: New code should prefer `AsyncSessionLocal`. This alias is provided
# only to avoid widespread refactors while maintaining a single source of
# truth for the session factory.
async_session_maker = AsyncSessionLocal

async def get_async_session():
    """Get an async database session."""
    async with AsyncSessionLocal() as session:
        yield session

async def get_db():
    """Get async database session (legacy function)."""
    async with AsyncSessionLocal() as session:
        yield session
