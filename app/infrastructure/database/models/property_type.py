"""PropertyType model to categorize properties (e.g., apartment, house)."""
from sqlalchemy import Integer, String, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from .property import Property


class PropertyType(Base):
    """Represents a category/type of property (e.g., House, Apartment)."""

    __tablename__ = "property_types"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    # reverse relation
    properties: Mapped[List["Property"]] = relationship("Property", back_populates="property_type")

    __table_args__ = (Index("idx_property_type_name", "name"),)

    def __repr__(self) -> str:  # pragma: no cover
        return f"<PropertyType(id={self.id}, name={self.name})>"
