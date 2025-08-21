#!/usr/bin/env python3
"""Test database connection"""
import asyncio
import asyncpg
from infrastructure.config.config import settings

async def test_connection():
    try:
        print(f"Testing connection to: {settings.DATABASE_URL}")
        
        # Extract connection details from URL
        # postgresql+asyncpg://postgres:root@localhost:5432/property
        conn = await asyncpg.connect(
            host='localhost',
            port=5432,
            user='postgres',
            password='root',
            database='property'
        )
        
        print("✅ Database connection successful!")
        
        # Test a simple query
        result = await conn.fetchval('SELECT version()')
        print(f"PostgreSQL version: {result}")
        
        await conn.close()
        print("✅ Connection closed successfully!")
        
    except Exception as e:
        print(f"❌ Database connection failed: {e}")

if __name__ == "__main__":
    # Set Windows-compatible event loop policy
    if hasattr(asyncio, 'WindowsSelectorEventLoopPolicy'):
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    asyncio.run(test_connection())
