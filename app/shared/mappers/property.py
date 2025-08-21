from domain.entities.property import Property, PropertyFeatures
from domain.value_objects.money import Money
from infrastructure.database.models.property import Property as PropertyModel

class PropertyMapper:
    @staticmethod
    def model_to_entity(model: PropertyModel) -> Property:
        return Property(
            id=model.id,
            agent_id=model.agent_id,
            title=model.title,
            description=model.description,
            address=model.address,
            listing_price=Money(amount=model.listing_price, currency=model.currency),
            property_type=model.property_type,
            status=model.status,
            features=PropertyFeatures(**model.features),
            image_urls=model.image_urls,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    @staticmethod
    def entity_to_model(entity: Property) -> PropertyModel:
        return PropertyModel(
            id=entity.id if entity.id != 0 else None,
            agent_id=entity.agent_id,
            title=entity.title,
            description=entity.description,
            address=entity.address,
            listing_price=entity.listing_price.amount,
            currency=entity.listing_price.currency,
            property_type=entity.property_type,
            status=entity.status,
            features=entity.features.__dict__,
            image_urls=entity.image_urls,
        )
