"""Message entity to model mapper."""
from domain.entities.message import Message
from infrastructure.database.models.message import Message as MessageModel


class MessageMapper:
    @staticmethod
    def model_to_entity(model: MessageModel) -> Message:
        return Message(
            id=model.id,
            booking_type=model.booking_type,
            booking_id=model.booking_id,
            sender_id=model.sender_id,
            recipient_id=model.recipient_id,
            subject=model.subject,
            body=model.body,
            is_read=model.is_read,
            read_at=model.read_at,
            parent_message_id=model.parent_message_id,
            is_system_message=model.is_system_message,
            created_at=model.created_at,
            updated_at=model.updated_at
        )

    @staticmethod
    def entity_to_model(entity: Message) -> MessageModel:
        return MessageModel(
            id=entity.id if entity.id else None,
            booking_type=entity.booking_type,
            booking_id=entity.booking_id,
            sender_id=entity.sender_id,
            recipient_id=entity.recipient_id,
            subject=entity.subject,
            body=entity.body,
            is_read=entity.is_read,
            read_at=entity.read_at,
            parent_message_id=entity.parent_message_id,
            is_system_message=entity.is_system_message
        )
