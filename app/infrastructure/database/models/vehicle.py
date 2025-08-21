from sqlalchemy import (
    Column,
    Integer,
    String,
    Numeric,
    DateTime,
    JSON,
    func
)
from ....core.database import Base

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    make = Column(String, nullable=False)
    model = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    daily_rate = Column(Numeric(10, 2), nullable=False)
    owner_id = Column(Integer, index=True, nullable=False)
    features = Column(JSON)
    
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
