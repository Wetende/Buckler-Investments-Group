from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict

from infrastructure.database.models.bnb_listing import StListingType, CancellationPolicy, BookingStatus


class StListingRead(BaseModel):
    id: int
    host_id: int
    title: str
    type: StListingType
    capacity: int
    bedrooms: Optional[int] = None
    beds: Optional[int] = None
    baths: Optional[float] = None
    nightly_price: Decimal
    cleaning_fee: Optional[Decimal] = None
    service_fee: Optional[Decimal] = None
    security_deposit: Optional[Decimal] = None
    address: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    amenities: Optional[dict] = None
    rules: Optional[dict] = None
    cancellation_policy: CancellationPolicy
    instant_book: bool
    min_nights: Optional[int] = None
    max_nights: Optional[int] = None
    images: Optional[list] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class StListingCU(BaseModel):
    id: int = 0
    title: str = Field(..., min_length=3, max_length=200)
    type: StListingType
    capacity: int = Field(..., ge=1)
    bedrooms: Optional[int] = Field(None, ge=0)
    beds: Optional[int] = Field(None, ge=0)
    baths: Optional[float] = Field(None, ge=0)
    nightly_price: Decimal = Field(..., gt=0)
    cleaning_fee: Optional[Decimal] = Field(None, ge=0)
    service_fee: Optional[Decimal] = Field(None, ge=0)
    security_deposit: Optional[Decimal] = Field(None, ge=0)
    address: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    amenities: Optional[dict] = None
    rules: Optional[dict] = None
    cancellation_policy: CancellationPolicy = CancellationPolicy.MODERATE
    instant_book: bool = False
    min_nights: Optional[int] = Field(None, ge=0)
    max_nights: Optional[int] = Field(None, ge=0)
    images: Optional[list] = None


class AvailabilityItem(BaseModel):
    date: date
    is_available: bool
    price_override: Optional[Decimal] = None
    min_nights_override: Optional[int] = None


class AvailabilityUpsert(BaseModel):
    listing_id: int
    items: List[AvailabilityItem]


class BookingCU(BaseModel):
    id: int = 0
    listing_id: int
    check_in: date
    check_out: date
    guests: int = Field(..., ge=1)


class BookingRead(BaseModel):
    id: int
    listing_id: int
    guest_id: int
    check_in: date
    check_out: date
    guests: int
    status: BookingStatus
    amount_total: Decimal
    currency: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MessageCU(BaseModel):
    body: str = Field(..., min_length=1, max_length=5000)


class MessageRead(BaseModel):
    id: int
    booking_id: int
    sender_id: int
    body: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Search and response DTOs for use cases
class SearchListingsRequest(BaseModel):
    check_in: date
    check_out: date
    guests: int
    price_max: Optional[Decimal] = None
    instant_book_only: bool = False
    location: Optional[str] = None


class ListingResponse(BaseModel):
    id: int
    title: str
    type: str
    capacity: int
    nightly_price: Decimal
    location: str
    instant_book: bool
    rating: Optional[float] = None
    
    @classmethod
    def from_entity(cls, entity) -> 'ListingResponse':
        return cls(
            id=entity.id,
            title=entity.title,
            type=entity.type.value if hasattr(entity.type, 'value') else str(entity.type),
            capacity=entity.capacity,
            nightly_price=entity.nightly_price.amount,
            location=entity.location,
            instant_book=entity.instant_book,
            rating=entity.rating
        )


class CreateBookingRequest(BaseModel):
    listing_id: int
    check_in: date
    check_out: date
    guests: int
    guest_email: str
    guest_phone: Optional[str] = None
    special_requests: Optional[str] = None


class BookingResponse(BaseModel):
    id: int
    listing_id: int
    guest_id: int
    check_in: date
    check_out: date
    guests: int
    total_amount: Decimal
    status: str
    
    @classmethod
    def from_entity(cls, entity) -> 'BookingResponse':
        return cls(
            id=entity.id,
            listing_id=entity.listing_id,
            guest_id=entity.guest_id,
            check_in=entity.check_in,
            check_out=entity.check_out,
            guests=entity.guests,
            total_amount=entity.total_amount.amount,
            status=entity.status.value if hasattr(entity.status, 'value') else str(entity.status)
        )



