"""Mark messages as read use case."""
from domain.repositories.message import MessageRepository


class MarkMessagesReadUseCase:
    def __init__(self, message_repository: MessageRepository):
        self._message_repository = message_repository

    async def execute(self, message_id: int, user_id: int) -> dict:
        """Mark a specific message as read."""
        await self._message_repository.mark_as_read(message_id, user_id)
        
        return {
            "ok": True,
            "message": "Message marked as read",
            "message_id": message_id
        }

    async def mark_conversation_read(
        self, 
        booking_type: str, 
        booking_id: int, 
        user_id: int, 
        other_user_id: int
    ) -> dict:
        """Mark all messages in a conversation as read for the user."""
        # Get all messages in the conversation
        messages = await self._message_repository.get_conversation(
            booking_type, booking_id, user_id, other_user_id
        )
        
        # Mark unread messages as read
        marked_count = 0
        for message in messages:
            if message.recipient_id == user_id and not message.is_read:
                await self._message_repository.mark_as_read(message.id, user_id)
                marked_count += 1
        
        return {
            "ok": True,
            "message": f"Marked {marked_count} messages as read",
            "marked_count": marked_count
        }
