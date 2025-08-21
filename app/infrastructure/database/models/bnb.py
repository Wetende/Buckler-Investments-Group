from sqlalchemy import (
    Column,
    Integer,
    String,
    Numeric,
    Boolean,
    DateTime,
    JSON,
    func
)
from ....core.database import Base

class StListing(Base):
    __tablename__ = "st_listings"

    id = Column(Integer, primary_key=True, index=True)
    host_id = Column(Integer, index=True, nullable=False)
    title = Column(String, nullable=False)
    type = Column(String, nullable=False)
    capacity = Column(Integer, nullable=False)
    nightly_price = Column(Numeric(10, 2), nullable=False)
    address = Column(String, nullable=False)
    amenities = Column(JSON)
    rules = Column(JSON)
    instant_book = Column(Boolean, default=False, nullable=False)
    min_nights = Column(Integer)
    max_nights = Column(Integer)
    
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
