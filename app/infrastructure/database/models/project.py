"""
Project (off‑plan/development) model.
"""
from datetime import datetime
from decimal import Decimal
from sqlalchemy import Integer, String, DateTime, Numeric, Float, JSON, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from ...config.database import Base


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String(200), unique=True, nullable=False, index=True)
    developer_id: Mapped[int] = mapped_column(Integer, ForeignKey("developers.id", ondelete="RESTRICT"), nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    from_price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=True)
    handover_quarter: Mapped[str] = mapped_column(String(20), nullable=True)
    bedrooms_min: Mapped[int] = mapped_column(Integer, nullable=True)
    bedrooms_max: Mapped[int] = mapped_column(Integer, nullable=True)
    location: Mapped[str] = mapped_column(String(300), nullable=True)
    latitude: Mapped[float] = mapped_column(Float, nullable=True)
    longitude: Mapped[float] = mapped_column(Float, nullable=True)
    payment_plan: Mapped[str] = mapped_column(String(1000), nullable=True)
    badges: Mapped[dict] = mapped_column(JSON, nullable=True)  # e.g., {"HOT": true, "UPCOMING": true}
    media: Mapped[list] = mapped_column(JSON, nullable=True)   # image/video URLs

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    developer = relationship("Developer")

    __table_args__ = (
        Index("ix_projects_developer_id", "developer_id"),
        Index("ix_projects_created_at", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<Project(id={self.id}, slug={self.slug}, name={self.name})>"



