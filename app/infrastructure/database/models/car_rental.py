from sqlalchemy import (
    Column,
    Integer,
    DateTime,
    Numeric,
    String,
    ForeignKey,
    func
)
from ....core.database import Base

class CarRental(Base):
    __tablename__ = "car_rentals"

    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    renter_id = Column(Integer, index=True, nullable=False)
    pickup_date = Column(DateTime, nullable=False)
    return_date = Column(DateTime, nullable=False)
    total_cost = Column(Numeric(10, 2), nullable=False)
    status = Column(String, nullable=False)
    
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
