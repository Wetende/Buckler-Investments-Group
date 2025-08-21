from ....domain.entities.cars import Vehicle, CarRental
from ....infrastructure.database.models.vehicle import Vehicle as VehicleModel
from ....infrastructure.database.models.car_rental import CarRental as CarRentalModel
from ....domain.value_objects.money import Money

class CarMapper:
    @staticmethod
    def model_to_entity(model: VehicleModel) -> Vehicle:
        return Vehicle(
            id=model.id,
            make=model.make,
            model=model.model,
            year=model.year,
            daily_rate=Money(model.daily_rate, "KES"),
            owner_id=model.owner_id,
            features=model.features,
            created_at=model.created_at,
            updated_at=model.updated_at
        )

    @staticmethod
    def entity_to_model(entity: Vehicle) -> VehicleModel:
        return VehicleModel(
            id=entity.id if entity.id else None,
            make=entity.make,
            model=entity.model,
            year=entity.year,
            daily_rate=entity.daily_rate.amount,
            owner_id=entity.owner_id,
            features=entity.features
        )

    @staticmethod
    def rental_model_to_entity(model: CarRentalModel) -> CarRental:
        return CarRental(
            id=model.id,
            vehicle_id=model.vehicle_id,
            renter_id=model.renter_id,
            pickup_date=model.pickup_date,
            return_date=model.return_date,
            total_cost=Money(model.total_cost, "KES"),
            status=model.status,
            created_at=model.created_at,
            updated_at=model.updated_at
        )

    @staticmethod
    def rental_entity_to_model(entity: CarRental) -> CarRentalModel:
        return CarRentalModel(
            id=entity.id if entity.id else None,
            vehicle_id=entity.vehicle_id,
            renter_id=entity.renter_id,
            pickup_date=entity.pickup_date,
            return_date=entity.return_date,
            total_cost=entity.total_cost.amount,
            status=entity.status
        )
