# Onion Architecture Restructure Plan for Super Platform Ecosystem

## Executive Summary
This document outlines the restructuring of the current FastAPI backend (`/app`) from a traditional layered architecture to **Clean/Onion Architecture** to support the super platform vision combining Airbnb-style rentals, tour packages, property listings, and car rentals.

## Current Architecture Analysis

### Current Structure (Traditional Layered)
```
app/
├── core/           # Infrastructure concerns (config, auth, database)
├── models/         # SQLAlchemy models (data layer)
├── schemas/        # Pydantic DTOs (presentation layer)
├── routers/        # FastAPI routes (controller layer)
├── alembic/        # Database migrations
└── main.py         # Application entry point
```

### Issues with Current Structure
1. **Direct database dependencies in routers** - Tight coupling
2. **Business logic scattered** across routers and models
3. **No clear domain boundaries** between modules
4. **Difficult to test** business logic independently
5. **Hard to extend** for new modules (tours, car rentals)

## Proposed Onion Architecture

### New Directory Structure
```
app/
├── domain/                    # Core Business Logic (Inner Layer)
│   ├── entities/             # Business entities/models
│   │   ├── property/
│   │   ├── bnb/
│   │   ├── investment/
│   │   ├── tours/           # NEW
│   │   ├── cars/            # NEW
│   │   └── user/
│   ├── value_objects/        # Domain value objects
│   ├── repositories/         # Repository interfaces (abstract)
│   └── services/            # Domain services (business rules)
│
├── application/              # Application Logic (Use Cases)
│   ├── use_cases/
│   │   ├── property/
│   │   ├── bnb/
│   │   ├── investment/
│   │   ├── tours/           # NEW
│   │   ├── cars/            # NEW
│   │   └── user/
│   ├── dto/                 # Data Transfer Objects
│   └── interfaces/          # Service interfaces
│
├── infrastructure/           # External Dependencies (Outer Layer)
│   ├── database/
│   │   ├── models/          # SQLAlchemy models
│   │   ├── repositories/    # Repository implementations
│   │   └── migrations/      # Alembic migrations
│   ├── external_services/   # Third-party integrations
│   │   ├── payment/         # M-Pesa, Stripe
│   │   ├── maps/           # Google Maps API
│   │   └── notifications/   # Email, SMS
│   └── config/             # Configuration
│
├── api/                     # API Layer (Outer Layer)
│   ├── v1/
│   │   ├── property/
│   │   ├── bnb/
│   │   ├── investment/
│   │   ├── tours/          # NEW
│   │   ├── cars/           # NEW
│   │   └── user/
│   ├── middleware/
│   └── dependencies/
│
└── shared/                  # Shared utilities
    ├── exceptions/
    ├── events/
    └── utils/
```

## Domain Model Design for Super Platform

### 1. Tours Domain (NEW)
```python
# domain/entities/tours/
class TourPackage:
    id: TourPackageId
    operator_id: UserId
    title: str
    description: str
    duration_days: int
    max_participants: int
    price_per_person: Money
    included_services: List[str]
    itinerary: List[ItineraryItem]
    location: Location
    availability: TourAvailability
    
class TourBooking:
    id: TourBookingId
    package_id: TourPackageId
    guest_id: UserId
    participants: int
    start_date: date
    total_amount: Money
    status: BookingStatus
    special_requirements: Optional[str]

class TourOperator:
    id: UserId
    license_number: str
    company_name: str
    specializations: List[TourType]
    rating: Rating
```

### 2. Car Rentals Domain (NEW)
```python
# domain/entities/cars/
class Vehicle:
    id: VehicleId
    owner_id: UserId
    make: str
    model: str
    year: int
    vehicle_type: VehicleType
    daily_rate: Money
    features: List[str]
    location: Location
    availability: VehicleAvailability
    
class CarRental:
    id: CarRentalId
    vehicle_id: VehicleId
    renter_id: UserId
    pickup_date: datetime
    return_date: datetime
    pickup_location: Location
    return_location: Location
    total_cost: Money
    insurance_opted: bool
    status: RentalStatus

class RentalProvider:
    id: UserId
    fleet_size: int
    service_areas: List[Location]
    insurance_partnerships: List[str]
```

### 3. Enhanced BNB Domain
```python
# domain/entities/bnb/
class ShortTermListing:
    id: ListingId
    host_id: UserId
    property_details: PropertyDetails
    pricing: PricingStrategy
    availability: Calendar
    booking_rules: BookingRules
    
    def calculate_total_cost(self, check_in: date, check_out: date) -> Money:
        # Business logic for pricing calculation
        
    def is_available(self, date_range: DateRange) -> bool:
        # Availability checking logic
```

## Implementation Phases

### Phase 1: Core Restructure (Weeks 1-3)
1. **Create new directory structure**
2. **Move existing models to domain entities**
3. **Extract business logic from routers to use cases**
4. **Implement repository pattern**
5. **Setup dependency injection**

### Phase 2: Tours Module (Weeks 4-6)
1. **Design tour package domain model**
2. **Implement tour booking use cases**
3. **Create tour operator management**
4. **Build tour search and filtering**
5. **Add bundling with accommodation**

### Phase 3: Car Rentals Module (Weeks 7-9)
1. **Design vehicle rental domain model**
2. **Implement rental booking system**
3. **Add vehicle fleet management**
4. **Create integration with tours/accommodation**
5. **Implement insurance and damage tracking**

### Phase 4: Integration & Bundling (Weeks 10-12)
1. **Cross-module bundling system**
2. **Unified booking experience**
3. **Payment processing integration**
4. **Advanced search across all modules**
5. **Analytics and reporting**

## Key Use Cases for Super Platform

### Tours Module Use Cases
```python
# application/use_cases/tours/
class CreateTourPackageUseCase:
    def execute(self, request: CreateTourPackageRequest) -> TourPackageResponse
    
class SearchToursUseCase:
    def execute(self, criteria: TourSearchCriteria) -> List[TourPackageResponse]
    
class BookTourUseCase:
    def execute(self, request: BookTourRequest) -> TourBookingResponse
    
class BundleTourWithAccommodationUseCase:
    def execute(self, request: BundleRequest) -> BundleResponse
```

### Car Rentals Use Cases
```python
# application/use_cases/cars/
class AddVehicleToFleetUseCase:
    def execute(self, request: AddVehicleRequest) -> VehicleResponse
    
class SearchAvailableVehiclesUseCase:
    def execute(self, criteria: VehicleSearchCriteria) -> List[VehicleResponse]
    
class CreateRentalBookingUseCase:
    def execute(self, request: RentalBookingRequest) -> RentalBookingResponse
    
class BundleVehicleWithTourUseCase:
    def execute(self, request: VehicleTourBundleRequest) -> BundleResponse
```

## API Structure for Super Platform

### Tours API Endpoints
```python
# api/v1/tours/
POST   /api/v1/tours/packages              # Create tour package
GET    /api/v1/tours/packages              # Search tour packages
GET    /api/v1/tours/packages/{id}         # Get tour details
POST   /api/v1/tours/bookings              # Book a tour
GET    /api/v1/tours/bookings              # List user bookings
POST   /api/v1/tours/bundles               # Create tour + accommodation bundle
```

### Car Rentals API Endpoints
```python
# api/v1/cars/
POST   /api/v1/cars/vehicles               # Add vehicle to fleet
GET    /api/v1/cars/vehicles               # Search available vehicles
GET    /api/v1/cars/vehicles/{id}          # Get vehicle details
POST   /api/v1/cars/rentals                # Create rental booking
GET    /api/v1/cars/rentals                # List user rentals
POST   /api/v1/cars/bundles                # Create vehicle + tour bundle
```

## Dependency Injection Setup

### Container Configuration
```python
# infrastructure/container.py
from dependency_injector import containers, providers

class ApplicationContainer(containers.DeclarativeContainer):
    # Database
    database = providers.Singleton(Database, url=config.DATABASE_URL)
    
    # Repositories
    property_repository = providers.Factory(PropertyRepository, database)
    tour_repository = providers.Factory(TourRepository, database)
    vehicle_repository = providers.Factory(VehicleRepository, database)
    
    # Use Cases
    search_tours_use_case = providers.Factory(
        SearchToursUseCase, 
        tour_repository=tour_repository
    )
    create_rental_use_case = providers.Factory(
        CreateRentalBookingUseCase,
        vehicle_repository=vehicle_repository
    )
```

## Benefits of Onion Architecture for Super Platform

### 1. **Scalability**
- Independent module development
- Easy to add new service types (boats, bikes, etc.)
- Horizontal scaling per domain

### 2. **Maintainability**
- Clear separation of concerns
- Business logic isolation
- Easy testing of core functionality

### 3. **Flexibility**
- Database-agnostic domain layer
- Easy integration with external services
- Plugin-like module architecture

### 4. **Team Development**
- Different teams can work on different domains
- Clear interfaces between layers
- Reduced merge conflicts

## Migration Strategy

### Step 1: Gradual Extraction
1. Start with existing BNB module
2. Extract business logic to use cases
3. Move data access to repositories
4. Test thoroughly before proceeding

### Step 2: New Module Development
1. Build tours module with onion architecture
2. Use as template for car rentals
3. Validate architecture decisions

### Step 3: Integration
1. Build cross-module services
2. Implement bundling functionality
3. Create unified search experience

## Technology Stack Enhancements

### Additional Dependencies
```python
# requirements.txt additions
dependency-injector>=4.41.0    # Dependency injection
pydantic-settings>=2.1.0       # Enhanced configuration
structlog>=23.2.0              # Structured logging
tenacity>=8.2.3               # Retry mechanisms
redis>=5.0.0                  # Caching layer
celery>=5.3.0                 # Background tasks
```

### New Infrastructure Services
```python
# infrastructure/external_services/
- payment/
  - mpesa_service.py           # M-Pesa integration
  - stripe_service.py          # International payments
- maps/
  - google_maps_service.py     # Location services
- notifications/
  - email_service.py           # Email notifications
  - sms_service.py             # SMS notifications
```

This onion architecture restructure will provide a solid foundation for building the super platform ecosystem while maintaining clean separation of concerns and enabling rapid feature development across all modules.



