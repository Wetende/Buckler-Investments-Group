#!/usr/bin/env python3
"""
Setup script for BnB location-based grouping feature.
Runs migration and seeds location data.
"""

import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from infrastructure.database.seeds.seed_location_data import seed_location_data, add_sample_listings_with_locations
from alembic.config import Config
from alembic import command

async def main():
    print("🚀 Setting up BnB Location-Based Grouping Feature")
    print("=" * 50)
    
    # Run Alembic migration
    print("📦 Running database migration...")
    try:
        alembic_cfg = Config("infrastructure/database/alembic.ini")
        command.upgrade(alembic_cfg, "head")
        print("✅ Migration completed successfully")
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return
    
    # Seed location data
    print("\n🌍 Seeding location data...")
    try:
        await seed_location_data()
        await add_sample_listings_with_locations()
        print("✅ Location data seeding completed")
    except Exception as e:
        print(f"❌ Seeding failed: {e}")
        return
    
    print("\n🎉 Setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Start your backend server: `uvicorn main:app --reload`")
    print("2. Test the new endpoints:")
    print("   - GET /api/v1/bnb/listings/grouped-by-location")
    print("   - GET /api/v1/bnb/listings/by-county/Nairobi")
    print("   - GET /api/v1/bnb/listings/by-town/Westlands")
    print("3. Your frontend now displays Airbnb-style location grouping!")

if __name__ == "__main__":
    asyncio.run(main())
