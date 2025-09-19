from typing import List, Dict
from collections import defaultdict
from domain.repositories.bnb import BnbRepository
from application.dto.bnb import (
    LocationGroupedListingsResponse, 
    LocationGroupingResponse, 
    StListingRead
)

class GetListingsGroupedByLocationUseCase:
    """
    Use case for getting BnB listings grouped by location (Airbnb-style homepage)
    Groups listings by county and town for geographic display sections.
    """
    
    def __init__(self, bnb_repository: BnbRepository):
        self._bnb_repository = bnb_repository

    async def execute(self, limit_per_group: int = 4, max_groups: int = 6) -> LocationGroupedListingsResponse:
        """
        Execute location-based grouping similar to Airbnb's homepage.
        
        Groups like:
        - "Popular homes in Mombasa" 
        - "Available in Kiambu this weekend"
        - "Stay in Nakuru County"
        """
        # Get all listings with location data
        all_listings = await self._bnb_repository.list_with_location(limit=200)
        
        # Group listings by location hierarchy
        location_groups = defaultdict(list)
        location_counts = defaultdict(int)
        
        for listing in all_listings:
            # Primary grouping by county
            if listing.county:
                county_key = listing.county
                location_groups[county_key].append(listing)
                location_counts[county_key] += 1
                
                # Secondary grouping by town within county  
                if listing.town:
                    town_key = f"{listing.town}, {listing.county}"
                    if len(location_groups[town_key]) < limit_per_group:
                        location_groups[town_key].append(listing)
                        location_counts[town_key] += 1

        # Create response groups sorted by popularity (listing count)
        sorted_locations = sorted(location_counts.items(), key=lambda x: x[1], reverse=True)
        groups = []
        
        for location_name, count in sorted_locations[:max_groups]:
            sample_listings = location_groups[location_name][:limit_per_group]
            
            # Parse county and town from location name
            if ", " in location_name:
                town, county = location_name.split(", ", 1)
            else:
                county = location_name
                town = None
            
            # Convert entities to DTOs
            listing_dtos = [
                StListingRead(
                    id=listing.id,
                    host_id=listing.host_id,
                    title=listing.title,
                    type=listing.listing_type,
                    capacity=listing.capacity,
                    nightly_price=listing.nightly_price.amount,
                    address=listing.address,
                    county=listing.county,
                    town=listing.town,
                    area_id=listing.area_id,
                    latitude=getattr(listing, 'latitude', None),
                    longitude=getattr(listing, 'longitude', None),
                    amenities=listing.amenities,
                    rules=listing.rules,
                    instant_book=listing.instant_book,
                    min_nights=listing.min_nights,
                    max_nights=listing.max_nights,
                    created_at=listing.created_at,
                    updated_at=listing.updated_at,
                    # Default values for optional fields
                    bedrooms=None,
                    beds=None,
                    baths=None,
                    cleaning_fee=None,
                    service_fee=None,
                    security_deposit=None,
                    cancellation_policy="MODERATE",
                    images=None
                )
                for listing in sample_listings
            ]
            
            groups.append(LocationGroupingResponse(
                county=county,
                town=town,
                listing_count=count,
                sample_listings=listing_dtos
            ))

        # Get popular location names for suggested searches
        popular_locations = [group.county for group in groups[:5]]
        
        return LocationGroupedListingsResponse(
            groups=groups,
            popular_locations=popular_locations,
            total_listings=len(all_listings)
        )
