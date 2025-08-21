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

class Tour(Base):
    __tablename__ = "tours"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    duration_hours = Column(Integer, nullable=False)
    operator_id = Column(Integer, index=True, nullable=False)
    max_participants = Column(Integer, nullable=False)
    included_services = Column(JSON)
    
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
