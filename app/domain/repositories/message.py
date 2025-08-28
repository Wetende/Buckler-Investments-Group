"""Message repository interface."""
from abc import abstractmethod
from typing import List, Optional
from .base import BaseRepository
from ..entities.message import Message, MessageThread


class MessageRepository(BaseRepository[Message]):
    """Repository interface for Message entities."""
    
    @abstractmethod
    async def get_by_booking(self, booking_type: str, booking_id: int) -> List[Message]:
        """Get all messages for a specific booking."""
        pass
    
    @abstractmethod
    async def get_by_sender(self, sender_id: int) -> List[Message]:
        """Get all messages sent by a specific user."""
        pass
    
    @abstractmethod
    async def get_by_recipient(self, recipient_id: int) -> List[Message]:
        """Get all messages received by a specific user."""
        pass
    
    @abstractmethod
    async def get_conversation(
        self, 
        booking_type: str, 
        booking_id: int, 
        user1_id: int, 
        user2_id: int
    ) -> List[Message]:
        """Get conversation between two users about a specific booking."""
        pass
    
    @abstractmethod
    async def get_unread_count(self, user_id: int) -> int:
        """Get count of unread messages for a user."""
        pass
    
    @abstractmethod
    async def mark_as_read(self, message_id: int, user_id: int) -> None:
        """Mark a message as read by a specific user."""
        pass
    
    @abstractmethod
    async def get_user_conversations(self, user_id: int) -> List[MessageThread]:
        """Get all conversation threads for a user."""
        pass
    
    @abstractmethod
    async def get_thread(
        self, 
        booking_type: str, 
        booking_id: int, 
        participant1_id: int, 
        participant2_id: int
    ) -> Optional[MessageThread]:
        """Get a specific conversation thread."""
        pass
