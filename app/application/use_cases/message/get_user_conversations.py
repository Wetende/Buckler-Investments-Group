"""Get user conversations use case."""
from typing import List
from domain.repositories.message import MessageRepository
from domain.repositories.user import UserRepository
from application.dto.message import ConversationThreadDTO, MessageResponseDTO


class GetUserConversationsUseCase:
    def __init__(
        self, 
        message_repository: MessageRepository,
        user_repository: UserRepository
    ):
        self._message_repository = message_repository
        self._user_repository = user_repository

    async def execute(self, user_id: int) -> List[ConversationThreadDTO]:
        # Get conversation threads
        threads = await self._message_repository.get_user_conversations(user_id)
        
        # Convert to DTOs
        result = []
        for thread in threads:
            # Get other participant info
            other_participant_id = thread.get_other_participant(user_id)
            other_participant = await self._user_repository.get_by_id(other_participant_id)
            other_participant_name = other_participant.name if other_participant else "Unknown User"
            
            # Convert messages to DTOs
            message_dtos = []
            for message in thread.messages:
                sender = await self._user_repository.get_by_id(message.sender_id)
                recipient = await self._user_repository.get_by_id(message.recipient_id)
                
                message_dtos.append(MessageResponseDTO(
                    id=message.id,
                    booking_type=message.booking_type,
                    booking_id=message.booking_id,
                    sender_id=message.sender_id,
                    sender_name=sender.name if sender else "Unknown User",
                    recipient_id=message.recipient_id,
                    recipient_name=recipient.name if recipient else "Unknown User",
                    subject=message.subject,
                    body=message.body,
                    is_read=message.is_read,
                    read_at=message.read_at,
                    parent_message_id=message.parent_message_id,
                    is_system_message=message.is_system_message,
                    created_at=message.created_at,
                    updated_at=message.updated_at
                ))
            
            # Create conversation thread DTO
            conversation_dto = ConversationThreadDTO(
                booking_type=thread.booking_type,
                booking_id=thread.booking_id,
                other_participant_id=other_participant_id,
                other_participant_name=other_participant_name,
                messages=message_dtos,
                last_message_at=thread.last_message_at,
                unread_count=thread.get_unread_count(user_id)
            )
            
            result.append(conversation_dto)
        
        return result
