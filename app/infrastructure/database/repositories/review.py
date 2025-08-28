"""Review repository implementation."""
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func
from domain.repositories.review import ReviewRepository
from domain.entities.review import Review, ReviewStats
from infrastructure.database.models.review import Review as ReviewModel
from shared.mappers.review import ReviewMapper


class SqlAlchemyReviewRepository(ReviewRepository):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def create(self, entity: Review) -> Review:
        model = ReviewMapper.entity_to_model(entity)
        self._session.add(model)
        try:
            await self._session.commit()
            await self._session.refresh(model)
            return ReviewMapper.model_to_entity(model)
        except Exception as e:
            await self._session.rollback()
            raise e

    async def get_by_id(self, id: int) -> Optional[Review]:
        stmt = select(ReviewModel).where(ReviewModel.id == id)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        return ReviewMapper.model_to_entity(model) if model else None

    async def update(self, entity: Review) -> Review:
        model = ReviewMapper.entity_to_model(entity)
        try:
            await self._session.merge(model)
            await self._session.commit()
            return entity
        except Exception as e:
            await self._session.rollback()
            raise e

    async def delete(self, id: int) -> None:
        try:
            model = await self._session.get(ReviewModel, id)
            if model:
                await self._session.delete(model)
                await self._session.commit()
        except Exception as e:
            await self._session.rollback()
            raise e

    async def list(self, limit: int = 100, offset: int = 0) -> List[Review]:
        stmt = select(ReviewModel).limit(limit).offset(offset)
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [ReviewMapper.model_to_entity(model) for model in models]

    async def get_by_target(self, target_type: str, target_id: int) -> List[Review]:
        stmt = select(ReviewModel).where(
            and_(
                ReviewModel.target_type == target_type,
                ReviewModel.target_id == target_id,
                ReviewModel.is_flagged == False
            )
        ).order_by(ReviewModel.created_at.desc())
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [ReviewMapper.model_to_entity(model) for model in models]

    async def get_by_reviewer(self, reviewer_id: int) -> List[Review]:
        stmt = select(ReviewModel).where(ReviewModel.reviewer_id == reviewer_id).order_by(ReviewModel.created_at.desc())
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [ReviewMapper.model_to_entity(model) for model in models]

    async def get_by_booking(self, booking_id: int) -> Optional[Review]:
        stmt = select(ReviewModel).where(ReviewModel.booking_id == booking_id)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        return ReviewMapper.model_to_entity(model) if model else None

    async def get_flagged(self, limit: int = 100, offset: int = 0) -> List[Review]:
        stmt = select(ReviewModel).where(ReviewModel.is_flagged == True).limit(limit).offset(offset)
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [ReviewMapper.model_to_entity(model) for model in models]

    async def exists_for_booking(self, booking_id: int, reviewer_id: int) -> bool:
        stmt = select(ReviewModel.id).where(
            and_(
                ReviewModel.booking_id == booking_id,
                ReviewModel.reviewer_id == reviewer_id
            )
        )
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none() is not None

    async def calculate_stats(self, target_type: str, target_id: int) -> ReviewStats:
        # Get count and average rating
        stmt = select(
            func.count(ReviewModel.id).label('total_reviews'),
            func.avg(ReviewModel.rating).label('average_rating')
        ).where(
            and_(
                ReviewModel.target_type == target_type,
                ReviewModel.target_id == target_id,
                ReviewModel.is_flagged == False
            )
        )
        result = await self._session.execute(stmt)
        stats = result.first()
        
        total_reviews = stats.total_reviews or 0
        average_rating = float(stats.average_rating) if stats.average_rating else 0.0
        
        # Get rating breakdown
        rating_breakdown = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        
        if total_reviews > 0:
            stmt = select(
                ReviewModel.rating,
                func.count(ReviewModel.rating).label('count')
            ).where(
                and_(
                    ReviewModel.target_type == target_type,
                    ReviewModel.target_id == target_id,
                    ReviewModel.is_flagged == False
                )
            ).group_by(ReviewModel.rating)
            result = await self._session.execute(stmt)
            
            for row in result:
                rating_breakdown[row.rating] = row.count
        
        return ReviewStats(
            target_type=target_type,
            target_id=target_id,
            total_reviews=total_reviews,
            average_rating=round(average_rating, 2),
            rating_breakdown=rating_breakdown
        )

    async def get_reviews_for_user_targets(
        self, 
        user_id: int, 
        target_type: Optional[str] = None
    ) -> List[Review]:
        """Get all reviews for targets owned by a user."""
        # This is a simplified implementation - in reality, we'd need to join with 
        # the appropriate tables to check ownership (listings, tours, cars)
        
        # For now, we'll use a placeholder approach
        # In a full implementation, this would involve complex joins
        conditions = []
        
        if target_type:
            conditions.append(ReviewModel.target_type == target_type)
        
        # TODO: Add proper joins to check target ownership
        # This would require joining with st_listings, tours, vehicles tables
        # For now, return empty list as placeholder
        
        return []
