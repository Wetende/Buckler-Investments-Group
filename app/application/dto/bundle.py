from pydantic import BaseModel, Field
from typing import List, Any, Dict
from decimal import Decimal

class BundledItemRequestDTO(BaseModel):
    item_id: int
    item_type: str = Field(..., pattern="^(tour_booking|car_rental|bnb_booking)$")

class CreateBundleRequestDTO(BaseModel):
    user_id: int # In a real app, this would come from auth token
    items: List[BundledItemRequestDTO]

class MoneyDTO(BaseModel):
    amount: Decimal
    currency: str

class BundledItemResponseDTO(BaseModel):
    item_id: Any
    item_type: str
    price: MoneyDTO
    details: Dict[str, Any]

class BundleResponseDTO(BaseModel):
    id: int
    user_id: int
    items: List[BundledItemResponseDTO]
    total_price: MoneyDTO

    class Config:
        from_attributes = True
