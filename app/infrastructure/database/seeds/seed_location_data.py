"""
Data seeding script to populate county/town data for existing BnB listings.
This enables immediate location-based grouping functionality.
"""

import asyncio
import re
import sys
from pathlib import Path
from typing import Dict, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

# Add the app root to the path
app_root = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(app_root))

from infrastructure.config.database import AsyncSessionLocal
from infrastructure.database.models.bnb_listing import StListing

# Kenyan location mapping based on common address patterns
KENYAN_LOCATION_MAP = {
    # Counties and their common towns/areas
    'nairobi': {
        'county': 'Nairobi',
        'towns': ['westlands', 'karen', 'kilimani', 'lavington', 'kileleshwa', 'runda', 'muthaiga', 'ngong', 'kasarani', 'embakasi']
    },
    'mombasa': {
        'county': 'Mombasa',
        'towns': ['nyali', 'diani', 'bamburi', 'kilifi', 'malindi', 'watamu', 'likoni']
    },
    'kiambu': {
        'county': 'Kiambu',
        'towns': ['thika', 'ruiru', 'juja', 'limuru', 'kikuyu', 'karuri']
    },
    'nakuru': {
        'county': 'Nakuru',
        'towns': ['elementaita', 'naivasha', 'gilgil', 'molo', 'njoro']
    },
    'kakamega': {
        'county': 'Kakamega',
        'towns': ['mumias', 'butere', 'lugari', 'shinyalu']
    },
    'machakos': {
        'county': 'Machakos',
        'towns': ['athi river', 'mavoko', 'kangundo', 'yatta']
    },
    'kajiado': {
        'county': 'Kajiado',
        'towns': ['ongata rongai', 'kitengela', 'ngong', 'bissil']
    },
    'kwale': {
        'county': 'Kwale',
        'towns': ['diani', 'ukunda', 'shimoni', 'lunga lunga']
    },
    'uasin gishu': {
        'county': 'Uasin Gishu',
        'towns': ['eldoret', 'moiben', 'ainabkoi', 'kesses']
    },
    'kisumu': {
        'county': 'Kisumu',
        'towns': ['maseno', 'ahero', 'muhoroni', 'kondele']
    }
}

def parse_location_from_address(address: str) -> Tuple[Optional[str], Optional[str]]:
    """
    Parse county and town from address string.
    
    Returns:
        Tuple of (county, town) or (None, None) if not found
    """
    if not address:
        return None, None
    
    address_lower = address.lower()
    
    # First, try to find exact county/town matches
    for county_key, county_data in KENYAN_LOCATION_MAP.items():
        county_name = county_data['county']
        
        # Check if county name is in address
        if county_key in address_lower or county_name.lower() in address_lower:
            # Found county, now look for specific town
            for town in county_data['towns']:
                if town in address_lower:
                    return county_name, town.title()
            
            # County found but no specific town
            return county_name, None
    
    # If no county found, check for standalone towns
    for county_key, county_data in KENYAN_LOCATION_MAP.items():
        for town in county_data['towns']:
            if town in address_lower:
                return county_data['county'], town.title()
    
    return None, None

def extract_coordinates_from_address(address: str) -> Tuple[Optional[float], Optional[float]]:
    """
    Extract GPS coordinates if present in address.
    Basic implementation for demonstration.
    """
    # Look for coordinate patterns like "lat: -1.2345, lng: 36.7890"
    coord_pattern = r'lat[:\s]*(-?\d+\.?\d*)[,\s]*lng[:\s]*(-?\d+\.?\d*)'
    match = re.search(coord_pattern, address.lower())
    
    if match:
        try:
            lat = float(match.group(1))
            lng = float(match.group(2))
            # Validate Kenya bounds approximately
            if -4.7 <= lat <= 5.0 and 33.9 <= lng <= 41.9:
                return lat, lng
        except ValueError:
            pass
    
    return None, None

async def seed_location_data():
    """
    Main seeding function to populate location data for existing listings.
    """
    print("🌍 Starting location data seeding for BnB listings...")
    
    async with AsyncSessionLocal() as session:
        # Get all listings that don't have county data
        stmt = select(StListing).where(
            StListing.county.is_(None) | (StListing.county == '')
        )
        result = await session.execute(stmt)
        listings = result.scalars().all()
        
        print(f"📊 Found {len(listings)} listings without location data")
        
        updated_count = 0
        failed_count = 0
        
        for listing in listings:
            try:
                # Parse location from address
                county, town = parse_location_from_address(listing.address)
                
                # Extract coordinates if available
                if not listing.latitude or not listing.longitude:
                    lat, lng = extract_coordinates_from_address(listing.address)
                else:
                    lat, lng = listing.latitude, listing.longitude
                
                # Update listing if we found location data
                if county:
                    await session.execute(
                        update(StListing)
                        .where(StListing.id == listing.id)
                        .values(
                            county=county,
                            town=town,
                            latitude=lat if lat else listing.latitude,
                            longitude=lng if lng else listing.longitude
                        )
                    )
                    updated_count += 1
                    print(f"✅ Updated listing {listing.id}: {county}" + (f", {town}" if town else ""))
                else:
                    failed_count += 1
                    print(f"❌ Could not parse location for listing {listing.id}: {listing.address[:50]}...")
                    
            except Exception as e:
                failed_count += 1
                print(f"❌ Error processing listing {listing.id}: {e}")
        
        # Commit all changes
        await session.commit()
        
        print(f"\n🎉 Location seeding completed!")
        print(f"✅ Updated: {updated_count} listings")
        print(f"❌ Failed: {failed_count} listings")
        print(f"📈 Success rate: {(updated_count / len(listings) * 100):.1f}%")

async def add_sample_listings_with_locations():
    """
    Add sample listings with proper location data for demonstration.
    """
    print("🏠 Adding sample listings with location data...")
    
    sample_listings = [
        {
            'host_id': 1,
            'title': 'Cozy Apartment in Westlands',
            'type': 'APARTMENT',
            'capacity': 2,
            'nightly_price': 3500.00,
            'address': 'Westlands, Nairobi, Kenya',
            'county': 'Nairobi',
            'town': 'Westlands',
            'latitude': -1.2676,
            'longitude': 36.8108
        },
        {
            'host_id': 1,
            'title': 'Beach Villa in Diani',
            'type': 'VILLA',
            'capacity': 6,
            'nightly_price': 8500.00,
            'address': 'Diani Beach, Kwale, Kenya',
            'county': 'Kwale',
            'town': 'Diani',
            'latitude': -4.3297,
            'longitude': 39.5816
        },
        {
            'host_id': 1,
            'title': 'Safari Lodge in Nakuru',
            'type': 'LODGE',
            'capacity': 4,
            'nightly_price': 6200.00,
            'address': 'Lake Nakuru, Nakuru County, Kenya',
            'county': 'Nakuru',
            'town': 'Nakuru',
            'latitude': -0.3031,
            'longitude': 36.0800
        },
        {
            'host_id': 1,
            'title': 'Modern Studio in Kiambu',
            'type': 'STUDIO',
            'capacity': 2,
            'nightly_price': 2800.00,
            'address': 'Thika Road, Kiambu, Kenya',
            'county': 'Kiambu',
            'town': 'Thika',
            'latitude': -1.0332,
            'longitude': 37.0799
        },
        {
            'host_id': 1,
            'title': 'Luxury Resort in Mombasa',
            'type': 'RESORT',
            'capacity': 8,
            'nightly_price': 12000.00,
            'address': 'Nyali Beach, Mombasa, Kenya',
            'county': 'Mombasa',
            'town': 'Nyali',
            'latitude': -4.0435,
            'longitude': 39.7348
        }
    ]
    
    async with AsyncSessionLocal() as session:
        for listing_data in sample_listings:
            listing = StListing(**listing_data)
            session.add(listing)
            print(f"➕ Added sample listing: {listing_data['title']}")
        
        await session.commit()
        print(f"✅ Added {len(sample_listings)} sample listings with location data")

if __name__ == "__main__":
    async def main():
        print("🚀 Starting BnB location data seeding...")
        
        # Seed existing listings
        await seed_location_data()
        
        # Add sample listings
        await add_sample_listings_with_locations()
        
        print("\n🎯 All done! Your BnB platform now has location-based grouping data.")
        print("🏠 You can now test the location grouping endpoints:")
        print("   - GET /api/v1/bnb/listings/grouped-by-location")
        print("   - GET /api/v1/bnb/listings/by-county/Nairobi")
        print("   - GET /api/v1/bnb/listings/by-town/Westlands")
    
    asyncio.run(main())
