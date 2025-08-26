from typing import Optional
from domain.repositories.bnb import BnbRepository
from application.dto.bnb import StListingRead
from shared.exceptions.bnb import ListingNotFoundError

class GetListingUseCase:
    def __init__(self, bnb_repository: BnbRepository):
        self._bnb_repository = bnb_repository
    
    async def execute(self, listing_id: int) -> StListingRead:
        listing = await self._bnb_repository.get_by_id(listing_id)
        
        if not listing:
            raise ListingNotFoundError(f"Listing with ID {listing_id} not found")
        
        return StListingRead(
            id=listing.id,
            host_id=listing.host_id,
            title=listing.title,
            type=listing.listing_type,
            capacity=listing.capacity,
            nightly_price=listing.nightly_price.amount,
            address=listing.address,
            amenities=listing.amenities,
            rules=listing.rules,
            instant_book=listing.instant_book,
            min_nights=listing.min_nights,
            max_nights=listing.max_nights,
            created_at=listing.created_at,
            updated_at=listing.updated_at,
            # Additional fields with defaults
            bedrooms=None,
            beds=None,
            baths=None,
            cleaning_fee=None,
            service_fee=None,
            security_deposit=None,
            latitude=None,
            longitude=None,
            cancellation_policy="MODERATE",
            images=None
        )
