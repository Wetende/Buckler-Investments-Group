"""Send message use case."""
from domain.entities.message import Message
from domain.repositories.message import MessageRepository
from domain.repositories.user import UserRepository
from application.dto.message import MessageCreateDTO, MessageResponseDTO
from datetime import datetime


class SendMessageUseCase:
    def __init__(
        self, 
        message_repository: MessageRepository,
        user_repository: UserRepository
    ):
        self._message_repository = message_repository
        self._user_repository = user_repository

    async def execute(self, request: MessageCreateDTO, sender_id: int) -> MessageResponseDTO:
        # Validate sender and recipient exist
        sender = await self._user_repository.get_by_id(sender_id)
        if not sender:
            raise ValueError("Sender not found")
        
        recipient = await self._user_repository.get_by_id(request.recipient_id)
        if not recipient:
            raise ValueError("Recipient not found")
        
        # Validate sender and recipient are different
        if sender_id == request.recipient_id:
            raise ValueError("Cannot send message to yourself")
        
        # TODO: Validate that sender and recipient are both involved in the booking
        # This would require checking the booking tables
        
        # Create message entity
        message_entity = Message(
            id=0,
            booking_type=request.booking_type.value,
            booking_id=request.booking_id,
            sender_id=sender_id,
            recipient_id=request.recipient_id,
            subject=request.subject,
            body=request.body,
            parent_message_id=request.parent_message_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        # Save message
        saved_message = await self._message_repository.create(message_entity)
        
        # Convert to response DTO
        return MessageResponseDTO(
            id=saved_message.id,
            booking_type=saved_message.booking_type,
            booking_id=saved_message.booking_id,
            sender_id=saved_message.sender_id,
            sender_name=sender.name,
            recipient_id=saved_message.recipient_id,
            recipient_name=recipient.name,
            subject=saved_message.subject,
            body=saved_message.body,
            is_read=saved_message.is_read,
            read_at=saved_message.read_at,
            parent_message_id=saved_message.parent_message_id,
            is_system_message=saved_message.is_system_message,
            created_at=saved_message.created_at,
            updated_at=saved_message.updated_at
        )
