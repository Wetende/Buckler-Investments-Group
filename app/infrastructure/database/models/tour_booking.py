from sqlalchemy import (
    Column,
    Integer,
    Date,
    Numeric,
    String,
    DateTime,
    ForeignKey,
    func
)
from ...config.database import Base

class TourBooking(Base):
    __tablename__ = "tour_bookings"

    id = Column(Integer, primary_key=True, index=True)
    tour_id = Column(Integer, ForeignKey("tours.id"), nullable=False)
    customer_id = Column(Integer, index=True, nullable=False)
    booking_date = Column(Date, nullable=False)
    participants = Column(Integer, nullable=False)
    total_price = Column(Numeric(10, 2), nullable=False)
    status = Column(String, nullable=False)
    
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
