"""Message domain entity for the super platform."""
from dataclasses import dataclass
from datetime import datetime
from typing import Optional
from .base import DomainEntity


@dataclass
class Message(DomainEntity):
    """Message entity for communication between users regarding bookings."""
    booking_type: str  # 'bnb', 'tour', 'car', 'bundle'
    booking_id: int
    sender_id: int
    recipient_id: int
    subject: Optional[str] = None
    body: str = ""
    is_read: bool = False
    read_at: Optional[datetime] = None
    parent_message_id: Optional[int] = None  # For threading
    is_system_message: bool = False
    
    def mark_as_read(self, read_by_user_id: int) -> None:
        """Business rule: Mark message as read by recipient."""
        if read_by_user_id == self.recipient_id and not self.is_read:
            self.is_read = True
            self.read_at = datetime.utcnow()
    
    def is_reply(self) -> bool:
        """Check if this message is a reply to another message."""
        return self.parent_message_id is not None
    
    def can_be_replied_to(self) -> bool:
        """Business rule: Check if message can be replied to."""
        return not self.is_system_message


@dataclass
class MessageThread:
    """Represents a conversation thread between two users about a booking."""
    booking_type: str
    booking_id: int
    participant_1_id: int
    participant_2_id: int
    messages: list = None
    last_message_at: Optional[datetime] = None
    unread_count_participant_1: int = 0
    unread_count_participant_2: int = 0
    
    def __post_init__(self):
        if self.messages is None:
            self.messages = []
    
    def add_message(self, message: Message) -> None:
        """Add a message to the thread and update metadata."""
        self.messages.append(message)
        self.last_message_at = message.created_at
        
        # Update unread counts
        if message.sender_id == self.participant_1_id:
            self.unread_count_participant_2 += 1
        else:
            self.unread_count_participant_1 += 1
    
    def mark_messages_read(self, user_id: int) -> None:
        """Mark all unread messages as read for a specific user."""
        for message in self.messages:
            if message.recipient_id == user_id and not message.is_read:
                message.mark_as_read(user_id)
        
        # Reset unread count for the user
        if user_id == self.participant_1_id:
            self.unread_count_participant_1 = 0
        elif user_id == self.participant_2_id:
            self.unread_count_participant_2 = 0
    
    def get_other_participant(self, user_id: int) -> int:
        """Get the ID of the other participant in the thread."""
        if user_id == self.participant_1_id:
            return self.participant_2_id
        elif user_id == self.participant_2_id:
            return self.participant_1_id
        else:
            raise ValueError("User is not a participant in this thread")
    
    def get_unread_count(self, user_id: int) -> int:
        """Get unread message count for a specific user."""
        if user_id == self.participant_1_id:
            return self.unread_count_participant_1
        elif user_id == self.participant_2_id:
            return self.unread_count_participant_2
        else:
            return 0
