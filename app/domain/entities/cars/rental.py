from dataclasses import dataclass
from datetime import datetime
from typing import Optional
from ..base import DomainEntity
from ...value_objects.money import Money

@dataclass
class CarRental(DomainEntity):
    vehicle_id: int
    renter_id: int
    pickup_date: datetime
    return_date: datetime
    total_cost: Money
    status: str  # pending, confirmed, active, completed, cancelled
    pickup_location: Optional[str] = None
    return_location: Optional[str] = None
    notes: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    def duration_days(self) -> int:
        """Calculate rental duration in days"""
        return (self.return_date - self.pickup_date).days
    
    def is_active(self) -> bool:
        """Check if rental is currently active"""
        now = datetime.utcnow()
        return (self.status in ["confirmed", "active"] and 
                self.pickup_date <= now <= self.return_date)
    
    def can_be_cancelled(self) -> bool:
        """Check if rental can still be cancelled"""
        now = datetime.utcnow()
        return (self.status in ["pending", "confirmed"] and 
                self.pickup_date > now)
    
    def update_status(self, new_status: str) -> None:
        """Update rental status with validation"""
        valid_statuses = ["pending", "confirmed", "active", "completed", "cancelled"]
        if new_status not in valid_statuses:
            raise ValueError(f"Invalid status. Must be one of: {valid_statuses}")
        
        # Business rules for status transitions
        if self.status == "completed" and new_status != "completed":
            raise ValueError("Cannot change status of completed rental")
        if self.status == "cancelled" and new_status != "cancelled":
            raise ValueError("Cannot change status of cancelled rental")
            
        self.status = new_status
        self.updated_at = datetime.utcnow()
