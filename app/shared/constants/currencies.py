"""Currency constants and information."""

from dataclasses import dataclass
from typing import Dict
from decimal import Decimal


@dataclass
class CurrencyInfo:
    """Information about a currency."""
    
    code: str
    name: str
    symbol: str
    decimal_places: int
    is_crypto: bool = False


# Supported currencies
SUPPORTED_CURRENCIES: Dict[str, CurrencyInfo] = {
    "KES": CurrencyInfo(
        code="KES",
        name="Kenyan Shilling",
        symbol="KSh",
        decimal_places=2
    ),
    "USD": CurrencyInfo(
        code="USD",
        name="US Dollar",
        symbol="$",
        decimal_places=2
    ),
    "EUR": CurrencyInfo(
        code="EUR",
        name="Euro",
        symbol="€",
        decimal_places=2
    ),
    "GBP": CurrencyInfo(
        code="GBP",
        name="British Pound",
        symbol="£",
        decimal_places=2
    ),
    "TZS": CurrencyInfo(
        code="TZS",
        name="Tanzanian Shilling",
        symbol="TSh",
        decimal_places=2
    ),
    "UGX": CurrencyInfo(
        code="UGX",
        name="Ugandan Shilling",
        symbol="USh",
        decimal_places=0
    ),
}

# Default currency for the platform
DEFAULT_CURRENCY = "KES"

# East African currencies
EAST_AFRICAN_CURRENCIES = ["KES", "TZS", "UGX", "RWF", "BIF"]

# Major international currencies
INTERNATIONAL_CURRENCIES = ["USD", "EUR", "GBP"]

# Currency conversion rates (base: KES)
# Note: In production, these should come from a real-time API
DEFAULT_EXCHANGE_RATES: Dict[str, Decimal] = {
    "KES_USD": Decimal("0.0067"),  # 1 KES = 0.0067 USD
    "USD_KES": Decimal("149.25"),  # 1 USD = 149.25 KES
    "KES_EUR": Decimal("0.0061"),  # 1 KES = 0.0061 EUR  
    "EUR_KES": Decimal("163.93"),  # 1 EUR = 163.93 KES
    "KES_GBP": Decimal("0.0054"),  # 1 KES = 0.0054 GBP
    "GBP_KES": Decimal("185.19"),  # 1 GBP = 185.19 KES
    "KES_TZS": Decimal("15.67"),   # 1 KES = 15.67 TZS
    "TZS_KES": Decimal("0.064"),   # 1 TZS = 0.064 KES
}

# Minimum amounts for different currencies
MINIMUM_AMOUNTS: Dict[str, Decimal] = {
    "KES": Decimal("100"),     # 100 KES minimum
    "USD": Decimal("1"),       # 1 USD minimum
    "EUR": Decimal("1"),       # 1 EUR minimum
    "GBP": Decimal("1"),       # 1 GBP minimum
    "TZS": Decimal("1000"),    # 1000 TZS minimum
    "UGX": Decimal("1000"),    # 1000 UGX minimum
}

# Maximum amounts for different currencies (for fraud prevention)
MAXIMUM_AMOUNTS: Dict[str, Decimal] = {
    "KES": Decimal("10000000"),  # 10M KES maximum
    "USD": Decimal("100000"),    # 100K USD maximum
    "EUR": Decimal("100000"),    # 100K EUR maximum
    "GBP": Decimal("100000"),    # 100K GBP maximum
    "TZS": Decimal("100000000"), # 100M TZS maximum
    "UGX": Decimal("100000000"), # 100M UGX maximum
}


def get_currency_info(currency_code: str) -> CurrencyInfo:
    """
    Get currency information by code.
    
    Args:
        currency_code: Currency code (e.g., 'KES')
        
    Returns:
        CurrencyInfo object
        
    Raises:
        ValueError: If currency is not supported
    """
    if currency_code not in SUPPORTED_CURRENCIES:
        raise ValueError(f"Unsupported currency: {currency_code}")
    
    return SUPPORTED_CURRENCIES[currency_code]


def is_supported_currency(currency_code: str) -> bool:
    """
    Check if a currency is supported.
    
    Args:
        currency_code: Currency code to check
        
    Returns:
        True if currency is supported
    """
    return currency_code in SUPPORTED_CURRENCIES


def format_currency(amount: Decimal, currency_code: str) -> str:
    """
    Format amount with currency symbol.
    
    Args:
        amount: Amount to format
        currency_code: Currency code
        
    Returns:
        Formatted currency string
    """
    if not is_supported_currency(currency_code):
        return f"{amount} {currency_code}"
    
    currency_info = get_currency_info(currency_code)
    
    # Format with appropriate decimal places
    if currency_info.decimal_places == 0:
        formatted_amount = f"{amount:,.0f}"
    else:
        formatted_amount = f"{amount:,.{currency_info.decimal_places}f}"
    
    return f"{currency_info.symbol} {formatted_amount}"


def get_minimum_amount(currency_code: str) -> Decimal:
    """
    Get minimum allowed amount for a currency.
    
    Args:
        currency_code: Currency code
        
    Returns:
        Minimum amount
    """
    return MINIMUM_AMOUNTS.get(currency_code, Decimal("1"))


def get_maximum_amount(currency_code: str) -> Decimal:
    """
    Get maximum allowed amount for a currency.
    
    Args:
        currency_code: Currency code
        
    Returns:
        Maximum amount
    """
    return MAXIMUM_AMOUNTS.get(currency_code, Decimal("1000000"))


def is_valid_amount(amount: Decimal, currency_code: str) -> bool:
    """
    Check if an amount is valid for a currency.
    
    Args:
        amount: Amount to validate
        currency_code: Currency code
        
    Returns:
        True if amount is valid
    """
    if amount <= 0:
        return False
    
    min_amount = get_minimum_amount(currency_code)
    max_amount = get_maximum_amount(currency_code)
    
    return min_amount <= amount <= max_amount
