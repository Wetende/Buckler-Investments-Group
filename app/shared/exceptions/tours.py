class TourException(Exception):
    """Base exception for Tour module"""
    pass

class TourNotFoundError(TourException):
    """Raised when a tour is not found"""
    pass
