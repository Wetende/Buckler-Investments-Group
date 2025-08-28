"""Message DTOs for the messaging system."""
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional, List
from enum import Enum


class BookingType(str, Enum):
    BNB = "bnb"
    TOUR = "tour"
    CAR = "car"
    BUNDLE = "bundle"


class MessageCreateDTO(BaseModel):
    booking_type: BookingType
    booking_id: int = Field(..., description="ID of the booking this message relates to")
    recipient_id: int = Field(..., description="ID of the message recipient")
    subject: Optional[str] = Field(None, max_length=255)
    body: str = Field(..., min_length=1, max_length=2000)
    parent_message_id: Optional[int] = Field(None, description="ID of parent message if this is a reply")
    
    model_config = ConfigDict(from_attributes=True)


class MessageResponseDTO(BaseModel):
    id: int
    booking_type: str
    booking_id: int
    sender_id: int
    sender_name: str
    recipient_id: int
    recipient_name: str
    subject: Optional[str] = None
    body: str
    is_read: bool
    read_at: Optional[datetime] = None
    parent_message_id: Optional[int] = None
    is_system_message: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class ConversationThreadDTO(BaseModel):
    booking_type: str
    booking_id: int
    other_participant_id: int
    other_participant_name: str
    messages: List[MessageResponseDTO]
    last_message_at: Optional[datetime] = None
    unread_count: int = 0
    
    model_config = ConfigDict(from_attributes=True)


class MessageStatsDTO(BaseModel):
    total_messages: int
    unread_count: int
    conversations_count: int
    
    model_config = ConfigDict(from_attributes=True)
