"""Date and time utility functions."""

from datetime import date, datetime, timedelta
from typing import List, Optional, Tuple
import calendar


def calculate_nights(check_in: date, check_out: date) -> int:
    """
    Calculate number of nights between check-in and check-out dates.
    
    Args:
        check_in: Check-in date
        check_out: Check-out date
        
    Returns:
        Number of nights
        
    Raises:
        ValueError: If check_out is not after check_in
    """
    if check_out <= check_in:
        raise ValueError("Check-out date must be after check-in date")
    
    return (check_out - check_in).days


def get_date_range(start: date, end: date) -> List[date]:
    """
    Generate list of dates in range (inclusive of start, exclusive of end).
    
    Args:
        start: Start date
        end: End date
        
    Returns:
        List of dates in the range
    """
    if end <= start:
        return []
    
    return [start + timedelta(days=x) for x in range((end - start).days)]


def is_valid_date_range(start: date, end: date, min_advance_days: int = 0) -> bool:
    """
    Validate that a date range is logical and meets business rules.
    
    Args:
        start: Start date
        end: End date
        min_advance_days: Minimum days in advance required
        
    Returns:
        True if date range is valid
    """
    if start >= end:
        return False
    
    if min_advance_days > 0:
        min_date = date.today() + timedelta(days=min_advance_days)
        if start < min_date:
            return False
    
    return True


def format_date_range(start: date, end: date, include_nights: bool = True) -> str:
    """
    Format a date range for display.
    
    Args:
        start: Start date
        end: End date
        include_nights: Whether to include night count
        
    Returns:
        Formatted date range string
    """
    start_str = start.strftime("%b %d, %Y")
    end_str = end.strftime("%b %d, %Y")
    
    if include_nights:
        nights = calculate_nights(start, end)
        return f"{start_str} - {end_str} ({nights} night{'s' if nights != 1 else ''})"
    
    return f"{start_str} - {end_str}"


def get_next_business_day(from_date: Optional[date] = None) -> date:
    """
    Get the next business day (Monday-Friday).
    
    Args:
        from_date: Starting date (defaults to today)
        
    Returns:
        Next business day
    """
    if from_date is None:
        from_date = date.today()
    
    next_day = from_date + timedelta(days=1)
    
    # If it's Saturday (5) or Sunday (6), move to Monday
    while next_day.weekday() >= 5:
        next_day += timedelta(days=1)
    
    return next_day


def get_month_date_range(year: int, month: int) -> Tuple[date, date]:
    """
    Get the first and last day of a month.
    
    Args:
        year: Year
        month: Month (1-12)
        
    Returns:
        Tuple of (first_day, last_day) of the month
    """
    first_day = date(year, month, 1)
    last_day = date(year, month, calendar.monthrange(year, month)[1])
    return first_day, last_day


def is_weekend(check_date: date) -> bool:
    """
    Check if a date falls on a weekend.
    
    Args:
        check_date: Date to check
        
    Returns:
        True if date is Saturday or Sunday
    """
    return check_date.weekday() >= 5


def get_season(check_date: date) -> str:
    """
    Determine the season for a given date (Kenya-specific).
    
    Args:
        check_date: Date to check
        
    Returns:
        Season name: 'dry_season', 'long_rains', 'short_rains'
    """
    month = check_date.month
    
    if month in [12, 1, 2, 3]:  # Dec-Mar: Dry season
        return "dry_season"
    elif month in [4, 5, 6]:  # Apr-Jun: Long rains
        return "long_rains"
    elif month in [7, 8, 9]:  # Jul-Sep: Dry season
        return "dry_season" 
    else:  # Oct-Nov: Short rains
        return "short_rains"


def add_business_days(start_date: date, business_days: int) -> date:
    """
    Add business days to a date, skipping weekends.
    
    Args:
        start_date: Starting date
        business_days: Number of business days to add
        
    Returns:
        Date after adding business days
    """
    current_date = start_date
    days_added = 0
    
    while days_added < business_days:
        current_date += timedelta(days=1)
        if not is_weekend(current_date):
            days_added += 1
    
    return current_date
