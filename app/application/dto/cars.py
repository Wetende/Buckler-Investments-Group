from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import List, Optional
from decimal import Decimal
from domain.entities.cars import Vehicle, CarRental
from domain.value_objects.money import Money

class SearchVehiclesRequest(BaseModel):
    start_date: datetime
    end_date: datetime
    max_price: Optional[float] = None

class VehicleResponse(BaseModel):
    id: int
    make: str
    model: str
    year: int
    daily_rate: Decimal
    currency: str
    owner_id: int
    features: Optional[List[str]] = None
    images: Optional[List[str]] = None
    location: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    transmission: Optional[str] = None
    fuel_type: Optional[str] = None
    seats: Optional[int] = None
    status: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

    @classmethod
    def from_entity(cls, entity: Vehicle) -> "VehicleResponse":
        return cls(
            id=entity.id,
            make=entity.make,
            model=entity.model,
            year=entity.year,
            daily_rate=entity.daily_rate.amount,
            currency=entity.daily_rate.currency,
            owner_id=entity.owner_id,
            features=entity.features or [],
            images=getattr(entity, 'images', []),
            location=getattr(entity, 'location', None),
            description=getattr(entity, 'description', None),
            category=getattr(entity, 'category', None),
            transmission=getattr(entity, 'transmission', None),
            fuel_type=getattr(entity, 'fuel_type', None),
            seats=getattr(entity, 'seats', None),
            status=getattr(entity, 'status', 'available'),
            created_at=getattr(entity, 'created_at', None),
            updated_at=getattr(entity, 'updated_at', None)
        )

class CreateRentalRequest(BaseModel):
    vehicle_id: int
    renter_id: int
    pickup_date: datetime
    return_date: datetime

class RentalResponse(BaseModel):
    id: int
    vehicle_id: int
    renter_id: int
    pickup_date: datetime
    return_date: datetime
    status: str
    total_cost: Decimal
    currency: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

    @classmethod
    def from_entity(cls, entity: CarRental) -> "RentalResponse":
        return cls(
            id=entity.id,
            vehicle_id=entity.vehicle_id,
            renter_id=entity.renter_id,
            pickup_date=entity.pickup_date,
            return_date=entity.return_date,
            status=entity.status,
            total_cost=entity.total_cost.amount,
            currency=entity.total_cost.currency,
            created_at=getattr(entity, 'created_at', None),
            updated_at=getattr(entity, 'updated_at', None)
        )

# Vehicle Creation/Update DTOs
class CreateVehicleRequest(BaseModel):
    id: int = Field(ge=0, description="0 for create, positive for update")
    make: str = Field(min_length=1, max_length=50)
    model: str = Field(min_length=1, max_length=50)
    year: int = Field(ge=1900, le=2030)
    daily_rate: Decimal = Field(gt=0)
    currency: str = Field(default="KES", max_length=3)
    owner_id: int = Field(gt=0)
    features: Optional[List[str]] = None
    images: Optional[List[str]] = None
    location: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = Field(default="economy")  # economy, compact, luxury, suv, etc.
    transmission: Optional[str] = Field(default="manual")  # manual, automatic
    fuel_type: Optional[str] = Field(default="petrol")  # petrol, diesel, electric, hybrid
    seats: Optional[int] = Field(ge=2, le=12, default=5)
    status: Optional[str] = Field(default="available")  # available, rented, maintenance

    model_config = ConfigDict(from_attributes=True)

class UpdateVehicleRequest(CreateVehicleRequest):
    id: int = Field(gt=0, description="Vehicle ID to update")

# Availability DTOs
class AvailabilityRequest(BaseModel):
    vehicle_id: int
    start_date: datetime
    end_date: datetime

class AvailabilityResponse(BaseModel):
    vehicle_id: int
    available: bool
    conflicting_rentals: Optional[List[int]] = None  # List of rental IDs that conflict

    model_config = ConfigDict(from_attributes=True)
