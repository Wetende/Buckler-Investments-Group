from typing import Protocol
from domain.entities.bnb.listing import ShortTermListing
from domain.repositories.bnb import BnbRepository
from application.dto.bnb import StListingCU, StListingRead
from domain.value_objects.money import Money

class CreateListingUseCase:
    def __init__(self, bnb_repository: BnbRepository):
        self._bnb_repository = bnb_repository
    
    async def execute(self, request: StListingCU) -> StListingRead:
        # Convert DTO to domain entity
        from datetime import datetime
        listing_entity = ShortTermListing(
            id=0,  # Will be set by repository
            host_id=request.host_id if hasattr(request, 'host_id') else 1,  # TODO: Get from auth context
            title=request.title,
            listing_type=request.type.value if hasattr(request.type, 'value') else str(request.type),
            capacity=request.capacity,
            nightly_price=Money(request.nightly_price, "KES"),
            address=request.address,
            amenities=request.amenities,
            rules=request.rules,
            instant_book=request.instant_book,
            min_nights=request.min_nights,
            max_nights=request.max_nights,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        if request.id == 0:
            # Create new listing
            saved_listing = await self._bnb_repository.create(listing_entity)
        else:
            # Update existing listing
            listing_entity.id = request.id
            saved_listing = await self._bnb_repository.update(listing_entity)
        
        # Convert back to DTO
        return StListingRead(
            id=saved_listing.id,
            host_id=saved_listing.host_id,
            title=saved_listing.title,
            type=saved_listing.listing_type,
            capacity=saved_listing.capacity,
            nightly_price=saved_listing.nightly_price.amount,
            address=saved_listing.address,
            amenities=saved_listing.amenities,
            rules=saved_listing.rules,
            instant_book=saved_listing.instant_book,
            min_nights=saved_listing.min_nights,
            max_nights=saved_listing.max_nights,
            created_at=saved_listing.created_at,
            updated_at=saved_listing.updated_at,
            # Additional fields with defaults
            bedrooms=request.bedrooms,
            beds=request.beds,
            baths=request.baths,
            cleaning_fee=request.cleaning_fee,
            service_fee=request.service_fee,
            security_deposit=request.security_deposit,
            latitude=request.latitude,
            longitude=request.longitude,
            cancellation_policy=request.cancellation_policy,
            images=request.images
        )
