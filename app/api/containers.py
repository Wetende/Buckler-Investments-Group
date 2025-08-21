from dependency_injector import containers, providers

from ..infrastructure.config.database import AsyncSessionLocal

# Repositories
from ..domain.repositories.bnb import BnbRepository, BookingRepository
from ..domain.repositories.tours import TourRepository, TourBookingRepository
from ..domain.repositories.cars import VehicleRepository, CarRentalRepository
from ..domain.repositories.property import PropertyRepository
from ..domain.repositories.investment import InvestmentRepository, InvestmentHoldingRepository
from ..domain.repositories.user import UserRepository
from ..domain.repositories.bundle import BundleRepository
from ..domain.repositories.bundle_booking import BundleBookingRepository
from ..infrastructure.database.repositories.bnb import (
    SqlAlchemyBnbRepository,
    SqlAlchemyBookingRepository,
)
from ..infrastructure.database.repositories.tours import (
    SqlAlchemyTourRepository,
    SqlAlchemyTourBookingRepository,
)
from ..infrastructure.database.repositories.cars import (
    SqlAlchemyVehicleRepository,
    SqlAlchemyCarRentalRepository,
)
from ..infrastructure.database.repositories.property import SqlAlchemyPropertyRepository
from ..infrastructure.database.repositories.investment import (
    SqlAlchemyInvestmentRepository,
    SqlAlchemyInvestmentHoldingRepository,
)
from ..infrastructure.database.repositories.user import SqlAlchemyUserRepository
from ..infrastructure.database.repositories.bundle import SqlAlchemyBundleRepository
from ..infrastructure.database.repositories.bundle_booking import SqlAlchemyBundleBookingRepository

# Use Cases
from ..application.use_cases.bnb.search_listings import SearchListingsUseCase
from ..application.use_cases.bnb.create_booking import CreateBookingUseCase
from ..application.use_cases.tours.search_tours import SearchToursUseCase
from ..application.use_cases.tours.create_tour_booking import CreateTourBookingUseCase
from ..application.use_cases.cars.search_vehicles import SearchVehiclesUseCase
from ..application.use_cases.cars.create_rental import CreateRentalUseCase
from ..application.use_cases.property.search_properties import SearchPropertiesUseCase
from ..application.use_cases.property.create_property import CreatePropertyUseCase
from ..application.use_cases.investment.list_investments import ListInvestmentsUseCase
from ..application.use_cases.investment.make_investment import MakeInvestmentUseCase
from ..application.use_cases.user.create_user import CreateUserUseCase
from ..application.use_cases.bundle.create_bundle import CreateBundleUseCase
from ..application.use_cases.bundle.book_bundle import BookBundleUseCase


class BundleUseCases(containers.DeclarativeContainer):
    """Container for bundle module use cases."""
    bundle_repo = providers.Dependency(instance_of=BundleRepository)
    booking_repo = providers.Dependency(instance_of=BundleBookingRepository)
    tour_repo = providers.Dependency(instance_of=TourRepository)
    vehicle_repo = providers.Dependency(instance_of=VehicleRepository)
    bnb_repo = providers.Dependency(instance_of=BnbRepository)

    create_bundle_use_case = providers.Factory(
        CreateBundleUseCase,
        bundle_repo=bundle_repo,
        tour_repo=tour_repo,
        vehicle_repo=vehicle_repo,
        bnb_repo=bnb_repo,
    )

    book_bundle_use_case = providers.Factory(
        BookBundleUseCase,
        bundle_repo=bundle_repo,
        booking_repo=booking_repo,
    )


class UserUseCases(containers.DeclarativeContainer):
    """Container for user module use cases."""
    user_repository = providers.Dependency(instance_of=UserRepository)

    create_user_use_case = providers.Factory(
        CreateUserUseCase,
        user_repository=user_repository,
    )


class InvestmentUseCases(containers.DeclarativeContainer):
    """Container for investment module use cases."""
    investment_repository = providers.Dependency(instance_of=InvestmentRepository)
    holding_repository = providers.Dependency(instance_of=InvestmentHoldingRepository)

    list_investments_use_case = providers.Factory(
        ListInvestmentsUseCase,
        investment_repository=investment_repository,
    )

    make_investment_use_case = providers.Factory(
        MakeInvestmentUseCase,
        investment_repository=investment_repository,
        holding_repository=holding_repository,
    )


class PropertyUseCases(containers.DeclarativeContainer):
    """Container for property module use cases."""
    property_repository = providers.Dependency(instance_of=PropertyRepository)

    search_properties_use_case = providers.Factory(
        SearchPropertiesUseCase,
        property_repository=property_repository,
    )

    create_property_use_case = providers.Factory(
        CreatePropertyUseCase,
        property_repository=property_repository,
    )


class AppContainer(containers.DeclarativeContainer):

    wiring_config = containers.WiringConfiguration(
        modules=[
            "app.api.v1.bnb.routes",
            "app.api.v1.tours.routes",
            "app.api.v1.cars.routes",
            "app.api.v1.property.routes",
            "app.api.v1.investment.routes",
            "app.api.v1.user.routes",
            "app.api.v1.bundle.routes",
        ]
    )

    # Database
    db_session = providers.Resource(
        AsyncSessionLocal
    )

    # BNB Repositories
    bnb_repository: providers.Factory[BnbRepository] = providers.Factory(
        SqlAlchemyBnbRepository,
        session=db_session,
    )

    booking_repository: providers.Factory[BookingRepository] = providers.Factory(
        SqlAlchemyBookingRepository,
        session=db_session,
    )

    # Tour Repositories
    tour_repository: providers.Factory[TourRepository] = providers.Factory(
        SqlAlchemyTourRepository,
        session=db_session,
    )

    tour_booking_repository: providers.Factory[TourBookingRepository] = providers.Factory(
        SqlAlchemyTourBookingRepository,
        session=db_session,
    )

    # Car Repositories
    vehicle_repository: providers.Factory[VehicleRepository] = providers.Factory(
        SqlAlchemyVehicleRepository,
        session=db_session,
    )

    car_rental_repository: providers.Factory[CarRentalRepository] = providers.Factory(
        SqlAlchemyCarRentalRepository,
        session=db_session,
    )

    # Property Repository
    property_repository: providers.Factory[PropertyRepository] = providers.Factory(
        SqlAlchemyPropertyRepository,
        session=db_session,
    )

    # Investment Repositories
    investment_repository: providers.Factory[InvestmentRepository] = providers.Factory(
        SqlAlchemyInvestmentRepository,
        session=db_session,
    )

    investment_holding_repository: providers.Factory[InvestmentHoldingRepository] = providers.Factory(
        SqlAlchemyInvestmentHoldingRepository,
        session=db_session,
    )

    # User Repository
    user_repository: providers.Factory[UserRepository] = providers.Factory(
        SqlAlchemyUserRepository,
        session=db_session,
    )

    # Bundle Repository
    bundle_repository: providers.Factory[BundleRepository] = providers.Factory(
        SqlAlchemyBundleRepository,
        session=db_session,
    )

    bundle_booking_repository: providers.Factory[BundleBookingRepository] = providers.Factory(
        SqlAlchemyBundleBookingRepository,
        session=db_session,
    )

    # BNB Use Cases
    search_listings_use_case = providers.Factory(
        SearchListingsUseCase,
        bnb_repository=bnb_repository,
    )

    create_booking_use_case = providers.Factory(
        CreateBookingUseCase,
        bnb_repository=bnb_repository,
        booking_repository=booking_repository,
    )

    # Tour Use Cases
    search_tours_use_case = providers.Factory(
        SearchToursUseCase,
        tour_repository=tour_repository,
    )

    create_tour_booking_use_case = providers.Factory(
        CreateTourBookingUseCase,
        tour_repository=tour_repository,
        tour_booking_repository=tour_booking_repository,
    )

    # Car Use Cases
    search_vehicles_use_case = providers.Factory(
        SearchVehiclesUseCase,
        vehicle_repository=vehicle_repository,
    )

    create_rental_use_case = providers.Factory(
        CreateRentalUseCase,
        vehicle_repository=vehicle_repository,
        car_rental_repository=car_rental_repository,
    )

    # Property Use Cases
    property_use_cases = providers.Container(
        PropertyUseCases,
        property_repository=property_repository,
    )

    # Investment Use Cases
    investment_use_cases = providers.Container(
        InvestmentUseCases,
        investment_repository=investment_repository,
        holding_repository=investment_holding_repository,
    )

    # User Use Cases
    user_use_cases = providers.Container(
        UserUseCases,
        user_repository=user_repository,
    )

    # Bundle Use Cases
    bundle_use_cases = providers.Container(
        BundleUseCases,
        bundle_repo=bundle_repository,
        booking_repo=bundle_booking_repository,
        tour_repo=tour_repository,
        vehicle_repo=vehicle_repository,
        bnb_repo=bnb_repository,
    )
