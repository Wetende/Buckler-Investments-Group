from typing import List
from domain.repositories.bnb import BnbRepository
from ...dto.bnb import SearchListingsRequest, ListingResponse

class SearchListingsUseCase:
    def __init__(self, bnb_repository: BnbRepository):
        self._bnb_repository = bnb_repository
    
    async def execute(self, request: SearchListingsRequest) -> List[ListingResponse]:
        # Business logic for searching listings
        # If no dates/guests provided, get all listings and filter manually
        if request.check_in and request.check_out and request.guests:
            listings = await self._bnb_repository.search_available(
                check_in=request.check_in,
                check_out=request.check_out,
                guests=request.guests
            )
        else:
            # Get all listings if no specific search criteria
            listings = await self._bnb_repository.list(limit=100, offset=0)
        
        # Apply additional filters
        if request.guests and not (request.check_in and request.check_out):
            listings = [l for l in listings if l.capacity >= request.guests]
            
        if request.price_min:
            listings = [l for l in listings if l.nightly_price.amount >= request.price_min]
            
        if request.price_max:
            listings = [l for l in listings if l.nightly_price.amount <= request.price_max]
        
        if request.location:
            listings = [l for l in listings if request.location.lower() in l.address.lower() 
                       or (l.county and request.location.lower() in l.county.lower())
                       or (l.town and request.location.lower() in l.town.lower())]
        
        if request.instant_book_only:
            listings = [l for l in listings if l.instant_book]
        
        return [ListingResponse.from_entity(listing) for listing in listings]
