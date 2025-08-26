class TourException(Exception):
    """Base exception for Tour module"""
    pass

class TourNotFoundError(TourException):
    """Raised when a tour is not found"""
    pass

class TourBookingNotFoundError(TourException):
    """Raised when a tour booking is not found"""
    pass

class TourBookingCancellationError(TourException):
    """Raised when a tour booking cannot be cancelled"""
    pass

class TourUnavailableError(TourException):
    """Raised when a tour is not available for booking"""
    pass
