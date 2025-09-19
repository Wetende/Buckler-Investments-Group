from domain.entities.bnb import ShortTermListing, Booking
from infrastructure.database.models.bnb_listing import StListing as StListingModel
from infrastructure.database.models.booking import Booking as BookingModel
from domain.value_objects.money import Money

class BnbMapper:
    @staticmethod
    def model_to_entity(model: StListingModel) -> ShortTermListing:
        return ShortTermListing(
            id=model.id,
            host_id=model.host_id,
            title=model.title,
            listing_type=model.type,
            capacity=model.capacity,
            nightly_price=Money(model.nightly_price, "KES"),
            address=model.address,
            # Location fields for geographic grouping
            county=model.county,
            town=model.town,
            area_id=model.area_id,
            latitude=model.latitude,
            longitude=model.longitude,
            amenities=model.amenities,
            rules=model.rules,
            instant_book=model.instant_book,
            min_nights=model.min_nights,
            max_nights=model.max_nights,
            created_at=model.created_at,
            updated_at=model.updated_at
        )
    
    @staticmethod
    def entity_to_model(entity: ShortTermListing) -> StListingModel:
        return StListingModel(
            id=entity.id if entity.id else None,
            host_id=entity.host_id,
            title=entity.title,
            type=entity.listing_type,
            capacity=entity.capacity,
            nightly_price=entity.nightly_price.amount,
            address=entity.address,
            # Location fields for geographic grouping
            county=entity.county,
            town=entity.town,
            area_id=entity.area_id,
            latitude=entity.latitude,
            longitude=entity.longitude,
            amenities=entity.amenities,
            rules=entity.rules,
            instant_book=entity.instant_book,
            min_nights=entity.min_nights,
            max_nights=entity.max_nights
        )

    @staticmethod
    def booking_model_to_entity(model: BookingModel) -> Booking:
        return Booking(
            id=model.id,
            guest_id=model.guest_id,
            listing_id=model.listing_id,
            check_in=model.check_in,
            check_out=model.check_out,
            guests=model.guests,
            total_amount=Money(model.total_amount, "KES"),
            status=model.status,
            created_at=model.created_at,
            updated_at=model.updated_at
        )

    @staticmethod
    def booking_entity_to_model(entity: Booking) -> BookingModel:
        return BookingModel(
            id=entity.id if entity.id else None,
            guest_id=entity.guest_id,
            listing_id=entity.listing_id,
            check_in=entity.check_in,
            check_out=entity.check_out,
            guests=entity.guests,
            total_amount=entity.total_amount.amount,
            status=entity.status
        )
