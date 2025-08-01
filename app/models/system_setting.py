"""SystemSetting and WebsiteSetting models for configurable key-value pairs."""
from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import Integer, String, Text, DateTime, UniqueConstraint, Index
from sqlalchemy.orm import Mapped, mapped_column

from core.database import Base


class SystemSetting(Base):
    """Global system setting (e.g. maintenance mode, signup enabled)."""

    __tablename__ = "system_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    key: Mapped[str] = mapped_column(String(100), nullable=False)
    value: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(datetime.UTC))

    __table_args__ = (
        UniqueConstraint("key", name="uq_system_setting_key"),
        Index("idx_system_setting_key", "key"),
    )


class WebsiteSetting(Base):
    """Website/UI settings that can be customized by admins."""

    __tablename__ = "website_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    key: Mapped[str] = mapped_column(String(100), nullable=False)
    value: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(datetime.UTC))

    __table_args__ = (
        UniqueConstraint("key", name="uq_website_setting_key"),
        Index("idx_website_setting_key", "key"),
    )
