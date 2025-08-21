import pytest
from unittest.mock import AsyncMock
from decimal import Decimal
from datetime import datetime

from application.use_cases.bundle.book_bundle import BookBundleUseCase
from application.dto.bundle_booking import CreateBundleBookingRequestDTO
from domain.entities.bundle import Bundle
from domain.entities.bundle_booking import BundleBooking, BookingStatus
from domain.value_objects.money import Money
from shared.exceptions.bundle import BundleNotFoundError

@pytest.mark.asyncio
async def test_book_bundle_use_case_success():
    # Arrange
    bundle_repo = AsyncMock()
    booking_repo = AsyncMock()

    use_case = BookBundleUseCase(bundle_repo, booking_repo)

    bundle = Bundle(
        id=1,
        user_id=1,
        items=[],
        total_price=Money(amount=Decimal("200.00"), currency="USD")
    )
    bundle_repo.find_by_id.return_value = bundle

    created_booking = BundleBooking(
        id=1,
        bundle_id=1,
        user_id=1,
        total_price=bundle.total_price,
        status=BookingStatus.PENDING,
        booked_at=datetime.utcnow()
    )
    booking_repo.create.return_value = created_booking

    request_dto = CreateBundleBookingRequestDTO(bundle_id=1, user_id=1)

    # Act
    result = await use_case.execute(request_dto)

    # Assert
    assert result.id == 1
    assert result.bundle_id == 1
    assert result.user_id == 1
    assert result.total_price.amount == Decimal("200.00")
    assert result.status == BookingStatus.PENDING
    booking_repo.create.assert_called_once()
    bundle_repo.find_by_id.assert_called_with(1)

@pytest.mark.asyncio
async def test_book_bundle_bundle_not_found():
    # Arrange
    bundle_repo = AsyncMock()
    booking_repo = AsyncMock()

    use_case = BookBundleUseCase(bundle_repo, booking_repo)

    bundle_repo.find_by_id.return_value = None

    request_dto = CreateBundleBookingRequestDTO(bundle_id=99, user_id=1)

    # Act & Assert
    with pytest.raises(BundleNotFoundError) as excinfo:
        await use_case.execute(request_dto)

    assert "Bundle with ID 99 not found" in str(excinfo.value)
    booking_repo.create.assert_not_called()
