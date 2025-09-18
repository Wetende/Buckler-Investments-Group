from sqlalchemy import (
    Column,
    Integer,
    Date,
    Numeric,
    ForeignKey,
    DateTime,
    func,
)
from ...config.database import Base


class TourAvailability(Base):
    __tablename__ = "tour_availability"

    id = Column(Integer, primary_key=True, index=True)
    tour_id = Column(Integer, ForeignKey("tours.id"), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    available_spots = Column(Integer, nullable=False)
    price_override = Column(Numeric(10, 2), nullable=True)

    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)



