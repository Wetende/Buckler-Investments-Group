from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, JSON
from sqlalchemy.orm import relationship

from .base import Base

class BundleModel(Base):
    __tablename__ = "bundles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False) # In a real app, this would be a foreign key to users table
    total_amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String, nullable=False, default="KES")

    items = relationship("BundledItemModel", back_populates="bundle", cascade="all, delete-orphan")

class BundledItemModel(Base):
    __tablename__ = "bundled_items"

    id = Column(Integer, primary_key=True, index=True)
    bundle_id = Column(Integer, ForeignKey("bundles.id"), nullable=False)
    item_id = Column(Integer, nullable=False)
    item_type = Column(String, nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String, nullable=False, default="KES")
    details = Column(JSON, nullable=True)

    bundle = relationship("BundleModel", back_populates="items")
