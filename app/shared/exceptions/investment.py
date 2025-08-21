class InvestmentException(Exception):
    """Base exception for investment module."""
    pass

class InvestmentNotFoundError(InvestmentException):
    """Raised when an investment is not found."""
    pass

class InvestmentClosedError(InvestmentException):
    """Raised when an investment is not open for funding."""
    pass

class InvalidInvestmentAmountError(InvestmentException):
    """Raised when the investment amount is invalid (e.g., below minimum)."""
    pass
