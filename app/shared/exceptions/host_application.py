"""
Host application specific exceptions.
"""


class HostApplicationException(Exception):
    """Base exception for host application domain"""
    pass


class HostApplicationNotFoundError(HostApplicationException):
    """Raised when a host application is not found"""
    
    def __init__(self, message: str = "Host application not found"):
        super().__init__(message)


class DuplicateHostApplicationError(HostApplicationException):
    """Raised when a user tries to create multiple host applications"""
    
    def __init__(self, message: str = "User already has a host application"):
        super().__init__(message)


class HostApplicationNotEditableError(HostApplicationException):
    """Raised when trying to edit a non-editable host application"""
    
    def __init__(self, status: str):
        super().__init__(f"Cannot edit host application in {status} status")


class HostApplicationNotSubmittableError(HostApplicationException):
    """Raised when trying to submit an incomplete host application"""
    
    def __init__(self, reason: str):
        super().__init__(f"Cannot submit host application: {reason}")


class HostApplicationAccessDeniedError(HostApplicationException):
    """Raised when user doesn't have access to a host application"""
    
    def __init__(self, message: str = "Access denied to host application"):
        super().__init__(message)
