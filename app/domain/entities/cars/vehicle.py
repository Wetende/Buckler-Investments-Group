from dataclasses import dataclass, field
from typing import List, Optional
from datetime import datetime
from ..base import DomainEntity
from ...value_objects.money import Money

@dataclass
class Vehicle(DomainEntity):
    # Required fields
    make: str = ""
    model: str = ""
    year: int = 0
    daily_rate: Money = field(default_factory=lambda: Money(0, "KES"))
    owner_id: int = 0
    
    # Optional fields with defaults
    features: Optional[List[str]] = field(default_factory=list)
    images: Optional[List[str]] = field(default_factory=list)
    location: Optional[str] = None
    description: Optional[str] = None
    category: str = "economy"  # economy, compact, luxury, suv, etc.
    transmission: str = "manual"  # manual, automatic
    fuel_type: str = "petrol"  # petrol, diesel, electric, hybrid
    seats: int = 5
    status: str = "available"  # available, rented, maintenance

    def is_available_for_dates(self, start_date: datetime, end_date: datetime) -> bool:
        """Check if vehicle is available for rental during specified dates"""
        return self.status == "available"
    
    def calculate_rental_cost(self, start_date: datetime, end_date: datetime) -> Money:
        """Calculate total rental cost for given date range"""
        days = (end_date - start_date).days
        if days <= 0:
            raise ValueError("End date must be after start date")
        
        total_amount = self.daily_rate.amount * days
        return Money(total_amount, self.daily_rate.currency)
    
    def update_status(self, new_status: str) -> None:
        """Update vehicle status with validation"""
        valid_statuses = ["available", "rented", "maintenance", "inactive"]
        if new_status not in valid_statuses:
            raise ValueError(f"Invalid status. Must be one of: {valid_statuses}")
        self.status = new_status
        self.updated_at = datetime.utcnow()
    
    def add_image(self, image_url: str) -> None:
        """Add image URL to vehicle"""
        if not self.images:
            self.images = []
        if image_url not in self.images:
            self.images.append(image_url)
    
    def remove_image(self, image_url: str) -> None:
        """Remove image URL from vehicle"""
        if self.images and image_url in self.images:
            self.images.remove(image_url)
