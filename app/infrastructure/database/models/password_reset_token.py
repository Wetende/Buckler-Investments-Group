"""PasswordResetToken model compatible with integer user IDs."""
from datetime import datetime, timedelta
from typing import Optional, TYPE_CHECKING
from secrets import token_urlsafe

from sqlalchemy import Integer, String, DateTime, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ...config.database import Base

if TYPE_CHECKING:
    from .user import User

TOKEN_EXPIRY_HOURS = 24


class PasswordResetToken(Base):
    """Stores one-time password reset tokens."""

    __tablename__ = "password_reset_tokens"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token: Mapped[str] = mapped_column(String(128), unique=True, nullable=False, default=lambda: token_urlsafe(48))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(datetime.UTC))
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(datetime.UTC) + timedelta(hours=TOKEN_EXPIRY_HOURS))

    user: Mapped["User"] = relationship("User")

    __table_args__ = (
        Index("idx_password_reset_user_id", "user_id"),
        Index("idx_password_reset_token", "token"),
    )

    def is_valid(self) -> bool:
        return self.expires_at > datetime.now(datetime.UTC)
