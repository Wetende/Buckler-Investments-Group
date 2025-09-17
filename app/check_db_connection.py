#!/usr/bin/env python3
"""Minimal database connectivity check.

Uses the existing async session factory and runs a trivial SELECT 1.
"""
import asyncio
from sqlalchemy import text
from infrastructure.config.database import get_async_session


async def main() -> int:
    try:
        async for session in get_async_session():
            result = await session.execute(text("SELECT 1"))
            value = result.scalar_one()
            if value == 1:
                print("DB_OK")
                return 0
            print("DB_FAIL")
            return 2
    except Exception as exc:
        print(f"DB_ERROR: {exc}")
        return 1


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))



