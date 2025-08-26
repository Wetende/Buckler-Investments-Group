class BnbException(Exception):
    """Base exception for BNB module"""
    pass

class ListingNotFoundError(BnbException):
    """Raised when a listing is not found"""
    pass

class BookingNotFoundError(BnbException):
    """Raised when a booking is not found"""
    pass

class BookingCancellationError(BnbException):
    """Raised when a booking cannot be cancelled"""
    pass

class BookingApprovalError(BnbException):
    """Raised when a booking cannot be approved"""
    pass

class BookingRejectionError(BnbException):
    """Raised when a booking cannot be rejected"""
    pass

class InvalidNightsError(BnbException):
    """Raised when the number of nights for a booking is invalid"""
    pass
