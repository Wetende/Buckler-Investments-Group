class BnbException(Exception):
    """Base exception for BNB module"""
    pass

class ListingNotFoundError(BnbException):
    """Raised when a listing is not found"""
    pass

class InvalidNightsError(BnbException):
    """Raised when the number of nights for a booking is invalid"""
    pass
