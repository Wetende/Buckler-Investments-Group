"""Comprehensive seed data for BnB listings and Tours.

This script creates:
- 15+ demo users: hosts, tour operators, and customers
- 50 BnB listings with varied locations, types, and amenities
- 30 Tours with different categories and durations
- Realistic bookings, availability, and sample data for all endpoints

Idempotent: running multiple times will not duplicate records (checks by unique keys).
"""
from __future__ import annotations

import asyncio
import random
from datetime import date, timedelta
from decimal import Decimal
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from infrastructure.config.database import AsyncSessionLocal
from infrastructure.database.models.user import User as UserModel
from shared.constants.user_roles import UserRole
from infrastructure.config.auth import get_password_hash

from infrastructure.database.models.bnb_listing import (
    StListing as StListingModel,
    StAvailability as StAvailabilityModel,
    Booking as StBookingModel,
)
from domain.value_objects.booking_status import StListingType, CancellationPolicy, BookingStatus

from infrastructure.database.models.tours import Tour as TourModel
from infrastructure.database.models.tour_booking import TourBooking as TourBookingModel

# Seed data constants
KENYAN_LOCATIONS = [
    "Nairobi CBD, Kenya", "Westlands, Nairobi", "Karen, Nairobi", "Kilimani, Nairobi",
    "Lavington, Nairobi", "Parklands, Nairobi", "South B, Nairobi", "South C, Nairobi",
    "Mombasa Island, Kenya", "Nyali, Mombasa", "Diani Beach, Kenya", "Malindi, Kenya",
    "Kisumu, Kenya", "Nakuru, Kenya", "Eldoret, Kenya", "Thika, Kenya",
    "Machakos, Kenya", "Nyeri, Kenya", "Meru, Kenya", "Kitale, Kenya"
]

BNB_TITLES = [
    "Modern Studio in City Center", "Cozy Apartment with Garden View", "Luxury Penthouse Suite",
    "Budget-Friendly Room", "Family House with Pool", "Beachfront Villa", "Mountain View Cottage",
    "Business Traveler's Retreat", "Artist's Loft", "Traditional Kenyan Home", "Serviced Apartment",
    "Student Housing", "Executive Suite", "Backpacker's Haven", "Romantic Getaway", "Safari Lodge Room",
    "Urban Oasis", "Cultural Heritage House", "Tech Hub Apartment", "Wellness Retreat Space",
    "Creative Workspace", "Minimalist Design Studio", "Vintage Charm House", "Eco-Friendly Lodge",
    "Rooftop Terrace Apartment", "Historic Building Suite", "Modern Townhouse", "Gated Community Home",
    "Riverside Cabin", "Hilltop Villa", "Downtown Loft", "Suburban Family Home", "Boutique Hotel Room",
    "Co-living Space", "Designer Apartment", "Garden Cottage", "City View Penthouse", "Quiet Retreat",
    "Sports Enthusiast's Base", "Foodie's Paradise Location", "Shopping District Apartment",
    "University Area Room", "Airport Transit Suite", "Conference Center Lodge", "Spa Resort Room",
    "Adventure Base Camp", "Cultural District Home", "Innovation Hub Suite", "Wellness Center Room",
    "Luxury Safari Tent", "Coastal Retreat House"
]

TOUR_NAMES = [
    "Nairobi National Park Safari", "Maasai Mara Wildlife Experience", "Mount Kenya Hiking Adventure",
    "Diani Beach Sunset Tour", "Mombasa City Cultural Walk", "Lake Nakuru Bird Watching",
    "Samburu Game Reserve Safari", "Aberdare Forest Nature Walk", "Hell's Gate Cycling Tour",
    "Karen Blixen Museum Visit", "Giraffe Center Experience", "David Sheldrick Elephant Orphanage",
    "Bomas of Kenya Cultural Show", "Nairobi Railway Museum Tour", "Karura Forest Canopy Walk",
    "Ngong Hills Hiking", "Lake Naivasha Boat Ride", "Crescent Island Walking Safari",
    "Nakuru National Park Day Trip", "Maasai Village Cultural Tour", "Tsavo East Safari",
    "Amboseli Elephant Safari", "Lamu Island Historical Tour", "Malindi Marine Park Snorkeling",
    "Watamu Turtle Watching", "Shimba Hills Forest Safari", "Kakamega Rainforest Tour",
    "Mount Elgon Cave Exploration", "Lake Victoria Fishing Tour", "Meru National Park Safari"
]

AMENITIES_POOL = [
    {"wifi": True, "parking": True, "kitchen": True, "ac": True},
    {"wifi": True, "pool": True, "gym": True, "balcony": True},
    {"wifi": True, "garden": True, "bbq": True, "fireplace": True},
    {"wifi": True, "parking": True, "laundry": True, "security": True},
    {"wifi": True, "beach_access": True, "restaurant": True, "spa": True},
    {"wifi": True, "mountain_view": True, "hiking_trails": True, "breakfast": True},
    {"wifi": True, "city_view": True, "concierge": True, "business_center": True},
    {"wifi": True, "pet_friendly": True, "playground": True, "family_room": True}
]

TOUR_CATEGORIES = {
    "Wildlife Safari": {"duration_range": (4, 72), "price_range": (80, 600)},
    "Cultural Tours": {"duration_range": (2, 8), "price_range": (30, 150)},
    "Adventure": {"duration_range": (4, 24), "price_range": (50, 300)},
    "Beach & Coast": {"duration_range": (3, 12), "price_range": (40, 200)},
    "City Tours": {"duration_range": (2, 6), "price_range": (25, 100)},
    "Nature Walks": {"duration_range": (3, 10), "price_range": (35, 120)}
}


async def get_or_create_user(session: AsyncSession, email: str, name: str, role: UserRole) -> UserModel:
    stmt = select(UserModel).where(UserModel.email == email)
    result = await session.execute(stmt)
    user = result.scalar_one_or_none()
    if user:
        return user

    user = UserModel(
        email=email,
        name=name,
        role=role,
        hashed_password=get_password_hash("password123"),
        is_active=True,
    )
    session.add(user)
    await session.flush()
    return user


async def get_or_create_bnb_listing(
    session: AsyncSession,
    host_id: int,
    title: str,
    listing_type: StListingType,
    capacity: int,
    nightly_price: Decimal,
    address: str,
    instant_book: bool = True,
    min_nights: Optional[int] = 1,
    max_nights: Optional[int] = 30,
) -> StListingModel:
    stmt = select(StListingModel).where(StListingModel.title == title)
    result = await session.execute(stmt)
    listing = result.scalar_one_or_none()
    if listing:
        return listing

    # Random property details
    bedrooms = random.randint(0, 4) if capacity > 1 else 0
    beds = max(1, bedrooms + random.randint(0, 2))
    baths = round(random.uniform(0.5, 3.0) * 2) / 2  # 0.5, 1.0, 1.5, etc.
    
    # Random fees
    cleaning_fee = Decimal(str(random.randint(5, 30)))
    service_fee = Decimal(str(random.randint(3, 15)))
    security_deposit = Decimal(str(random.randint(20, 100)))
    
    # Random coordinates within Kenya bounds
    latitude = round(random.uniform(-4.7, 5.0), 6)
    longitude = round(random.uniform(33.9, 41.9), 6)
    
    # Random amenities and policies
    amenities = random.choice(AMENITIES_POOL)
    cancellation_policy = random.choice([CancellationPolicy.FLEXIBLE, CancellationPolicy.MODERATE, CancellationPolicy.STRICT])
    
    # Random images
    image_seed = random.randint(1, 1000)
    images = [
        f"https://picsum.photos/seed/bnb{image_seed}/800/600",
        f"https://picsum.photos/seed/bnb{image_seed + 1}/800/600",
        f"https://picsum.photos/seed/bnb{image_seed + 2}/800/600",
    ]

    listing = StListingModel(
        host_id=host_id,
        title=title,
        type=listing_type,  # Enum stored as string in model
        capacity=capacity,
        bedrooms=bedrooms,
        beds=beds,
        baths=baths,
        nightly_price=nightly_price,
        cleaning_fee=cleaning_fee,
        service_fee=service_fee,
        security_deposit=security_deposit,
        address=address,
        latitude=latitude,
        longitude=longitude,
        amenities=amenities,
        rules={"no_smoking": True, "no_parties": random.choice([True, False]), "no_pets": random.choice([True, False])},
        cancellation_policy=cancellation_policy,
        instant_book=instant_book,
        min_nights=min_nights,
        max_nights=max_nights,
        images=images,
    )
    session.add(listing)
    await session.flush()
    return listing


async def get_or_create_tour(
    session: AsyncSession,
    name: str,
    description: str,
    price: Decimal,
    duration_hours: int,
    operator_id: int,
    max_participants: int,
    included_services: Optional[dict] = None,
) -> TourModel:
    stmt = select(TourModel).where(TourModel.name == name)
    result = await session.execute(stmt)
    tour = result.scalar_one_or_none()
    if tour:
        return tour

    tour = TourModel(
        name=name,
        description=description,
        price=price,
        duration_hours=duration_hours,
        operator_id=operator_id,
        max_participants=max_participants,
        included_services=included_services or {"transport": True, "guide": True},
    )
    session.add(tour)
    await session.flush()
    return tour


async def create_comprehensive_users(session: AsyncSession) -> list[UserModel]:
    """Create diverse users for comprehensive testing."""
    users = []
    
    # Create hosts
    host_data = [
        ("john.host@example.com", "John Kariuki", UserRole.HOST),
        ("mary.host@example.com", "Mary Wanjiku", UserRole.HOST),
        ("david.host@example.com", "David Mburu", UserRole.HOST),
        ("grace.host@example.com", "Grace Akinyi", UserRole.HOST),
        ("peter.host@example.com", "Peter Kiptoo", UserRole.HOST),
        ("sarah.host@example.com", "Sarah Muthoni", UserRole.HOST),
    ]
    
    # Create tour operators
    operator_data = [
        ("safari.tours@example.com", "Safari Adventures Kenya", UserRole.TOUR_OPERATOR),
        ("cultural.tours@example.com", "Cultural Heritage Tours", UserRole.TOUR_OPERATOR),
        ("adventure.ke@example.com", "Adventure Kenya Ltd", UserRole.TOUR_OPERATOR),
        ("coastal.tours@example.com", "Coastal Experience Tours", UserRole.TOUR_OPERATOR),
        ("urban.tours@example.com", "Urban Explorer Tours", UserRole.TOUR_OPERATOR),
    ]
    
    # Create customers
    customer_data = [
        ("alice.customer@example.com", "Alice Johnson", UserRole.USER),
        ("bob.customer@example.com", "Bob Smith", UserRole.USER),
        ("carol.customer@example.com", "Carol Davis", UserRole.USER),
        ("daniel.customer@example.com", "Daniel Wilson", UserRole.USER),
        ("emma.customer@example.com", "Emma Brown", UserRole.USER),
    ]
    
    all_user_data = host_data + operator_data + customer_data
    
    for email, name, role in all_user_data:
        user = await get_or_create_user(session, email, name, role)
        users.append(user)
    
    return users


async def create_comprehensive_bnb_listings(session: AsyncSession, hosts: list[UserModel]) -> list[StListingModel]:
    """Create 50 diverse BnB listings."""
    listings = []
    
    for i in range(50):
        host = random.choice(hosts)
        title = BNB_TITLES[i]
        location = random.choice(KENYAN_LOCATIONS)
        listing_type = random.choice([StListingType.ENTIRE, StListingType.PRIVATE, StListingType.SHARED])
        capacity = random.randint(1, 8)
        base_price = random.randint(20, 200)
        
        listing = await get_or_create_bnb_listing(
            session,
            host_id=host.id,
            title=title,
            listing_type=listing_type,
            capacity=capacity,
            nightly_price=Decimal(str(base_price)),
            address=location,
            instant_book=random.choice([True, False]),
            min_nights=random.choice([1, 2, 3]),
            max_nights=random.choice([30, 60, 90]),
        )
        listings.append(listing)
    
    return listings


async def create_comprehensive_tours(session: AsyncSession, operators: list[UserModel]) -> list[TourModel]:
    """Create 30 diverse tours."""
    tours = []
    
    for i in range(30):
        operator = random.choice(operators)
        name = TOUR_NAMES[i]
        category = random.choice(list(TOUR_CATEGORIES.keys()))
        category_info = TOUR_CATEGORIES[category]
        
        duration = random.randint(*category_info["duration_range"])
        price = random.randint(*category_info["price_range"])
        max_participants = random.randint(4, 20)
        
        description = f"An amazing {category.lower()} experience in Kenya. Duration: {duration} hours."
        
        included_services = {
            "transport": True,
            "guide": True,
            "meals": duration > 8,
            "accommodation": duration > 24,
            "equipment": category == "Adventure",
            "park_fees": "Wildlife" in category or "Nature" in category,
        }
        
        tour = await get_or_create_tour(
            session,
            name=name,
            description=description,
            price=Decimal(str(price)),
            duration_hours=duration,
            operator_id=operator.id,
            max_participants=max_participants,
            included_services=included_services,
        )
        tours.append(tour)
    
    return tours


async def create_availability_and_bookings(session: AsyncSession, listings: list[StListingModel], tours: list[TourModel], customers: list[UserModel]) -> None:
    """Create availability and sample bookings for comprehensive testing."""
    today = date.today()
    
    # Create 30 days of availability for all listings
    async def ensure_availability(listing_id: int, start: date, days: int = 30):
        for i in range(days):
            d = start + timedelta(days=i)
            stmt = select(StAvailabilityModel).where(
                (StAvailabilityModel.listing_id == listing_id)
                & (StAvailabilityModel.date == d)
            )
            result = await session.execute(stmt)
            exists = result.scalar_one_or_none()
            if not exists:
                # Random availability (90% available)
                is_available = random.random() > 0.1
                price_override = None
                if random.random() > 0.8:  # 20% chance of price override
                    price_override = Decimal(str(random.randint(50, 300)))
                
                session.add(
                    StAvailabilityModel(
                        listing_id=listing_id,
                        date=d,
                        is_available=is_available,
                        price_override=price_override,
                        min_nights_override=None,
                    )
                )
    
    # Add availability for all listings
    for listing in listings:
        await ensure_availability(listing.id, today)
    
    # Create sample BnB bookings
    async def create_bnb_booking(listing: StListingModel, customer: UserModel, check_in: date, nights: int):
        check_out = check_in + timedelta(days=nights)
        stmt = select(StBookingModel).where(
            (StBookingModel.listing_id == listing.id)
            & (StBookingModel.guest_id == customer.id)
            & (StBookingModel.check_in == check_in)
        )
        result = await session.execute(stmt)
        existing = result.scalar_one_or_none()
        if existing:
            return existing
        
        # Calculate total amount
        base_amount = listing.nightly_price * nights
        total_amount = base_amount + (listing.cleaning_fee or Decimal("0"))
        
        booking = StBookingModel(
            listing_id=listing.id,
            guest_id=customer.id,
            check_in=check_in,
            check_out=check_out,
            guests=random.randint(1, listing.capacity),
            amount_total=total_amount,
            currency="KES",
            status=random.choice([BookingStatus.CONFIRMED, BookingStatus.PENDING, BookingStatus.COMPLETED]),
        )
        session.add(booking)
        await session.flush()
        return booking
    
    # Create sample tour bookings
    async def create_tour_booking(tour: TourModel, customer: UserModel, booking_date: date, participants: int):
        stmt = select(TourBookingModel).where(
            (TourBookingModel.tour_id == tour.id)
            & (TourBookingModel.customer_id == customer.id)
            & (TourBookingModel.booking_date == booking_date)
        )
        result = await session.execute(stmt)
        existing = result.scalar_one_or_none()
        if existing:
            return existing
        
        # Get price
        price_result = await session.execute(
            select(TourModel.price).where(TourModel.id == tour.id)
        )
        price_value: Decimal = price_result.scalar_one()
        total: Decimal = price_value * participants
        
        booking = TourBookingModel(
            tour_id=tour.id,
            customer_id=customer.id,
            booking_date=booking_date,
            participants=participants,
            total_price=total,
            status=random.choice(["CONFIRMED", "PENDING", "COMPLETED"]),
        )
        session.add(booking)
        await session.flush()
        return booking
    
    # Create 20 random BnB bookings
    for _ in range(20):
        listing = random.choice(listings)
        customer = random.choice(customers)
        check_in = today + timedelta(days=random.randint(1, 60))
        nights = random.randint(1, 7)
        await create_bnb_booking(listing, customer, check_in, nights)
    
    # Create 15 random tour bookings
    for _ in range(15):
        tour = random.choice(tours)
        customer = random.choice(customers)
        booking_date = today + timedelta(days=random.randint(1, 30))
        # Get max_participants as integer
        max_participants_result = await session.execute(
            select(TourModel.max_participants).where(TourModel.id == tour.id)
        )
        max_participants_value: int = max_participants_result.scalar_one()
        max_allowed = min(6, max_participants_value)
        participants = random.randint(1, max_allowed)
        await create_tour_booking(tour, customer, booking_date, participants)


async def seed() -> None:
    async with AsyncSessionLocal() as session:
        print("Creating comprehensive seed data...")
        
        # Create users
        print("Creating users...")
        all_users = await create_comprehensive_users(session)
        hosts = [u for u in all_users if u.role == UserRole.HOST]
        operators = [u for u in all_users if u.role == UserRole.TOUR_OPERATOR]
        customers = [u for u in all_users if u.role == UserRole.USER]
        
        # Create BnB listings
        print("Creating 50 BnB listings...")
        listings = await create_comprehensive_bnb_listings(session, hosts)
        
        # Create tours
        print("Creating 30 tours...")
        tours = await create_comprehensive_tours(session, operators)
        
        # Create availability and bookings
        print("Creating availability and sample bookings...")
        await create_availability_and_bookings(session, listings, tours, customers)
        
        await session.commit()
        print(f"Seed complete! Created {len(all_users)} users, {len(listings)} BnB listings, {len(tours)} tours.")
        print("Sample data includes availability, bookings, and diverse test scenarios.")


if __name__ == "__main__":
    asyncio.run(seed())


