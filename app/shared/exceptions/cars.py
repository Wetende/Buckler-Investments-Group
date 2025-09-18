class CarException(Exception):
    """Base exception for Car module"""
    pass

class VehicleNotFoundError(CarException):
    """Raised when a vehicle is not found"""
    pass

class RentalNotFoundError(CarException):
    """Raised when a rental is not found"""
    pass

class VehicleNotAvailableError(CarException):
    """Raised when a vehicle is not available for rental"""
    pass
