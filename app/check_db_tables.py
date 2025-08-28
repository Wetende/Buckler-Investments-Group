#!/usr/bin/env python3
"""Check database tables"""
import asyncio
from sqlalchemy import text
from infrastructure.config.database import get_async_session

async def check_database_tables():
    """Check what tables exist in the database"""
    try:
        async for session in get_async_session():
            # Check available tables
            result = await session.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name
            """))
            tables = [row[0] for row in result.fetchall()]
            print(f"Available tables ({len(tables)}):")
            for table in tables:
                print(f"  {table}")
            
            break
            
    except Exception as e:
        print(f"Database error: {e}")

if __name__ == "__main__":
    asyncio.run(check_database_tables())

