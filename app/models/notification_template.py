"""NotificationTemplate model for email/SMS templates."""
from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import Integer, String, Text, DateTime, Enum as SQLEnum, UniqueConstraint, Index
from sqlalchemy.orm import Mapped, mapped_column

from core.database import Base

class Channel(str, Enum):
    EMAIL = "EMAIL"
    SMS = "SMS"

class NotificationTemplate(Base):
    """Template for transactional notifications."""

    __tablename__ = "notification_templates"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    key: Mapped[str] = mapped_column(String(100), nullable=False)
    channel: Mapped[Channel] = mapped_column(SQLEnum(Channel), nullable=False)
    subject: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(datetime.UTC))

    __table_args__ = (
        UniqueConstraint("key", "channel", name="uq_template_key_channel"),
        Index("idx_template_key", "key"),
    )
