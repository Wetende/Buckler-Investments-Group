from typing import Dict, Any

from ...dto.bundle import CreateBundleRequestDTO, BundleResponseDTO
from domain.entities.bundle import Bundle, BundledItem
from domain.repositories.bundle import BundleRepository
from domain.repositories.tours import TourRepository
from domain.repositories.cars import VehicleRepository
from domain.repositories.bnb import BnbRepository
from shared.exceptions.bundle import BundledItemNotFoundError


class CreateBundleUseCase:
    def __init__(
        self,
        bundle_repo: BundleRepository,
        tour_repo: TourRepository,
        vehicle_repo: VehicleRepository,
        bnb_repo: BnbRepository,
    ):
        self._bundle_repo = bundle_repo
        self._tour_repo = tour_repo
        self._vehicle_repo = vehicle_repo
        self._bnb_repo = bnb_repo

    async def execute(self, request: CreateBundleRequestDTO) -> BundleResponseDTO:
        from datetime import datetime
        bundle = Bundle(
            id=0,  # Will be set by repository on creation
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            user_id=request.user_id
        )

        item_mappers = {
            "tour_booking": self._map_tour_item,
            "car_rental": self._map_vehicle_item,
            "bnb_booking": self._map_bnb_item,
        }

        for item_req in request.items:
            mapper = item_mappers.get(item_req.item_type)
            if not mapper:
                # Or raise a specific validation error
                continue
            
            bundled_item = await mapper(item_req.item_id)
            bundle.add_item(bundled_item)

        created_bundle = await self._bundle_repo.create(bundle)

        return BundleResponseDTO.from_entity(created_bundle)

    async def _map_tour_item(self, item_id: int) -> BundledItem:
        tour = await self._tour_repo.get_by_id(item_id)
        if not tour:
            raise BundledItemNotFoundError("tour_booking", item_id)
        return BundledItem(
            item_id=tour.id,
            item_type="tour_booking",
            price=tour.price_per_person,
            details={"title": tour.title, "location": tour.location}
        )

    async def _map_vehicle_item(self, item_id: int) -> BundledItem:
        vehicle = await self._vehicle_repo.get_by_id(item_id)
        if not vehicle:
            raise BundledItemNotFoundError("car_rental", item_id)
        return BundledItem(
            item_id=vehicle.id,
            item_type="car_rental",
            price=vehicle.daily_rate,
            details={"make": vehicle.make, "model": vehicle.model}
        )

    async def _map_bnb_item(self, item_id: int) -> BundledItem:
        bnb = await self._bnb_repo.get_by_id(item_id)
        if not bnb:
            raise BundledItemNotFoundError("bnb_booking", item_id)
        return BundledItem(
            item_id=bnb.id,
            item_type="bnb_booking",
            price=bnb.price_per_night,
            details={"title": bnb.title, "address": bnb.address}
        )
