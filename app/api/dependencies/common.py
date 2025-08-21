from typing import AsyncIterator, Optional

from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from infrastructure.config.config import settings
from infrastructure.config.database import get_async_session


def get_settings():
    return settings


async def get_db_session() -> AsyncIterator[AsyncSession]:
    async for session in get_async_session():
        yield session


async def get_current_user(token: Optional[str] = None):
    # TODO: replace with real auth; placeholder for wiring completeness
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    return {"id": 0, "role": "anonymous"}
