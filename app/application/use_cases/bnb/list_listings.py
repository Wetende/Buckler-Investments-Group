from typing import List
from domain.repositories.bnb import BnbRepository
from application.dto.bnb import StListingRead

class ListListingsUseCase:
    def __init__(self, bnb_repository: BnbRepository):
        self._bnb_repository = bnb_repository

    async def execute(self, limit: int = 20, offset: int = 0) -> List[StListingRead]:
        listings = await self._bnb_repository.list(limit=limit, offset=offset)

        return [
            StListingRead(
                id=listing.id,
                host_id=listing.host_id,
                title=listing.title,
                type=listing.listing_type,
                capacity=listing.capacity,
                nightly_price=listing.nightly_price.amount,
                address=listing.address,
                # Location fields for geographic grouping
                county=listing.county,
                town=listing.town,
                area_id=listing.area_id,
                latitude=listing.latitude,
                longitude=listing.longitude,
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
                cancellation_policy="MODERATE",
                images=None
            )
            for listing in listings
        ]
