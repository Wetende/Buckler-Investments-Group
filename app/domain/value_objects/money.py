from decimal import Decimal
from dataclasses import dataclass

@dataclass(frozen=True)
class Money:
    amount: Decimal
    currency: str = "KES"
    
    def __add__(self, other: 'Money') -> 'Money':
        if self.currency != other.currency:
            raise ValueError("Cannot add different currencies")
        return Money(self.amount + other.amount, self.currency)
    
    def __str__(self) -> str:
        return f"{self.amount} {self.currency}"
