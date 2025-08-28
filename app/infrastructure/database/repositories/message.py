"""Message repository implementation."""
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func, desc
from domain.repositories.message import MessageRepository
from domain.entities.message import Message, MessageThread
from infrastructure.database.models.message import Message as MessageModel
from shared.mappers.message import MessageMapper
from datetime import datetime


class SqlAlchemyMessageRepository(MessageRepository):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def create(self, entity: Message) -> Message:
        model = MessageMapper.entity_to_model(entity)
        self._session.add(model)
        try:
            await self._session.commit()
            await self._session.refresh(model)
            return MessageMapper.model_to_entity(model)
        except Exception as e:
            await self._session.rollback()
            raise e

    async def get_by_id(self, id: int) -> Optional[Message]:
        stmt = select(MessageModel).where(MessageModel.id == id)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        return MessageMapper.model_to_entity(model) if model else None

    async def update(self, entity: Message) -> Message:
        model = MessageMapper.entity_to_model(entity)
        await self._session.merge(model)
        await self._session.commit()
        return entity

    async def delete(self, id: int) -> None:
        model = await self._session.get(MessageModel, id)
        if model:
            await self._session.delete(model)
            await self._session.commit()

    async def list(self, limit: int = 100, offset: int = 0) -> List[Message]:
        stmt = select(MessageModel).limit(limit).offset(offset).order_by(desc(MessageModel.created_at))
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [MessageMapper.model_to_entity(model) for model in models]

    async def get_by_booking(self, booking_type: str, booking_id: int) -> List[Message]:
        stmt = select(MessageModel).where(
            and_(
                MessageModel.booking_type == booking_type,
                MessageModel.booking_id == booking_id
            )
        ).order_by(MessageModel.created_at)
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [MessageMapper.model_to_entity(model) for model in models]

    async def get_by_sender(self, sender_id: int) -> List[Message]:
        stmt = select(MessageModel).where(MessageModel.sender_id == sender_id).order_by(desc(MessageModel.created_at))
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [MessageMapper.model_to_entity(model) for model in models]

    async def get_by_recipient(self, recipient_id: int) -> List[Message]:
        stmt = select(MessageModel).where(MessageModel.recipient_id == recipient_id).order_by(desc(MessageModel.created_at))
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [MessageMapper.model_to_entity(model) for model in models]

    async def get_conversation(
        self, 
        booking_type: str, 
        booking_id: int, 
        user1_id: int, 
        user2_id: int
    ) -> List[Message]:
        stmt = select(MessageModel).where(
            and_(
                MessageModel.booking_type == booking_type,
                MessageModel.booking_id == booking_id,
                or_(
                    and_(MessageModel.sender_id == user1_id, MessageModel.recipient_id == user2_id),
                    and_(MessageModel.sender_id == user2_id, MessageModel.recipient_id == user1_id)
                )
            )
        ).order_by(MessageModel.created_at)
        result = await self._session.execute(stmt)
        models = result.scalars().all()
        return [MessageMapper.model_to_entity(model) for model in models]

    async def get_unread_count(self, user_id: int) -> int:
        stmt = select(func.count(MessageModel.id)).where(
            and_(
                MessageModel.recipient_id == user_id,
                MessageModel.is_read == False
            )
        )
        result = await self._session.execute(stmt)
        return result.scalar() or 0

    async def mark_as_read(self, message_id: int, user_id: int) -> None:
        stmt = select(MessageModel).where(MessageModel.id == message_id)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        
        if model and model.recipient_id == user_id and not model.is_read:
            model.is_read = True
            model.read_at = datetime.utcnow()
            await self._session.commit()

    async def get_user_conversations(self, user_id: int) -> List[MessageThread]:
        """Get all conversation threads for a user (simplified implementation)."""
        # This is a simplified implementation that groups messages by booking
        # In a full implementation, we'd use more sophisticated grouping
        
        stmt = select(
            MessageModel.booking_type,
            MessageModel.booking_id,
            MessageModel.sender_id,
            MessageModel.recipient_id,
            func.max(MessageModel.created_at).label('last_message_at')
        ).where(
            or_(
                MessageModel.sender_id == user_id,
                MessageModel.recipient_id == user_id
            )
        ).group_by(
            MessageModel.booking_type,
            MessageModel.booking_id,
            MessageModel.sender_id,
            MessageModel.recipient_id
        ).order_by(desc('last_message_at'))
        
        result = await self._session.execute(stmt)
        threads = []
        
        for row in result:
            # Determine participants
            if row.sender_id == user_id:
                other_participant = row.recipient_id
            else:
                other_participant = row.sender_id
            
            # Get all messages for this booking
            messages = await self.get_by_booking(row.booking_type, row.booking_id)
            
            thread = MessageThread(
                booking_type=row.booking_type,
                booking_id=row.booking_id,
                participant_1_id=user_id,
                participant_2_id=other_participant,
                messages=messages,
                last_message_at=row.last_message_at
            )
            threads.append(thread)
        
        return threads

    async def get_thread(
        self, 
        booking_type: str, 
        booking_id: int, 
        participant1_id: int, 
        participant2_id: int
    ) -> Optional[MessageThread]:
        """Get a specific conversation thread."""
        messages = await self.get_conversation(
            booking_type, booking_id, participant1_id, participant2_id
        )
        
        if not messages:
            return None
        
        thread = MessageThread(
            booking_type=booking_type,
            booking_id=booking_id,
            participant_1_id=participant1_id,
            participant_2_id=participant2_id,
            messages=messages,
            last_message_at=messages[-1].created_at if messages else None
        )
        
        return thread
