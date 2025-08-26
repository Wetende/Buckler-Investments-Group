from domain.repositories.bnb import BnbRepository
from shared.exceptions.bnb import ListingNotFoundError

class DeleteListingUseCase:
    def __init__(self, bnb_repository: BnbRepository):
        self._bnb_repository = bnb_repository
    
    async def execute(self, listing_id: int) -> None:
        listing = await self._bnb_repository.get_by_id(listing_id)
        
        if not listing:
            raise ListingNotFoundError(f"Listing with ID {listing_id} not found")
        
        await self._bnb_repository.delete(listing_id)
