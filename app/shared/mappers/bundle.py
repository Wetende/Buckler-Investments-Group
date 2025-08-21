from domain.entities.bundle import Bundle, BundledItem
from domain.value_objects.money import Money
from infrastructure.database.models.bundle import BundleModel, BundledItemModel

class BundleMapper:
    @staticmethod
    def model_to_entity(model: BundleModel) -> Bundle:
        bundle = Bundle(
            id=model.id,
            user_id=model.user_id,
            items=[
                BundledItem(
                    item_id=item.item_id,
                    item_type=item.item_type,
                    price=Money(amount=item.amount, currency=item.currency),
                    details=item.details,
                )
                for item in model.items
            ],
        )
        # The total price is recalculated by the entity's __post_init__
        return bundle

    @staticmethod
    def entity_to_model(entity: Bundle) -> BundleModel:
        model = BundleModel(
            id=entity.id if entity.id != 0 else None,
            user_id=entity.user_id,
            total_amount=entity.total_price.amount,
            currency=entity.total_price.currency,
        )
        model.items = [
            BundledItemModel(
                item_id=item.item_id,
                item_type=item.item_type,
                amount=item.price.amount,
                currency=item.price.currency,
                details=item.details,
            )
            for item in entity.items
        ]
        return model
