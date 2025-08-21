from ...dto.bundle_booking import CreateBundleBookingRequestDTO, BundleBookingResponseDTO
from domain.entities.bundle_booking import BundleBooking
from domain.repositories.bundle import BundleRepository
from domain.repositories.bundle_booking import BundleBookingRepository
from shared.exceptions.bundle import BundleNotFoundError

class BookBundleUseCase:
    def __init__(
        self,
        bundle_repo: BundleRepository,
        booking_repo: BundleBookingRepository,
    ):
        self._bundle_repo = bundle_repo
        self._booking_repo = booking_repo

    async def execute(self, request: CreateBundleBookingRequestDTO) -> BundleBookingResponseDTO:
        bundle = await self._bundle_repo.find_by_id(request.bundle_id)
        if not bundle:
            raise BundleNotFoundError(request.bundle_id)

        booking = BundleBooking(
            bundle_id=bundle.id,
            user_id=request.user_id,
            total_price=bundle.total_price,
        )

        created_booking = await self._booking_repo.create(booking)

        return BundleBookingResponseDTO.from_orm(created_booking)
