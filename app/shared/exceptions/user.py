class UserException(Exception):
    """Base exception for user module."""
    pass

class UserAlreadyExistsError(UserException):
    """Raised when a user with the given email already exists."""
    pass
