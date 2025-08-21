from typing import List
from datetime import date
from domain.repositories.bnb import BnbRepository
from domain.entities.bnb import ShortTermListing
from ...dto.bnb import SearchListingsRequest, ListingResponse

class SearchListingsUseCase:
    def __init__(self, bnb_repository: BnbRepository):
        self._bnb_repository = bnb_repository
    
    async def execute(self, request: SearchListingsRequest) -> List[ListingResponse]:
        # Business logic for searching listings
        listings = await self._bnb_repository.search_available(
            check_in=request.check_in,
            check_out=request.check_out,
            guests=request.guests
        )
        
        # Apply additional filters
        if request.price_max:
            listings = [l for l in listings if l.nightly_price.amount <= request.price_max]
        
        if request.instant_book_only:
            listings = [l for l in listings if l.instant_book]
        
        return [ListingResponse.from_entity(listing) for listing in listings]
