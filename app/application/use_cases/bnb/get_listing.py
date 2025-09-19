from typing import Optional
from datetime import datetime
from domain.repositories.bnb import BnbRepository
from domain.value_objects.booking_status import CancellationPolicy
from application.dto.bnb import StListingRead, HostInfoDTO
from shared.exceptions.bnb import ListingNotFoundError

class GetListingUseCase:
    def __init__(self, bnb_repository: BnbRepository):
        self._bnb_repository = bnb_repository
    
    async def execute(self, listing_id: int) -> StListingRead:
        # Get listing with host information
        listing, host_info = await self._bnb_repository.get_with_host(listing_id)
        
        if not listing:
            raise ListingNotFoundError(f"Listing with ID {listing_id} not found")
        
        # Create host DTO if host information is available
        host_dto = None
        if host_info and host_info.get('id'):
            host_dto = HostInfoDTO(
                id=host_info['id'],
                full_name=host_info.get('full_name', ''),
                phone_number=host_info.get('phone_number'),
                email=host_info.get('email')
            )
        
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
            created_at=listing.created_at or datetime.now(),
            updated_at=listing.updated_at or datetime.now(),
            host=host_dto,  # Include host information
            # Additional fields with defaults
            bedrooms=None,
            beds=None,
            baths=None,
            cleaning_fee=None,
            service_fee=None,
            security_deposit=None,
            latitude=None,
            longitude=None,
            cancellation_policy=listing.cancellation_policy or CancellationPolicy.MODERATE,
            images=None
        )
