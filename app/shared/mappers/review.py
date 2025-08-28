"""Review entity to model mapper."""
from domain.entities.review import Review, ReviewStats
from infrastructure.database.models.review import Review as ReviewModel


class ReviewMapper:
    @staticmethod
    def model_to_entity(model: ReviewModel) -> Review:
        return Review(
            id=model.id,
            target_type=model.target_type,
            target_id=model.target_id,
            rating=model.rating,
            title=model.title,
            comment=model.comment,
            reviewer_id=model.reviewer_id,
            booking_id=model.booking_id,
            response=model.response,
            response_date=model.response_date,
            is_flagged=model.is_flagged,
            flag_reason=model.flag_reason,
            created_at=model.created_at,
            updated_at=model.updated_at
        )

    @staticmethod
    def entity_to_model(entity: Review) -> ReviewModel:
        return ReviewModel(
            id=entity.id if entity.id else None,
            target_type=entity.target_type,
            target_id=entity.target_id,
            rating=entity.rating,
            title=entity.title,
            comment=entity.comment,
            reviewer_id=entity.reviewer_id,
            booking_id=entity.booking_id,
            response=entity.response,
            response_date=entity.response_date,
            is_flagged=entity.is_flagged,
            flag_reason=entity.flag_reason
        )
