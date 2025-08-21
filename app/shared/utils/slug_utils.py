"""Slug generation utility functions."""

import re
import unicodedata
from typing import Optional, Callable, Awaitable


def create_slug(text: str, max_length: int = 50) -> str:
    """
    Create a URL-friendly slug from text.
    
    Args:
        text: Text to convert to slug
        max_length: Maximum length of slug
        
    Returns:
        URL-friendly slug
    """
    if not text:
        return ""
    
    # Normalize unicode characters
    text = unicodedata.normalize('NFKD', text)
    
    # Convert to lowercase
    text = text.lower()
    
    # Replace spaces and special characters with hyphens
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    
    # Remove leading/trailing hyphens
    text = text.strip('-')
    
    # Truncate to max length
    if len(text) > max_length:
        text = text[:max_length].rsplit('-', 1)[0]
    
    return text


async def ensure_unique_slug(
    base_slug: str,
    check_exists_func: Callable[[str], Awaitable[bool]],
    max_attempts: int = 100
) -> str:
    """
    Ensure a slug is unique by appending numbers if necessary.
    
    Args:
        base_slug: Base slug to make unique
        check_exists_func: Async function that checks if slug exists
        max_attempts: Maximum number of attempts to find unique slug
        
    Returns:
        Unique slug
        
    Raises:
        ValueError: If unable to find unique slug within max_attempts
    """
    slug = base_slug
    
    for i in range(max_attempts):
        if not await check_exists_func(slug):
            return slug
        
        # Append number to make it unique
        slug = f"{base_slug}-{i + 1}"
    
    raise ValueError(f"Unable to generate unique slug after {max_attempts} attempts")


def create_property_slug(title: str, location: str, property_id: Optional[int] = None) -> str:
    """
    Create a slug specifically for property listings.
    
    Args:
        title: Property title
        location: Property location
        property_id: Property ID (optional)
        
    Returns:
        Property-specific slug
    """
    # Combine title and location
    combined = f"{title} {location}"
    base_slug = create_slug(combined, max_length=60)
    
    # Add property ID if provided
    if property_id:
        base_slug = f"{base_slug}-{property_id}"
    
    return base_slug


def create_tour_slug(title: str, location: str, duration_days: Optional[int] = None) -> str:
    """
    Create a slug specifically for tour packages.
    
    Args:
        title: Tour title
        location: Tour location
        duration_days: Tour duration in days (optional)
        
    Returns:
        Tour-specific slug
    """
    combined = f"{title} {location}"
    
    if duration_days:
        combined += f" {duration_days} days"
    
    return create_slug(combined, max_length=60)


def create_vehicle_slug(make: str, model: str, year: Optional[int] = None) -> str:
    """
    Create a slug specifically for vehicles.
    
    Args:
        make: Vehicle make
        model: Vehicle model
        year: Vehicle year (optional)
        
    Returns:
        Vehicle-specific slug
    """
    combined = f"{make} {model}"
    
    if year:
        combined += f" {year}"
    
    return create_slug(combined, max_length=50)


def extract_words_from_slug(slug: str) -> list[str]:
    """
    Extract words from a slug for search purposes.
    
    Args:
        slug: Slug to extract words from
        
    Returns:
        List of words from the slug
    """
    if not slug:
        return []
    
    # Split by hyphens and filter out empty strings
    words = [word for word in slug.split('-') if word]
    
    return words


def validate_slug(slug: str) -> bool:
    """
    Validate that a slug follows proper format.
    
    Args:
        slug: Slug to validate
        
    Returns:
        True if slug is valid
    """
    if not slug:
        return False
    
    # Check if slug contains only valid characters
    if not re.match(r'^[a-z0-9]+(?:-[a-z0-9]+)*$', slug):
        return False
    
    # Check length
    if len(slug) > 100:
        return False
    
    # Check that it doesn't start or end with hyphen
    if slug.startswith('-') or slug.endswith('-'):
        return False
    
    return True


def generate_slug_variants(base_slug: str, count: int = 5) -> list[str]:
    """
    Generate multiple slug variants for testing uniqueness.
    
    Args:
        base_slug: Base slug to create variants from
        count: Number of variants to generate
        
    Returns:
        List of slug variants
    """
    variants = [base_slug]
    
    for i in range(1, count):
        variants.append(f"{base_slug}-{i}")
    
    return variants
