"""Get conversation use case."""
from typing import List
from domain.repositories.message import MessageRepository
from domain.repositories.user import UserRepository
from application.dto.message import MessageResponseDTO, BookingType


class GetConversationUseCase:
    def __init__(
        self, 
        message_repository: MessageRepository,
        user_repository: UserRepository
    ):
        self._message_repository = message_repository
        self._user_repository = user_repository

    async def execute(
        self, 
        booking_type: BookingType, 
        booking_id: int,
        user_id: int,
        other_user_id: int
    ) -> List[MessageResponseDTO]:
        # Get messages in the conversation
        messages = await self._message_repository.get_conversation(
            booking_type.value, booking_id, user_id, other_user_id
        )
        
        # Get user information for mapping
        users = {}
        for message in messages:
            if message.sender_id not in users:
                user = await self._user_repository.get_by_id(message.sender_id)
                users[message.sender_id] = user.name if user else "Unknown User"
            
            if message.recipient_id not in users:
                user = await self._user_repository.get_by_id(message.recipient_id)
                users[message.recipient_id] = user.name if user else "Unknown User"
        
        # Convert to DTOs
        result = []
        for message in messages:
            result.append(MessageResponseDTO(
                id=message.id,
                booking_type=message.booking_type,
                booking_id=message.booking_id,
                sender_id=message.sender_id,
                sender_name=users.get(message.sender_id, "Unknown User"),
                recipient_id=message.recipient_id,
                recipient_name=users.get(message.recipient_id, "Unknown User"),
                subject=message.subject,
                body=message.body,
                is_read=message.is_read,
                read_at=message.read_at,
                parent_message_id=message.parent_message_id,
                is_system_message=message.is_system_message,
                created_at=message.created_at,
                updated_at=message.updated_at
            ))
        
        return result
