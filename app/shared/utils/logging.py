"""Structured logging utilities for the application."""

import structlog
import logging.config
from typing import Any, Dict, Optional
from datetime import datetime
import json


def configure_structlog(
    log_level: str = "INFO",
    json_logs: bool = False,
    include_timestamp: bool = True
) -> None:
    """
    Configure structured logging for the application.
    
    Args:
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR)
        json_logs: Whether to output logs in JSON format
        include_timestamp: Whether to include timestamp in logs
    """
    timestamper = structlog.processors.TimeStamper(fmt="ISO")
    
    processors = [
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.StackInfoRenderer(),
    ]
    
    if include_timestamp:
        processors.append(timestamper)
    
    if json_logs:
        processors.append(structlog.processors.JSONRenderer())
    else:
        processors.append(structlog.dev.ConsoleRenderer())
    
    structlog.configure(
        processors=processors,
        wrapper_class=structlog.stdlib.BoundLogger,
        logger_factory=structlog.stdlib.LoggerFactory(),
        cache_logger_on_first_use=True,
    )
    
    # Configure standard library logging
    logging.basicConfig(
        level=getattr(logging, log_level.upper()),
        format="%(message)s",
    )


def get_logger(name: str) -> structlog.stdlib.BoundLogger:
    """
    Get a structured logger instance.
    
    Args:
        name: Logger name (usually __name__)
        
    Returns:
        Configured logger instance
    """
    return structlog.get_logger(name)


class LoggerMixin:
    """Mixin to add logging capabilities to classes."""
    
    @property
    def logger(self) -> structlog.stdlib.BoundLogger:
        """Get logger for this class."""
        if not hasattr(self, '_logger'):
            self._logger = get_logger(self.__class__.__name__)
        return self._logger


def log_function_call(func_name: str, args: Dict[str, Any], user_id: Optional[int] = None):
    """
    Log function call with parameters.
    
    Args:
        func_name: Name of the function being called
        args: Function arguments
        user_id: User ID if applicable
    """
    logger = get_logger("function_calls")
    logger.info(
        "Function called",
        function=func_name,
        arguments=args,
        user_id=user_id,
        timestamp=datetime.now().isoformat()
    )


def log_booking_event(
    event_type: str,
    booking_id: int,
    user_id: int,
    booking_type: str,
    additional_data: Optional[Dict[str, Any]] = None
):
    """
    Log booking-related events.
    
    Args:
        event_type: Type of booking event
        booking_id: Booking ID
        user_id: User ID
        booking_type: Type of booking (bnb, tour, vehicle, etc.)
        additional_data: Additional event data
    """
    logger = get_logger("booking_events")
    logger.info(
        "Booking event",
        event_type=event_type,
        booking_id=booking_id,
        user_id=user_id,
        booking_type=booking_type,
        timestamp=datetime.now().isoformat(),
        **(additional_data or {})
    )


def log_payment_event(
    event_type: str,
    payment_id: str,
    amount: float,
    currency: str,
    user_id: int,
    status: str,
    additional_data: Optional[Dict[str, Any]] = None
):
    """
    Log payment-related events.
    
    Args:
        event_type: Type of payment event
        payment_id: Payment ID
        amount: Payment amount
        currency: Payment currency
        user_id: User ID
        status: Payment status
        additional_data: Additional event data
    """
    logger = get_logger("payment_events")
    logger.info(
        "Payment event",
        event_type=event_type,
        payment_id=payment_id,
        amount=amount,
        currency=currency,
        user_id=user_id,
        status=status,
        timestamp=datetime.now().isoformat(),
        **(additional_data or {})
    )


def log_security_event(
    event_type: str,
    user_id: Optional[int],
    ip_address: Optional[str],
    user_agent: Optional[str],
    additional_data: Optional[Dict[str, Any]] = None
):
    """
    Log security-related events.
    
    Args:
        event_type: Type of security event
        user_id: User ID if applicable
        ip_address: IP address
        user_agent: User agent string
        additional_data: Additional event data
    """
    logger = get_logger("security_events")
    logger.warning(
        "Security event",
        event_type=event_type,
        user_id=user_id,
        ip_address=ip_address,
        user_agent=user_agent,
        timestamp=datetime.now().isoformat(),
        **(additional_data or {})
    )


def log_api_request(
    method: str,
    endpoint: str,
    user_id: Optional[int],
    response_status: int,
    response_time_ms: float,
    ip_address: Optional[str] = None
):
    """
    Log API request information.
    
    Args:
        method: HTTP method
        endpoint: API endpoint
        user_id: User ID if authenticated
        response_status: HTTP response status
        response_time_ms: Response time in milliseconds
        ip_address: Client IP address
    """
    logger = get_logger("api_requests")
    logger.info(
        "API request",
        method=method,
        endpoint=endpoint,
        user_id=user_id,
        status=response_status,
        response_time_ms=response_time_ms,
        ip_address=ip_address,
        timestamp=datetime.now().isoformat()
    )


def log_database_query(
    query_type: str,
    table_name: str,
    execution_time_ms: float,
    row_count: Optional[int] = None
):
    """
    Log database query performance.
    
    Args:
        query_type: Type of query (SELECT, INSERT, UPDATE, DELETE)
        table_name: Database table name
        execution_time_ms: Query execution time in milliseconds
        row_count: Number of rows affected/returned
    """
    logger = get_logger("database_queries")
    logger.debug(
        "Database query",
        query_type=query_type,
        table=table_name,
        execution_time_ms=execution_time_ms,
        row_count=row_count,
        timestamp=datetime.now().isoformat()
    )


def log_error(
    error: Exception,
    context: Optional[Dict[str, Any]] = None,
    user_id: Optional[int] = None
):
    """
    Log error with context information.
    
    Args:
        error: Exception that occurred
        context: Additional context information
        user_id: User ID if applicable
    """
    logger = get_logger("errors")
    logger.error(
        "Error occurred",
        error_type=error.__class__.__name__,
        error_message=str(error),
        user_id=user_id,
        timestamp=datetime.now().isoformat(),
        **(context or {})
    )


class RequestContextLogger:
    """Logger that automatically includes request context."""
    
    def __init__(self, base_logger: structlog.stdlib.BoundLogger):
        self.base_logger = base_logger
    
    def bind_request_context(
        self,
        request_id: str,
        user_id: Optional[int] = None,
        ip_address: Optional[str] = None
    ):
        """
        Bind request context to logger.
        
        Args:
            request_id: Unique request ID
            user_id: User ID if authenticated
            ip_address: Client IP address
            
        Returns:
            Logger with bound context
        """
        return self.base_logger.bind(
            request_id=request_id,
            user_id=user_id,
            ip_address=ip_address
        )


# Performance monitoring
class PerformanceLogger:
    """Logger for performance monitoring."""
    
    def __init__(self):
        self.logger = get_logger("performance")
    
    def log_endpoint_performance(
        self,
        endpoint: str,
        method: str,
        response_time_ms: float,
        memory_usage_mb: Optional[float] = None
    ):
        """Log endpoint performance metrics."""
        self.logger.info(
            "Endpoint performance",
            endpoint=endpoint,
            method=method,
            response_time_ms=response_time_ms,
            memory_usage_mb=memory_usage_mb,
            timestamp=datetime.now().isoformat()
        )
    
    def log_use_case_performance(
        self,
        use_case: str,
        execution_time_ms: float,
        success: bool
    ):
        """Log use case performance metrics."""
        self.logger.info(
            "Use case performance",
            use_case=use_case,
            execution_time_ms=execution_time_ms,
            success=success,
            timestamp=datetime.now().isoformat()
        )
