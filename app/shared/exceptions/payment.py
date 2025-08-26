class PaymentException(Exception):
    """Base exception for Payment module"""
    pass

class PaymentNotFoundError(PaymentException):
    """Raised when a payment is not found"""
    pass

class PaymentProcessingError(PaymentException):
    """Raised when payment processing fails"""
    pass

class PaymentMethodNotSupportedError(PaymentException):
    """Raised when payment method is not supported"""
    pass

class InsufficientFundsError(PaymentException):
    """Raised when payment fails due to insufficient funds"""
    pass

class PaymentAlreadyProcessedError(PaymentException):
    """Raised when trying to process an already processed payment"""
    pass

class RefundError(PaymentException):
    """Raised when refund processing fails"""
    pass

class WebhookVerificationError(PaymentException):
    """Raised when webhook signature verification fails"""
    pass
