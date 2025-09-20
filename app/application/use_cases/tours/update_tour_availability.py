from datetime import date
from typing import List

from domain.repositories.tours import TourRepository, TourAvailabilityRepository
from shared.exceptions.tours import TourNotFoundError
from domain.entities.tours.availability import TourAvailability
from application.dto.tours import TourAvailabilityDTO, TourAvailabilityItem


class UpdateTourAvailabilityUseCase:
    """Update or create availability entries for a tour over a set of dates."""

    def __init__(
        self,
        tour_repository: TourRepository,
        availability_repository: TourAvailabilityRepository,
    ) -> None:
        self._tour_repository = tour_repository
        self._availability_repository = availability_repository

    async def execute(self, tour_id: int, request: TourAvailabilityDTO) -> dict:
        # Validate tour exists
        tour = await self._tour_repository.get_by_id(tour_id)
        if not tour:
            raise TourNotFoundError(f"Tour with ID {tour_id} not found")

        # Defensive: override tour_id from path
        items: List[TourAvailabilityItem] = request.items or []
        created_or_updated = 0

        # We don't have an explicit upsert repository method, so we do:
        # - Try to find existing by date range, then update or create one-by-one
        # Optimize by fetching range in one call
        if items:
            start = min(i.date for i in items)
            end = max(i.date for i in items)
            existing = await self._availability_repository.get_range(tour_id, start, end)
            by_date = {e.date: e for e in existing}

            for i in items:
                entity = by_date.get(i.date)
                if entity:
                    # Update existing
                    entity.available_spots = i.available_spots
                    entity.price_override = i.price_override
                    await self._availability_repository.update(entity)
                else:
                    # Create new
                    new_entity = TourAvailability(
                        id=0,
                        tour_id=tour_id,
                        date=i.date,
                        available_spots=i.available_spots,
                        price_override=i.price_override,
                    )
                    await self._availability_repository.create(new_entity)
                created_or_updated += 1

        return {
            "ok": True,
            "tour_id": tour_id,
            "items_processed": created_or_updated,
        }
