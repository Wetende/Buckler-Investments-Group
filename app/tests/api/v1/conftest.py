import pytest
from unittest.mock import Mock
from fastapi.testclient import TestClient

from app.api.main import app
from app.api.containers import AppContainer
from dependency_injector import providers

from app.domain.repositories.tours import TourRepository, TourBookingRepository
from app.domain.repositories.bnb import BnbRepository, BookingRepository as BnbBookingRepository
from app.domain.repositories.cars import VehicleRepository, CarRentalRepository
from app.domain.repositories.property import PropertyRepository


@pytest.fixture
def client():
    container: AppContainer = app.container  # type: ignore[attr-defined]

    # Create mocks for repositories used by API routes
    mock_tour_repo = Mock(spec=TourRepository)
    mock_tour_booking_repo = Mock(spec=TourBookingRepository)
    mock_vehicle_repo = Mock(spec=VehicleRepository)
    mock_rental_repo = Mock(spec=CarRentalRepository)
    mock_property_repo = Mock(spec=PropertyRepository)
    mock_bnb_repo = Mock(spec=BnbRepository)
    mock_bnb_booking_repo = Mock(spec=BnbBookingRepository)

    # Override DI providers
    container.tour_repository.override(providers.Object(mock_tour_repo))
    container.tour_booking_repository.override(providers.Object(mock_tour_booking_repo))
    container.vehicle_repository.override(providers.Object(mock_vehicle_repo))
    container.car_rental_repository.override(providers.Object(mock_rental_repo))
    container.property_repository.override(providers.Object(mock_property_repo))
    container.bnb_repository.override(providers.Object(mock_bnb_repo))
    container.booking_repository.override(providers.Object(mock_bnb_booking_repo))
    
    # Ensure container is wired after overrides
    container.wire()

    tc = TestClient(app)

    # Attach mocks to client for test access
    tc.mock_tour_repo = mock_tour_repo  # type: ignore[attr-defined]
    tc.mock_tour_booking_repo = mock_tour_booking_repo  # type: ignore[attr-defined]
    tc.mock_vehicle_repo = mock_vehicle_repo  # type: ignore[attr-defined]
    tc.mock_rental_repo = mock_rental_repo  # type: ignore[attr-defined]
    tc.mock_property_repo = mock_property_repo  # type: ignore[attr-defined]
    tc.mock_bnb_repo = mock_bnb_repo  # type: ignore[attr-defined]
    tc.mock_bnb_booking_repo = mock_bnb_booking_repo  # type: ignore[attr-defined]

    try:
        yield tc
    finally:
        # Reset overrides to avoid cross-test pollution
        container.tour_repository.reset_override()
        container.tour_booking_repository.reset_override()
        container.vehicle_repository.reset_override()
        container.car_rental_repository.reset_override()
        container.property_repository.reset_override()
        container.bnb_repository.reset_override()
        container.booking_repository.reset_override()


