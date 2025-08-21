from app.domain.entities.investment import Investment, InvestmentHolding
from app.domain.value_objects.money import Money
from app.infrastructure.database.models.investment import (
    Investment as InvestmentModel,
    InvestmentHolding as InvestmentHoldingModel,
)

class InvestmentMapper:
    @staticmethod
    def model_to_entity(model: InvestmentModel) -> Investment:
        return Investment(
            id=model.id,
            property_id=model.property_id,
            title=model.title,
            description=model.description,
            total_value=Money(amount=model.total_value, currency=model.currency),
            min_investment=Money(amount=model.min_investment, currency=model.currency),
            expected_yield=model.expected_yield,
            status=model.status,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    @staticmethod
    def entity_to_model(entity: Investment) -> InvestmentModel:
        return InvestmentModel(
            id=entity.id if entity.id != 0 else None,
            property_id=entity.property_id,
            title=entity.title,
            description=entity.description,
            total_value=entity.total_value.amount,
            min_investment=entity.min_investment.amount,
            currency=entity.total_value.currency,
            expected_yield=entity.expected_yield,
            status=entity.status,
        )

    @staticmethod
    def holding_model_to_entity(model: InvestmentHoldingModel) -> InvestmentHolding:
        return InvestmentHolding(
            id=model.id,
            investment_id=model.investment_id,
            user_id=model.user_id,
            amount_invested=Money(amount=model.amount_invested, currency=model.currency),
            shares=model.shares,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    @staticmethod
    def holding_entity_to_model(entity: InvestmentHolding) -> InvestmentHoldingModel:
        return InvestmentHoldingModel(
            id=entity.id if entity.id != 0 else None,
            investment_id=entity.investment_id,
            user_id=entity.user_id,
            amount_invested=entity.amount_invested.amount,
            currency=entity.amount_invested.currency,
            shares=entity.shares,
        )
