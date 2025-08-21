from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime

from ...config.database import Base
from domain.entities.bundle_booking import BookingStatus

class BundleBookingModel(Base):
    __tablename__ = "bundle_bookings"

    id = Column(Integer, primary_key=True, index=True)
    bundle_id = Column(Integer, ForeignKey("bundles.id"), nullable=False)
    user_id = Column(Integer, nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String, nullable=False, default="KES")
    status = Column(Enum(BookingStatus), nullable=False, default=BookingStatus.PENDING)
    booked_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    bundle = relationship("BundleModel")
