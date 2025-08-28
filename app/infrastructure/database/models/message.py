"""Message database model."""
from sqlalchemy import (
    Integer, String, Text, DateTime, Boolean, 
    ForeignKey, Index
)
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from datetime import datetime
from typing import Optional

from ...config.database import Base


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    booking_type: Mapped[str] = mapped_column(String(20), nullable=False)  # 'bnb', 'tour', 'car', 'bundle'
    booking_id: Mapped[int] = mapped_column(Integer, nullable=False)
    sender_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    recipient_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    subject: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    read_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    parent_message_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("messages.id", ondelete="SET NULL"), nullable=True)
    is_system_message: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    __table_args__ = (
        Index("ix_messages_booking", "booking_type", "booking_id"),
        Index("ix_messages_sender_id", "sender_id"),
        Index("ix_messages_recipient_id", "recipient_id"),
        Index("ix_messages_conversation", "sender_id", "recipient_id", "booking_type", "booking_id"),
        Index("ix_messages_unread", "recipient_id", "is_read"),
        Index("ix_messages_created_at", "created_at"),
        Index("ix_messages_parent", "parent_message_id"),
    )
