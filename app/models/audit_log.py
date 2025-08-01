"""AuditLog model for tracking critical user and system actions.

All IDs are integers per project convention.
"""
from __future__ import annotations

from datetime import datetime, timezone
import datetime as dt  # If needed for UTC
from enum import Enum
from typing import Optional, TYPE_CHECKING

from sqlalchemy import Integer, String, DateTime, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from core.database import Base

if TYPE_CHECKING:
    from .user import User


class AuditAction(str, Enum):
    """Enumeration of auditable actions."""

    AUTO = "AUTO"  # Logged automatically by middleware
    CREATE = "CREATE"
    UPDATE = "UPDATE"
    DELETE = "DELETE"
    LOGIN = "LOGIN"
    LOGOUT = "LOGOUT"
    PASSWORD_RESET = "PASSWORD_RESET"


class AuditLog(Base):
    """Audit log entry for compliance and monitoring."""

    __tablename__ = "audit_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("users.id", ondelete="SET NULL"))
    path: Mapped[str] = mapped_column(String(500), nullable=False)
    method: Mapped[str] = mapped_column(String(10), nullable=False)
    status_code: Mapped[int] = mapped_column(Integer, nullable=False)
    action: Mapped[AuditAction] = mapped_column(String(50), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(datetime.UTC))

    user: Mapped[Optional["User"]] = relationship("User")

    __table_args__ = (
        Index("idx_audit_log_user_id", "user_id"),
        Index("idx_audit_log_path", "path"),
        Index("idx_audit_log_created_at", "created_at"),
    )

    def __repr__(self) -> str:  # noqa: D401
        return f"<AuditLog(id={self.id}, path={self.path}, status={self.status_code})>"
