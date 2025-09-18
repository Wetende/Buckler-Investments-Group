from datetime import datetime
from domain.entities.cars import Vehicle
from domain.repositories.cars import VehicleRepository
from domain.value_objects.money import Money
from application.dto.cars import CreateVehicleRequest, VehicleResponse


class CreateVehicleUseCase:
    def __init__(self, vehicle_repository: VehicleRepository):
        self._vehicle_repository = vehicle_repository

    async def execute(self, request: CreateVehicleRequest) -> VehicleResponse:
        """Create new vehicle (id=0) or update existing vehicle (id>0)"""
        
        # Create Money object for daily rate
        daily_rate = Money(request.daily_rate, request.currency)
        
        if request.id == 0:
            # Create new vehicle
            vehicle = Vehicle(
                id=0,
                make=request.make,
                model=request.model,
                year=request.year,
                daily_rate=daily_rate,
                owner_id=request.owner_id,
                features=request.features or [],
                images=request.images or [],
                location=request.location,
                description=request.description,
                category=request.category or "economy",
                transmission=request.transmission or "manual",
                fuel_type=request.fuel_type or "petrol",
                seats=request.seats or 5,
                status=request.status or "available",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            saved_vehicle = await self._vehicle_repository.create(vehicle)
        else:
            # Update existing vehicle
            existing_vehicle = await self._vehicle_repository.get_by_id(request.id)
            if not existing_vehicle:
                raise ValueError(f"Vehicle with ID {request.id} not found")
            
            # Update fields
            existing_vehicle.make = request.make
            existing_vehicle.model = request.model
            existing_vehicle.year = request.year
            existing_vehicle.daily_rate = daily_rate
            existing_vehicle.features = request.features or []
            existing_vehicle.images = request.images or []
            existing_vehicle.location = request.location
            existing_vehicle.description = request.description
            existing_vehicle.category = request.category or existing_vehicle.category
            existing_vehicle.transmission = request.transmission or existing_vehicle.transmission
            existing_vehicle.fuel_type = request.fuel_type or existing_vehicle.fuel_type
            existing_vehicle.seats = request.seats or existing_vehicle.seats
            existing_vehicle.status = request.status or existing_vehicle.status
            existing_vehicle.updated_at = datetime.utcnow()
            
            saved_vehicle = await self._vehicle_repository.update(existing_vehicle)
        
        return VehicleResponse.from_entity(saved_vehicle)
