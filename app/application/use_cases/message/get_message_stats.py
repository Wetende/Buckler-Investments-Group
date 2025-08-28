"""Get message statistics use case."""
from domain.repositories.message import MessageRepository
from application.dto.message import MessageStatsDTO


class GetMessageStatsUseCase:
    def __init__(self, message_repository: MessageRepository):
        self._message_repository = message_repository

    async def execute(self, user_id: int) -> MessageStatsDTO:
        """Get message statistics for a user."""
        # Get unread count
        unread_count = await self._message_repository.get_unread_count(user_id)
        
        # Get total messages (sent + received)
        sent_messages = await self._message_repository.get_by_sender(user_id)
        received_messages = await self._message_repository.get_by_recipient(user_id)
        total_messages = len(sent_messages) + len(received_messages)
        
        # Get conversations count
        conversations = await self._message_repository.get_user_conversations(user_id)
        conversations_count = len(conversations)
        
        return MessageStatsDTO(
            total_messages=total_messages,
            unread_count=unread_count,
            conversations_count=conversations_count
        )
