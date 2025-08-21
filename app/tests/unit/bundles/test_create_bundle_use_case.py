import pytest
from unittest.mock import AsyncMock, MagicMock
from decimal import Decimal

from app.application.use_cases.bundle.create_bundle import CreateBundleUseCase
from app.application.dto.bundle import CreateBundleRequestDTO, BundledItemRequestDTO
from app.domain.entities.bundle import Bundle, BundledItem
from app.domain.value_objects.money import Money
from app.shared.exceptions.bundle import BundledItemNotFoundError

# A simple mock for products to avoid importing full domain entities
class BaseProduct:
    def __init__(self, id: int, price: Money):
        self.id = id
        self.price = price

@pytest.mark.asyncio
async def test_create_bundle_use_case_success():
    # Arrange
    bundle_repo = AsyncMock()
    tour_repo = AsyncMock()
    vehicle_repo = AsyncMock()
    bnb_repo = AsyncMock()

    use_case = CreateBundleUseCase(bundle_repo, tour_repo, vehicle_repo, bnb_repo)

    tour = BaseProduct(id=1, price=Money(amount=Decimal("100.00"), currency="USD"))
    car = BaseProduct(id=1, price=Money(amount=Decimal("50.00"), currency="USD"))

    tour_repo.find_by_id.return_value = tour
    vehicle_repo.find_by_id.return_value = car
    bnb_repo.find_by_id.return_value = None # To test it handles missing types

    # Mock the bundle creation return value
    created_bundle = Bundle(
        id=1,
        user_id=1,
        items=[
            BundledItem(item_id=1, item_type='tour_booking', price=tour.price, details={}),
            BundledItem(item_id=1, item_type='car_rental', price=car.price, details={})
        ]
    )
    bundle_repo.create.return_value = created_bundle

    request_dto = CreateBundleRequestDTO(
        user_id=1,
        items=[
            BundledItemRequestDTO(item_id=1, item_type='tour_booking'),
            BundledItemRequestDTO(item_id=1, item_type='car_rental'),
        ]
    )

    # Act
    result = await use_case.execute(request_dto)

    # Assert
    assert result.id == 1
    assert result.total_price.amount == Decimal("150.00")
    assert len(result.items) == 2
    bundle_repo.create.assert_called_once()

@pytest.mark.asyncio
async def test_create_bundle_item_not_found():
    # Arrange
    bundle_repo = AsyncMock()
    tour_repo = AsyncMock()
    vehicle_repo = AsyncMock()
    bnb_repo = AsyncMock()

    use_case = CreateBundleUseCase(bundle_repo, tour_repo, vehicle_repo, bnb_repo)

    tour_repo.find_by_id.return_value = None

    request_dto = CreateBundleRequestDTO(
        user_id=1,
        items=[BundledItemRequestDTO(item_id=99, item_type='tour_booking')]
    )

    # Act & Assert
    with pytest.raises(BundledItemNotFoundError) as excinfo:
        await use_case.execute(request_dto)
    
    assert "Tour booking with ID 99 not found" in str(excinfo.value)
