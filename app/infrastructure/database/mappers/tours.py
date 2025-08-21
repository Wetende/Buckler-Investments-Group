from ....domain.entities.tours import Tour, TourBooking
from ....infrastructure.database.models.tours import Tour as TourModel
from ....infrastructure.database.models.tour_booking import TourBooking as TourBookingModel
from ....domain.value_objects.money import Money

class TourMapper:
    @staticmethod
    def model_to_entity(model: TourModel) -> Tour:
        return Tour(
            id=model.id,
            name=model.name,
            description=model.description,
            price=Money(model.price, "KES"),
            duration_hours=model.duration_hours,
            operator_id=model.operator_id,
            max_participants=model.max_participants,
            included_services=model.included_services,
            created_at=model.created_at,
            updated_at=model.updated_at
        )

    @staticmethod
    def entity_to_model(entity: Tour) -> TourModel:
        return TourModel(
            id=entity.id if entity.id else None,
            name=entity.name,
            description=entity.description,
            price=entity.price.amount,
            duration_hours=entity.duration_hours,
            operator_id=entity.operator_id,
            max_participants=entity.max_participants,
            included_services=entity.included_services
        )

    @staticmethod
    def booking_model_to_entity(model: TourBookingModel) -> TourBooking:
        return TourBooking(
            id=model.id,
            tour_id=model.tour_id,
            customer_id=model.customer_id,
            booking_date=model.booking_date,
            participants=model.participants,
            total_price=Money(model.total_price, "KES"),
            status=model.status,
            created_at=model.created_at,
            updated_at=model.updated_at
        )

    @staticmethod
    def booking_entity_to_model(entity: TourBooking) -> TourBookingModel:
        return TourBookingModel(
            id=entity.id if entity.id else None,
            tour_id=entity.tour_id,
            customer_id=entity.customer_id,
            booking_date=entity.booking_date,
            participants=entity.participants,
            total_price=entity.total_price.amount,
            status=entity.status
        )
