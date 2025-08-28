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

    model_config = {"from_attributes": True}

    @classmethod
    def from_entity(cls, entity) -> 'BundleResponseDTO':
        """Convert Bundle entity to DTO"""
        items_dto = []
        for item in entity.items:
            items_dto.append(BundledItemResponseDTO(
                item_id=item.item_id,
                item_type=item.item_type,
                price=MoneyDTO(amount=item.price.amount, currency=item.price.currency),
                details=item.details
            ))

        return cls(
            id=entity.id,
            user_id=entity.user_id,
            items=items_dto,
            total_price=MoneyDTO(amount=entity.total_price.amount, currency=entity.total_price.currency)
        )
