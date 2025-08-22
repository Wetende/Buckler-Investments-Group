"""
Authentication-related exceptions.
"""


class AuthenticationError(Exception):
    """Base exception for authentication errors."""
    pass


class InvalidRefreshTokenError(AuthenticationError):
    """Raised when refresh token is invalid or expired."""
    pass


class InvalidResetTokenError(AuthenticationError):
    """Raised when password reset token is invalid or expired."""
    pass


class InvalidPasswordError(AuthenticationError):
    """Raised when password is incorrect."""
    pass


class TokenExpiredError(AuthenticationError):
    """Raised when a token has expired."""
    pass


class InsufficientPermissionsError(AuthenticationError):
    """Raised when user lacks required permissions."""
    pass

