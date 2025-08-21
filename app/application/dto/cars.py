from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
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
    daily_rate: Money

    class Config:
        arbitrary_types_allowed = True

    @classmethod
    def from_entity(cls, entity: Vehicle) -> "VehicleResponse":
        return cls(
            id=entity.id,
            make=entity.make,
            model=entity.model,
            year=entity.year,
            daily_rate=entity.daily_rate
        )

class CreateRentalRequest(BaseModel):
    vehicle_id: int
    renter_id: int
    pickup_date: datetime
    return_date: datetime

class RentalResponse(BaseModel):
    id: int
    vehicle_id: int
    status: str
    total_cost: Money

    class Config:
        arbitrary_types_allowed = True

    @classmethod
    def from_entity(cls, entity: CarRental) -> "RentalResponse":
        return cls(
            id=entity.id,
            vehicle_id=entity.vehicle_id,
            status=entity.status,
            total_cost=entity.total_cost
        )
