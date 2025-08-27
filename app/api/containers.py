from dependency_injector import containers, providers

from infrastructure.config.database import AsyncSessionLocal

# Repositories
from domain.repositories.bnb import BnbRepository, BookingRepository
from domain.repositories.tours import TourRepository, TourBookingRepository
from domain.repositories.cars import VehicleRepository, CarRentalRepository
from domain.repositories.property import PropertyRepository
from domain.repositories.investment import InvestmentRepository, InvestmentHoldingRepository
from domain.repositories.user import UserRepository
from domain.repositories.bundle import BundleRepository
from domain.repositories.bundle_booking import BundleBookingRepository
# from domain.repositories.payment import PaymentRepository  # Temporarily disabled
from infrastructure.database.repositories.bnb import (
    SqlAlchemyBnbRepository,
    SqlAlchemyBookingRepository,
)
from infrastructure.database.repositories.tours import (
    SqlAlchemyTourRepository,
    SqlAlchemyTourBookingRepository,
)
from infrastructure.database.repositories.cars import (
    SqlAlchemyVehicleRepository,
    SqlAlchemyCarRentalRepository,
)
from infrastructure.database.repositories.property import SqlAlchemyPropertyRepository
from infrastructure.database.repositories.investment import (
    SqlAlchemyInvestmentRepository,
    SqlAlchemyInvestmentHoldingRepository,
)
from infrastructure.database.repositories.user import SqlAlchemyUserRepository
from infrastructure.database.repositories.bundle import SqlAlchemyBundleRepository
from infrastructure.database.repositories.bundle_booking import SqlAlchemyBundleBookingRepository
# from infrastructure.database.repositories.payment import SqlAlchemyPaymentRepository  # Temporarily disabled

# Use Cases
from application.use_cases.bnb.search_listings import SearchListingsUseCase
from application.use_cases.bnb.create_booking import CreateBookingUseCase
from application.use_cases.bnb.create_listing import CreateListingUseCase
from application.use_cases.bnb.get_listing import GetListingUseCase
from application.use_cases.bnb.list_listings import ListListingsUseCase
from application.use_cases.bnb.delete_listing import DeleteListingUseCase
from application.use_cases.bnb.get_host_listings import GetHostListingsUseCase
from application.use_cases.bnb.get_booking import GetBookingUseCase
from application.use_cases.bnb.get_user_bookings import GetUserBookingsUseCase
from application.use_cases.bnb.cancel_booking import CancelBookingUseCase
from application.use_cases.bnb.get_host_bookings import GetHostBookingsUseCase
from application.use_cases.bnb.approve_booking import ApproveBookingUseCase
from application.use_cases.bnb.reject_booking import RejectBookingUseCase
from application.use_cases.tours.search_tours import SearchToursUseCase
from application.use_cases.tours.create_tour_booking import CreateTourBookingUseCase
from application.use_cases.tours.get_tour_booking import GetTourBookingUseCase
from application.use_cases.tours.get_user_tour_bookings import GetUserTourBookingsUseCase
from application.use_cases.tours.create_tour import CreateTourUseCase
from application.use_cases.tours.get_tour import GetTourUseCase
from application.use_cases.tours.list_tours import ListToursUseCase
from application.use_cases.tours.delete_tour import DeleteTourUseCase
from application.use_cases.cars.search_vehicles import SearchVehiclesUseCase
from application.use_cases.cars.create_rental import CreateRentalUseCase
from application.use_cases.property.search_properties import SearchPropertiesUseCase
from application.use_cases.property.create_property import CreatePropertyUseCase
from application.use_cases.investment.list_investments import ListInvestmentsUseCase
from application.use_cases.investment.make_investment import MakeInvestmentUseCase
from application.use_cases.user.create_user import CreateUserUseCase
from application.use_cases.auth.refresh_token import RefreshTokenUseCase
from application.use_cases.auth.logout import LogoutUseCase
from application.use_cases.auth.password_reset import PasswordResetRequestUseCase, PasswordResetConfirmUseCase
from application.use_cases.auth.change_password import ChangePasswordUseCase
from domain.services.password_service import PasswordService
from infrastructure.services.bcrypt_password_service import BcryptPasswordService
from application.use_cases.bundle.create_bundle import CreateBundleUseCase
from application.use_cases.bundle.book_bundle import BookBundleUseCase
# from application.use_cases.payment.create_payment_intent import CreatePaymentIntentUseCase  # Temporarily disabled
# from infrastructure.external_services.payment.stripe_service import StripePaymentService  # Temporarily disabled
# from infrastructure.external_services.payment.mpesa_service import MpesaPaymentService  # Temporarily disabled


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


class AuthUseCases(containers.DeclarativeContainer):
    """Container for authentication use cases."""
    user_repository = providers.Dependency(instance_of=UserRepository)
    password_service = providers.Dependency(instance_of=PasswordService)

    refresh_token_use_case = providers.Factory(
        RefreshTokenUseCase,
        user_repository=user_repository,
    )

    logout_use_case = providers.Factory(
        LogoutUseCase,
        user_repository=user_repository,
    )

    password_reset_request_use_case = providers.Factory(
        PasswordResetRequestUseCase,
        user_repository=user_repository,
    )

    password_reset_confirm_use_case = providers.Factory(
        PasswordResetConfirmUseCase,
        user_repository=user_repository,
        password_service=password_service,
    )

    change_password_use_case = providers.Factory(
        ChangePasswordUseCase,
        user_repository=user_repository,
        password_service=password_service,
    )


class UserUseCases(containers.DeclarativeContainer):
    """Container for user module use cases."""
    user_repository = providers.Dependency(instance_of=UserRepository)
    password_service = providers.Dependency(instance_of=PasswordService)

    create_user_use_case = providers.Factory(
        CreateUserUseCase,
        user_repository=user_repository,
        password_service=password_service,
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
    """Application-wide DI container wiring repositories, services, and use cases."""
    wiring_config = containers.WiringConfiguration(
        modules=[
            "api.v1.bnb.routes",
            "api.v1.bnb.listing_routes",
            "api.v1.bnb.booking_routes",
            "api.v1.tours.routes",
            "api.v1.tours.tour_routes",
            "api.v1.tours.booking_routes",
            "api.v1.cars.routes",
            "api.v1.bundle.routes",
            "api.v1.property_listing.public_routes",
            "api.v1.property_listing.admin_routes",
            "api.v1.investment_platform.public_routes",
            "api.v1.investment_platform.user_routes",
            "api.v1.shared.user_routes",
            "api.v1.shared.auth_routes",
            # "api.v1.payments.routes",  # Temporarily disabled
        ]
    )

    # Database
    db_session = providers.Resource(
        AsyncSessionLocal
    )

    # Services
    password_service: providers.Factory[PasswordService] = providers.Factory(
        BcryptPasswordService
    )

    # Payment Services - temporarily disabled
    # stripe_service = providers.Singleton(
    #     StripePaymentService,
    #     api_key="sk_test_mock_key"  # This should come from config
    # )

    # mpesa_service = providers.Singleton(
    #     MpesaPaymentService,
    #     consumer_key="mock_key",  # This should come from config
    #     consumer_secret="mock_secret",  # This should come from config
    #     shortcode="174379"  # This should come from config
    # )

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

    # Payment Repository - temporarily disabled
    # payment_repository: providers.Factory[PaymentRepository] = providers.Factory(
    #     SqlAlchemyPaymentRepository,
    #     session=db_session,
    # )

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

    # Additional BnB Use Cases
    create_listing_use_case = providers.Factory(
        CreateListingUseCase,
        bnb_repository=bnb_repository,
    )

    get_listing_use_case = providers.Factory(
        GetListingUseCase,
        bnb_repository=bnb_repository,
    )

    list_listings_use_case = providers.Factory(
        ListListingsUseCase,
        bnb_repository=bnb_repository,
    )

    delete_listing_use_case = providers.Factory(
        DeleteListingUseCase,
        bnb_repository=bnb_repository,
    )

    get_host_listings_use_case = providers.Factory(
        GetHostListingsUseCase,
        bnb_repository=bnb_repository,
    )

    get_booking_use_case = providers.Factory(
        GetBookingUseCase,
        booking_repository=booking_repository,
    )

    get_user_bookings_use_case = providers.Factory(
        GetUserBookingsUseCase,
        booking_repository=booking_repository,
    )

    cancel_booking_use_case = providers.Factory(
        CancelBookingUseCase,
        booking_repository=booking_repository,
    )

    get_host_bookings_use_case = providers.Factory(
        GetHostBookingsUseCase,
        booking_repository=booking_repository,
        bnb_repository=bnb_repository,
    )

    approve_booking_use_case = providers.Factory(
        ApproveBookingUseCase,
        booking_repository=booking_repository,
    )

    reject_booking_use_case = providers.Factory(
        RejectBookingUseCase,
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

    get_tour_booking_use_case = providers.Factory(
        GetTourBookingUseCase,
        tour_booking_repository=tour_booking_repository,
    )

    get_user_tour_bookings_use_case = providers.Factory(
        GetUserTourBookingsUseCase,
        tour_booking_repository=tour_booking_repository,
    )

    # Additional Tour Use Cases
    create_tour_use_case = providers.Factory(
        CreateTourUseCase,
        tour_repository=tour_repository,
    )

    get_tour_use_case = providers.Factory(
        GetTourUseCase,
        tour_repository=tour_repository,
    )

    list_tours_use_case = providers.Factory(
        ListToursUseCase,
        tour_repository=tour_repository,
    )

    delete_tour_use_case = providers.Factory(
        DeleteTourUseCase,
        tour_repository=tour_repository,
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

    # Authentication Use Cases
    auth_use_cases = providers.Container(
        AuthUseCases,
        user_repository=user_repository,
        password_service=password_service,
    )

    # User Use Cases
    user_use_cases = providers.Container(
        UserUseCases,
        user_repository=user_repository,
        password_service=password_service,
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

    # Payment Use Cases - temporarily disabled
    # create_payment_intent_use_case = providers.Factory(
    #     CreatePaymentIntentUseCase,
    #     payment_repository=payment_repository,
    #     stripe_service=stripe_service,
    #     mpesa_service=mpesa_service,
    # )
