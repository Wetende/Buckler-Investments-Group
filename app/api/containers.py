from dependency_injector import containers, providers
import os
import sys
from pathlib import Path

# Ensure 'app' package root is importable
# (contains 'infrastructure', 'domain', 'application')
_APP_ROOT = Path(__file__).resolve().parents[1]
if str(_APP_ROOT) not in sys.path:
    sys.path.insert(0, str(_APP_ROOT))

from infrastructure.config.database import AsyncSessionLocal  # noqa: E402

# Repositories
from domain.repositories.bnb import (  # noqa: E402
    BnbRepository,
    BookingRepository,
)
from domain.repositories.tours import (  # noqa: E402
    TourRepository,
    TourBookingRepository,
)
from domain.repositories.cars import (  # noqa: E402
    VehicleRepository,
    CarRentalRepository,
)
from domain.repositories.property import PropertyRepository  # noqa: E402
from domain.repositories.investment import (  # noqa: E402
    InvestmentRepository,
    InvestmentHoldingRepository,
)
from domain.repositories.user import UserRepository  # noqa: E402
from domain.repositories.bundle import BundleRepository  # noqa: E402
from domain.repositories.bundle_booking import (  # noqa: E402
    BundleBookingRepository,
)
# from domain.repositories.payment import PaymentRepository
# Temporarily disabled
from domain.repositories.review import ReviewRepository  # noqa: E402
from infrastructure.database.repositories.bnb import (  # noqa: E402
    SqlAlchemyBnbRepository,
    SqlAlchemyBookingRepository,
)
from infrastructure.database.repositories.tours import (  # noqa: E402
    SqlAlchemyTourRepository,
    SqlAlchemyTourBookingRepository,
    SqlAlchemyTourAvailabilityRepository,
)
from infrastructure.database.repositories.cars import (  # noqa: E402
    SqlAlchemyVehicleRepository,
    SqlAlchemyCarRentalRepository,
)
from infrastructure.database.repositories.property import (  # noqa: E402
    SqlAlchemyPropertyRepository,
)
from infrastructure.database.repositories.investment import (  # noqa: E402
    SqlAlchemyInvestmentRepository,
    SqlAlchemyInvestmentHoldingRepository,
)
from infrastructure.database.repositories.user import (  # noqa: E402
    SqlAlchemyUserRepository,
)
from infrastructure.database.repositories.bundle import (  # noqa: E402
    SqlAlchemyBundleRepository,
)
from infrastructure.database.repositories.bundle_booking import (  # noqa: E402
    SqlAlchemyBundleBookingRepository,
)
# from infrastructure.database.repositories.payment import (
#     SqlAlchemyPaymentRepository,
# )
# Temporarily disabled
from infrastructure.database.repositories.review import (  # noqa: E402
    SqlAlchemyReviewRepository,
)

# Use Cases
from application.use_cases.bnb.search_listings import (  # noqa: E402
    SearchListingsUseCase,
)
from application.use_cases.bnb.create_booking import (  # noqa: E402
    CreateBookingUseCase,
)
from application.use_cases.bnb.create_listing import (  # noqa: E402
    CreateListingUseCase,
)
from application.use_cases.bnb.get_listing import (  # noqa: E402
    GetListingUseCase,
)
from application.use_cases.bnb.list_listings import (  # noqa: E402
    ListListingsUseCase,
)
from application.use_cases.bnb.delete_listing import (  # noqa: E402
    DeleteListingUseCase,
)
from application.use_cases.bnb.get_host_listings import (  # noqa: E402
    GetHostListingsUseCase,
)
from application.use_cases.bnb.get_booking import (  # noqa: E402
    GetBookingUseCase,
)
from application.use_cases.bnb.get_user_bookings import (  # noqa: E402
    GetUserBookingsUseCase,
)
from application.use_cases.bnb.cancel_booking import (  # noqa: E402
    CancelBookingUseCase,
)
from application.use_cases.bnb.get_host_bookings import (  # noqa: E402
    GetHostBookingsUseCase,
)
from application.use_cases.bnb.approve_booking import (  # noqa: E402
    ApproveBookingUseCase,
)
from application.use_cases.bnb.reject_booking import (  # noqa: E402
    RejectBookingUseCase,
)
# Location-based grouping use cases
from application.use_cases.bnb.get_listings_grouped_by_location import (  # noqa: E402, E501
    GetListingsGroupedByLocationUseCase,
)
from application.use_cases.bnb.get_listings_by_location import (  # noqa: E402, E501
    GetListingsByLocationUseCase,
)
from application.use_cases.tours.search_tours import (  # noqa: E402
    SearchToursUseCase,
)
from application.use_cases.tours.create_tour_booking import (  # noqa: E402
    CreateTourBookingUseCase,
)
from application.use_cases.tours.get_tour_booking import (  # noqa: E402
    GetTourBookingUseCase,
)
from application.use_cases.tours.get_user_tour_bookings import (  # noqa: E402
    GetUserTourBookingsUseCase,
)
from application.use_cases.tours.get_operator_tour_bookings import (  # noqa: E402, E501
    GetOperatorTourBookingsUseCase,
)
from application.use_cases.tours.modify_tour_booking import (  # noqa: E402
    ModifyTourBookingUseCase,
)
from application.use_cases.tours.cancel_tour_booking import (  # noqa: E402
    CancelTourBookingUseCase,
)
from application.use_cases.tours.confirm_tour_booking import (  # noqa: E402
    ConfirmTourBookingUseCase,
)
from application.use_cases.tours.complete_tour_booking import (  # noqa: E402
    CompleteTourBookingUseCase,
)
from application.use_cases.tours.create_tour import (  # noqa: E402
    CreateTourUseCase,
)
from application.use_cases.tours.get_tour import (  # noqa: E402
    GetTourUseCase,
)
from application.use_cases.tours.list_tours import (  # noqa: E402
    ListToursUseCase,
)
from application.use_cases.tours.delete_tour import (  # noqa: E402
    DeleteTourUseCase,
)
from application.use_cases.tours.update_tour_availability import (  # noqa: E402, E501
    UpdateTourAvailabilityUseCase,
)
from application.use_cases.tours.update_tour_pricing import (  # noqa: E402
    UpdateTourPricingUseCase,
)
from application.use_cases.cars.search_vehicles import (  # noqa: E402
    SearchVehiclesUseCase,
)
from application.use_cases.cars.create_rental import (  # noqa: E402
    CreateRentalUseCase,
)
from application.use_cases.cars.create_vehicle import (  # noqa: E402
    CreateVehicleUseCase,
)
from application.use_cases.cars.list_vehicles import (  # noqa: E402
    ListVehiclesUseCase,
)
from application.use_cases.cars.get_vehicle import (  # noqa: E402
    GetVehicleUseCase,
)
from application.use_cases.cars.delete_vehicle import (  # noqa: E402
    DeleteVehicleUseCase,
)
from application.use_cases.cars.get_rental import (  # noqa: E402
    GetRentalUseCase,
)
from application.use_cases.cars.list_rentals import (  # noqa: E402
    ListRentalsUseCase,
)
from application.use_cases.cars.check_availability import (  # noqa: E402
    CheckAvailabilityUseCase,
)
from application.use_cases.property.search_properties import (  # noqa: E402
    SearchPropertiesUseCase,
)
from application.use_cases.property.create_property import (  # noqa: E402
    CreatePropertyUseCase,
)
from application.use_cases.investment.list_investments import (  # noqa: E402
    ListInvestmentsUseCase,
)
from application.use_cases.investment.make_investment import (  # noqa: E402
    MakeInvestmentUseCase,
)
from application.use_cases.user.create_user import (  # noqa: E402
    CreateUserUseCase,
)
from application.use_cases.auth.refresh_token import (  # noqa: E402
    RefreshTokenUseCase,
)
from application.use_cases.auth.logout import (  # noqa: E402
    LogoutUseCase,
)
from application.use_cases.auth.password_reset import (  # noqa: E402
    PasswordResetRequestUseCase,
    PasswordResetConfirmUseCase,
)
from application.use_cases.auth.change_password import (  # noqa: E402
    ChangePasswordUseCase,
)
from domain.services.password_service import (  # noqa: E402
    PasswordService,
)
from infrastructure.services.bcrypt_password_service import (  # noqa: E402
    BcryptPasswordService,
)
from application.use_cases.bundle.create_bundle import (  # noqa: E402
    CreateBundleUseCase,
)
from application.use_cases.bundle.book_bundle import (  # noqa: E402
    BookBundleUseCase,
)
# from application.use_cases.payment.create_payment_intent import (
#     CreatePaymentIntentUseCase,
# )
# Temporarily disabled
# from infrastructure.external_services.payment.stripe_service import (
#     StripePaymentService,
# )
# Temporarily disabled
# from infrastructure.external_services.payment.mpesa_service import (
#     MpesaPaymentService,
# )
# Temporarily disabled
from application.use_cases.review.create_review import (  # noqa: E402
    CreateReviewUseCase,
)
from application.use_cases.review.get_reviews import (  # noqa: E402
    GetReviewsUseCase,
)
from application.use_cases.review.get_review_stats import (  # noqa: E402
    GetReviewStatsUseCase,
)
from application.use_cases.review.respond_to_review import (  # noqa: E402
    RespondToReviewUseCase,
)
from application.use_cases.review.get_user_reviews import (  # noqa: E402
    GetUserReviewsUseCase,
)
from application.use_cases.review.flag_review import (  # noqa: E402
    FlagReviewUseCase,
)
from application.use_cases.review.delete_review import (  # noqa: E402
    DeleteReviewUseCase,
)
from application.use_cases.analytics.host_dashboard import (  # noqa: E402
    HostDashboardUseCase,
)
from application.use_cases.analytics.host_earnings import (  # noqa: E402
    HostEarningsUseCase,
)
from application.use_cases.analytics.tour_operator_dashboard import (  # noqa: E402, E501
    TourOperatorDashboardUseCase,
)
from application.use_cases.analytics.tour_operator_earnings import (  # noqa: E402, E501
    TourOperatorEarningsUseCase,
)


class BundleUseCases(containers.DeclarativeContainer):
    """Container for bundle module use cases."""
    bundle_repo: providers.Dependency = providers.Dependency()
    booking_repo: providers.Dependency = providers.Dependency()
    tour_repo: providers.Dependency = providers.Dependency()
    vehicle_repo: providers.Dependency = providers.Dependency()
    bnb_repo: providers.Dependency = providers.Dependency()

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
    user_repository: providers.Dependency = providers.Dependency()
    password_service: providers.Dependency = providers.Dependency()

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
    user_repository: providers.Dependency = providers.Dependency()
    password_service: providers.Dependency = providers.Dependency()

    create_user_use_case = providers.Factory(
        CreateUserUseCase,
        user_repository=user_repository,
        password_service=password_service,
    )


class InvestmentUseCases(containers.DeclarativeContainer):
    """Container for investment module use cases."""
    investment_repository: providers.Dependency = providers.Dependency()
    holding_repository: providers.Dependency = providers.Dependency()

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
    property_repository: providers.Dependency = providers.Dependency()

    search_properties_use_case = providers.Factory(
        SearchPropertiesUseCase,
        property_repository=property_repository,
    )

    create_property_use_case = providers.Factory(
        CreatePropertyUseCase,
        property_repository=property_repository,
    )


class AppContainer(containers.DeclarativeContainer):
    """DI container for repositories, services, and use cases."""
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
            "api.v1.reviews.routes",
            "api.v1.payments.routes",
        ]
    )

    # Database - Factory approach with proper session management
    @staticmethod
    def create_managed_session():
        """Create a session that will be properly managed."""
        return AsyncSessionLocal()

    db_session_factory = providers.Factory(create_managed_session)

    # Services
    password_service: providers.Factory[PasswordService] = providers.Factory(
        BcryptPasswordService
    )

    # Payment Services
    # Note: defaults are for local dev only; use env in production
    from infrastructure.external_services.payment.stripe_service import (  # type: ignore  # noqa: E402, E501
        StripePaymentService,
    )
    from infrastructure.external_services.payment.mpesa_service import (  # type: ignore  # noqa: E402, E501
        MpesaPaymentService,
    )

    STRIPE_API_KEY = os.getenv(
        "STRIPE_API_KEY",
        "sk_test_mock_key",
    )  # nosec B105
    M_PESA_CONSUMER_KEY = os.getenv(
        "MPESA_CONSUMER_KEY",
        "mock_key",
    )  # nosec B105
    M_PESA_CONSUMER_SECRET = os.getenv(
        "MPESA_CONSUMER_SECRET",
        "mock_secret",
    )  # nosec B105
    M_PESA_SHORTCODE = os.getenv("MPESA_SHORTCODE", "174379")

    stripe_service = providers.Singleton(
        StripePaymentService,
        api_key=STRIPE_API_KEY,
    )

    mpesa_service = providers.Singleton(
        MpesaPaymentService,
        consumer_key=M_PESA_CONSUMER_KEY,
        consumer_secret=M_PESA_CONSUMER_SECRET,
        shortcode=M_PESA_SHORTCODE,
    )

    # BNB Repositories
    bnb_repository: providers.Factory[BnbRepository]
    bnb_repository = providers.Factory(
        SqlAlchemyBnbRepository,
        session=db_session_factory,
    )

    booking_repository: providers.Factory[BookingRepository]
    booking_repository = providers.Factory(
        SqlAlchemyBookingRepository,
        session=db_session_factory,
    )

    # Tour Repositories
    tour_repository: providers.Factory[TourRepository] = providers.Factory(
        SqlAlchemyTourRepository,
        session=db_session_factory,
    )

    tour_booking_repository: providers.Factory[TourBookingRepository]
    tour_booking_repository = providers.Factory(
        SqlAlchemyTourBookingRepository,
        session=db_session_factory,
    )

    # Tour Availability Repository
    from domain.repositories.tours import TourAvailabilityRepository  # type: ignore  # noqa: E402, E501
    tour_availability_repository: providers.Factory[TourAvailabilityRepository]
    tour_availability_repository = providers.Factory(
        SqlAlchemyTourAvailabilityRepository,
        session=db_session_factory,
    )

    # Car Repositories
    vehicle_repository: providers.Factory[VehicleRepository]
    vehicle_repository = providers.Factory(
        SqlAlchemyVehicleRepository,
        session=db_session_factory,
    )

    car_rental_repository: providers.Factory[CarRentalRepository]
    car_rental_repository = providers.Factory(
        SqlAlchemyCarRentalRepository,
        session=db_session_factory,
    )

    # Property Repository
    property_repository: providers.Factory[PropertyRepository]
    property_repository = providers.Factory(
        SqlAlchemyPropertyRepository,
        session=db_session_factory,
    )

    # Investment Repositories
    investment_repository: providers.Factory[InvestmentRepository]
    investment_repository = providers.Factory(
        SqlAlchemyInvestmentRepository,
        session=db_session_factory,
    )

    investment_holding_repository: providers.Factory[
        InvestmentHoldingRepository
    ]
    investment_holding_repository = providers.Factory(
        SqlAlchemyInvestmentHoldingRepository,
        session=db_session_factory,
    )

    # User Repository
    user_repository: providers.Factory[UserRepository] = providers.Factory(
        SqlAlchemyUserRepository,
        session=db_session_factory,
    )

    # Bundle Repository
    bundle_repository: providers.Factory[BundleRepository]
    bundle_repository = providers.Factory(
        SqlAlchemyBundleRepository,
        session=db_session_factory,
    )

    bundle_booking_repository: providers.Factory[BundleBookingRepository]
    bundle_booking_repository = providers.Factory(
        SqlAlchemyBundleBookingRepository,
        session=db_session_factory,
    )

    # Payment Repository
    from domain.repositories.payment import (  # type: ignore  # noqa: E402
        PaymentRepository,
    )
    from infrastructure.database.repositories.payment import (  # type: ignore  # noqa: E402, E501
        SqlAlchemyPaymentRepository,
    )

    payment_repository: providers.Factory[PaymentRepository]
    payment_repository = providers.Factory(
        SqlAlchemyPaymentRepository,
        session=db_session_factory,
    )

    # Review Repository
    review_repository: providers.Factory[ReviewRepository] = providers.Factory(
        SqlAlchemyReviewRepository,
        session=db_session_factory,
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

    # Location-based grouping use cases
    get_listings_grouped_by_location_use_case = providers.Factory(
        GetListingsGroupedByLocationUseCase,
        bnb_repository=bnb_repository,
    )

    get_listings_by_location_use_case = providers.Factory(
        GetListingsByLocationUseCase,
        bnb_repository=bnb_repository,
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

    get_operator_tour_bookings_use_case = providers.Factory(
        GetOperatorTourBookingsUseCase,
        booking_repository=tour_booking_repository,
        tour_repository=tour_repository,
    )

    modify_tour_booking_use_case = providers.Factory(
        ModifyTourBookingUseCase,
        tour_booking_repository=tour_booking_repository,
        tour_repository=tour_repository,
    )

    cancel_tour_booking_use_case = providers.Factory(
        CancelTourBookingUseCase,
        tour_booking_repository=tour_booking_repository,
    )

    confirm_tour_booking_use_case = providers.Factory(
        ConfirmTourBookingUseCase,
        tour_booking_repository=tour_booking_repository,
    )

    complete_tour_booking_use_case = providers.Factory(
        CompleteTourBookingUseCase,
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

    update_tour_availability_use_case = providers.Factory(
        UpdateTourAvailabilityUseCase,
        tour_repository=tour_repository,
        availability_repository=tour_availability_repository,
    )

    update_tour_pricing_use_case = providers.Factory(
        UpdateTourPricingUseCase,
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

    create_vehicle_use_case = providers.Factory(
        CreateVehicleUseCase,
        vehicle_repository=vehicle_repository,
    )

    list_vehicles_use_case = providers.Factory(
        ListVehiclesUseCase,
        vehicle_repository=vehicle_repository,
    )

    get_vehicle_use_case = providers.Factory(
        GetVehicleUseCase,
        vehicle_repository=vehicle_repository,
    )

    delete_vehicle_use_case = providers.Factory(
        DeleteVehicleUseCase,
        vehicle_repository=vehicle_repository,
    )

    get_rental_use_case = providers.Factory(
        GetRentalUseCase,
        car_rental_repository=car_rental_repository,
    )

    list_rentals_use_case = providers.Factory(
        ListRentalsUseCase,
        car_rental_repository=car_rental_repository,
    )

    check_availability_use_case = providers.Factory(
        CheckAvailabilityUseCase,
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

    # Payment Use Cases
    from application.use_cases.payment.create_payment_intent import (  # type: ignore  # noqa: E402, E501
        CreatePaymentIntentUseCase,
    )
    from application.use_cases.payment.get_payment_status import (  # type: ignore  # noqa: E402, E501
        GetPaymentStatusUseCase,
    )
    from application.use_cases.payment.get_booking_payments import (  # type: ignore  # noqa: E402, E501
        GetBookingPaymentsUseCase,
    )

    create_payment_intent_use_case = providers.Factory(
        CreatePaymentIntentUseCase,
        payment_repository=payment_repository,
        stripe_service=stripe_service,
        mpesa_service=mpesa_service,
    )

    get_payment_status_use_case = providers.Factory(
        GetPaymentStatusUseCase,
        payment_repository=payment_repository,
    )

    get_booking_payments_use_case = providers.Factory(
        GetBookingPaymentsUseCase,
        payment_repository=payment_repository,
    )

    # Review Use Cases
    create_review_use_case = providers.Factory(
        CreateReviewUseCase,
        review_repository=review_repository,
        user_repository=user_repository,
    )

    get_reviews_use_case = providers.Factory(
        GetReviewsUseCase,
        review_repository=review_repository,
        user_repository=user_repository,
    )

    get_review_stats_use_case = providers.Factory(
        GetReviewStatsUseCase,
        review_repository=review_repository,
    )

    respond_to_review_use_case = providers.Factory(
        RespondToReviewUseCase,
        review_repository=review_repository,
    )

    get_user_reviews_use_case = providers.Factory(
        GetUserReviewsUseCase,
        review_repository=review_repository,
        user_repository=user_repository,
    )

    flag_review_use_case = providers.Factory(
        FlagReviewUseCase,
        review_repository=review_repository,
    )

    delete_review_use_case = providers.Factory(
        DeleteReviewUseCase,
        review_repository=review_repository,
        user_repository=user_repository,
    )

    # Analytics Use Cases
    host_dashboard_use_case = providers.Factory(
        HostDashboardUseCase,
        bnb_repository=bnb_repository,
        booking_repository=booking_repository,
        review_repository=review_repository,
    )

    host_earnings_use_case = providers.Factory(
        HostEarningsUseCase,
        bnb_repository=bnb_repository,
        booking_repository=booking_repository,
    )

    tour_operator_dashboard_use_case = providers.Factory(
        TourOperatorDashboardUseCase,
        tour_repository=tour_repository,
        tour_booking_repository=tour_booking_repository,
        review_repository=review_repository,
    )

    tour_operator_earnings_use_case = providers.Factory(
        TourOperatorEarningsUseCase,
        tour_repository=tour_repository,
        tour_booking_repository=tour_booking_repository,
    )
