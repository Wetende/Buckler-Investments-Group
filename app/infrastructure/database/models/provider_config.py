"""Email/SMS provider configuration models."""
from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import Integer, String, Text, DateTime, Enum as SQLEnum, UniqueConstraint, Index
from sqlalchemy.orm import Mapped, mapped_column

from ...config.database import Base

class ProviderType(str, Enum):
    EMAIL = "EMAIL"
    SMS = "SMS"

class ProviderConfig(Base):
    """Config for external messaging providers (SendGrid, Twilio, etc.)."""

    __tablename__ = "provider_configs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    provider_type: Mapped[ProviderType] = mapped_column(SQLEnum(ProviderType), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    api_key: Mapped[str] = mapped_column(Text, nullable=False)
    settings: Mapped[Optional[dict]] = mapped_column(Text, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(datetime.UTC))

    __table_args__ = (
        UniqueConstraint("provider_type", "name", name="uq_provider_type_name"),
        Index("idx_provider_type", "provider_type"),
    )
