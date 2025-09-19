from typing import List
from domain.repositories.bnb import BnbRepository
from application.dto.bnb import StListingRead

class GetListingsByLocationUseCase:
    """
    Use case for getting BnB listings filtered by specific location (county/town).
    Supports Airbnb-style location-based filtering.
    """
    
    def __init__(self, bnb_repository: BnbRepository):
        self._bnb_repository = bnb_repository

    async def execute(
        self, 
        county: str = None, 
        town: str = None,
        limit: int = 20, 
        offset: int = 0
    ) -> List[StListingRead]:
        """
        Get listings filtered by county and/or town.
        
        Args:
            county: Filter by county name (e.g., "Mombasa", "Nairobi")
            town: Filter by town name (e.g., "Kiambu", "Nakuru")
            limit: Maximum number of listings to return
            offset: Number of listings to skip (for pagination)
        """
        # Get listings filtered by location
        listings = await self._bnb_repository.list_by_location(
            county=county,
            town=town,
            limit=limit,
            offset=offset
        )
        
        # Convert entities to DTOs
        return [
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
            for listing in listings
        ]
