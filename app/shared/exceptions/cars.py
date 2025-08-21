class CarException(Exception):
    """Base exception for Car module"""
    pass

class VehicleNotFoundError(CarException):
    """Raised when a vehicle is not found"""
    pass
