"""Money and currency utility functions."""

from decimal import Decimal, ROUND_HALF_UP
from typing import List, Optional, Dict
from domain.value_objects.money import Money


def calculate_total(amounts: List[Money]) -> Money:
    """
    Calculate total from list of Money objects.
    All amounts must have the same currency.
    
    Args:
        amounts: List of Money objects
        
    Returns:
        Total amount
        
    Raises:
        ValueError: If currencies don't match or list is empty
    """
    if not amounts:
        raise ValueError("Cannot calculate total of empty list")
    
    currency = amounts[0].currency
    
    # Validate all currencies match
    for amount in amounts[1:]:
        if amount.currency != currency:
            raise ValueError(f"Currency mismatch: {currency} != {amount.currency}")
    
    total = sum(amount.amount for amount in amounts)
    return Money(total, currency)


def apply_discount(amount: Money, discount_percent: Decimal) -> Money:
    """
    Apply percentage discount to money amount.
    
    Args:
        amount: Original amount
        discount_percent: Discount percentage (e.g., 10 for 10%)
        
    Returns:
        Amount after discount
    """
    if discount_percent < 0 or discount_percent > 100:
        raise ValueError("Discount percentage must be between 0 and 100")
    
    discount = amount.amount * (discount_percent / 100)
    discounted_amount = amount.amount - discount
    
    return Money(discounted_amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP), amount.currency)


def calculate_tax(amount: Money, tax_rate: Decimal) -> Money:
    """
    Calculate tax amount.
    
    Args:
        amount: Base amount to calculate tax on
        tax_rate: Tax rate as decimal (e.g., 0.16 for 16% VAT)
        
    Returns:
        Tax amount
    """
    if tax_rate < 0:
        raise ValueError("Tax rate cannot be negative")
    
    tax_amount = amount.amount * tax_rate
    return Money(tax_amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP), amount.currency)


def add_tax(amount: Money, tax_rate: Decimal) -> Money:
    """
    Add tax to amount (amount + tax).
    
    Args:
        amount: Base amount
        tax_rate: Tax rate as decimal
        
    Returns:
        Amount including tax
    """
    tax = calculate_tax(amount, tax_rate)
    return Money(amount.amount + tax.amount, amount.currency)


def format_money(amount: Money, include_symbol: bool = True) -> str:
    """
    Format money for display.
    
    Args:
        amount: Money object to format
        include_symbol: Whether to include currency symbol
        
    Returns:
        Formatted money string
    """
    # Currency symbols mapping
    symbols = {
        "KES": "KSh",
        "USD": "$",
        "EUR": "€",
        "GBP": "£",
    }
    
    # Format the amount with commas for thousands
    formatted_amount = f"{amount.amount:,.2f}"
    
    if include_symbol:
        symbol = symbols.get(amount.currency, amount.currency)
        return f"{symbol} {formatted_amount}"
    
    return f"{formatted_amount} {amount.currency}"


def convert_currency(
    amount: Money, 
    target_currency: str, 
    exchange_rates: Dict[str, Decimal]
) -> Money:
    """
    Convert money to different currency.
    
    Args:
        amount: Money to convert
        target_currency: Target currency code
        exchange_rates: Exchange rates dict (from_currency_to_currency: rate)
        
    Returns:
        Converted money amount
        
    Raises:
        ValueError: If exchange rate not found
    """
    if amount.currency == target_currency:
        return amount
    
    rate_key = f"{amount.currency}_{target_currency}"
    
    if rate_key not in exchange_rates:
        raise ValueError(f"Exchange rate not found for {rate_key}")
    
    rate = exchange_rates[rate_key]
    converted_amount = amount.amount * rate
    
    return Money(converted_amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP), target_currency)


def calculate_service_fee(
    amount: Money, 
    fee_percentage: Decimal, 
    min_fee: Optional[Money] = None,
    max_fee: Optional[Money] = None
) -> Money:
    """
    Calculate service fee with optional min/max limits.
    
    Args:
        amount: Base amount
        fee_percentage: Fee percentage as decimal
        min_fee: Minimum fee (optional)
        max_fee: Maximum fee (optional)
        
    Returns:
        Service fee amount
    """
    fee_amount = amount.amount * fee_percentage
    fee = Money(fee_amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP), amount.currency)
    
    if min_fee and fee.amount < min_fee.amount:
        return min_fee
    
    if max_fee and fee.amount > max_fee.amount:
        return max_fee
    
    return fee


def split_amount(amount: Money, num_splits: int) -> List[Money]:
    """
    Split an amount into equal parts.
    
    Args:
        amount: Amount to split
        num_splits: Number of parts to split into
        
    Returns:
        List of Money objects (may have rounding differences in last item)
    """
    if num_splits <= 0:
        raise ValueError("Number of splits must be positive")
    
    base_amount = (amount.amount / num_splits).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    splits = []
    
    for i in range(num_splits - 1):
        splits.append(Money(base_amount, amount.currency))
    
    # Last split gets any remaining amount due to rounding
    remaining = amount.amount - (base_amount * (num_splits - 1))
    splits.append(Money(remaining, amount.currency))
    
    return splits


def calculate_compound_discount(
    amount: Money, 
    discounts: List[Decimal]
) -> Money:
    """
    Apply multiple discounts sequentially (compound).
    
    Args:
        amount: Original amount
        discounts: List of discount percentages
        
    Returns:
        Amount after all discounts
    """
    current_amount = amount
    
    for discount in discounts:
        current_amount = apply_discount(current_amount, discount)
    
    return current_amount
