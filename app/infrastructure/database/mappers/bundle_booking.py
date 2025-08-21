from ...domain.entities.bundle_booking import BundleBooking
from ...domain.value_objects.money import Money
from ...infrastructure.database.models.bundle_booking import BundleBookingModel

class BundleBookingMapper:
    @staticmethod
    def model_to_entity(model: BundleBookingModel) -> BundleBooking:
        return BundleBooking(
            id=model.id,
            bundle_id=model.bundle_id,
            user_id=model.user_id,
            total_price=Money(amount=model.total_amount, currency=model.currency),
            status=model.status,
            booked_at=model.booked_at,
        )

    @staticmethod
    def entity_to_model(entity: BundleBooking) -> BundleBookingModel:
        return BundleBookingModel(
            id=entity.id if entity.id != 0 else None,
            bundle_id=entity.bundle_id,
            user_id=entity.user_id,
            total_amount=entity.total_price.amount,
            currency=entity.total_price.currency,
            status=entity.status,
            booked_at=entity.booked_at,
        )
