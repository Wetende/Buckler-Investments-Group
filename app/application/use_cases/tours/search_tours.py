from typing import List
from ....domain.repositories.tours import TourRepository
from ...dto.tours import SearchToursRequest, TourResponse

class SearchToursUseCase:
    def __init__(self, tour_repository: TourRepository):
        self._tour_repository = tour_repository
    
    async def execute(self, request: SearchToursRequest) -> List[TourResponse]:
        tours = await self._tour_repository.search_by_location_and_date(
            location=request.location,
            start_date=request.start_date
        )
        
        if request.max_price:
            tours = [t for t in tours if t.price.amount <= request.max_price]
            
        return [TourResponse.from_entity(tour) for tour in tours]
