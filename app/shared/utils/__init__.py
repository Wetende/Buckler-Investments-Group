"""Shared utilities for cross-cutting concerns."""

from .date_utils import (
    calculate_nights,
    get_date_range,
    is_valid_date_range,
    format_date_range,
    get_next_business_day,
)
from .money_utils import (
    calculate_total,
    apply_discount,
    convert_currency,
    format_money,
    calculate_tax,
)
from .validation import (
    validate_email,
    validate_phone_number,
    validate_kenyan_id,
    sanitize_input,
    validate_file_upload,
)
from .pagination import (
    PaginationParams,
    PaginationResult,
    paginate_query,
)
from .slug_utils import (
    create_slug,
    ensure_unique_slug,
)

__all__ = [
    # Date utilities
    "calculate_nights",
    "get_date_range", 
    "is_valid_date_range",
    "format_date_range",
    "get_next_business_day",
    # Money utilities
    "calculate_total",
    "apply_discount", 
    "convert_currency",
    "format_money",
    "calculate_tax",
    # Validation
    "validate_email",
    "validate_phone_number",
    "validate_kenyan_id",
    "sanitize_input",
    "validate_file_upload",
    # Pagination
    "PaginationParams",
    "PaginationResult",
    "paginate_query",
    # Slug utilities
    "create_slug",
    "ensure_unique_slug",
]
