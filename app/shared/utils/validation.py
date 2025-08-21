"""Common validation utility functions."""

import re
from typing import Optional, List, Dict, Any
from pathlib import Path


def validate_email(email: str) -> bool:
    """
    Validate email address format.
    
    Args:
        email: Email address to validate
        
    Returns:
        True if email is valid
    """
    if not email or len(email) > 254:
        return False
    
    # RFC 5322 regex pattern (simplified)
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validate_phone_number(phone: str, country_code: str = "KE") -> bool:
    """
    Validate phone number format.
    
    Args:
        phone: Phone number to validate
        country_code: Country code (KE for Kenya)
        
    Returns:
        True if phone number is valid
    """
    # Remove all non-digit characters
    digits_only = re.sub(r'\D', '', phone)
    
    if country_code == "KE":
        # Kenyan phone numbers: +254XXXXXXXXX or 07XXXXXXXX or 01XXXXXXXX
        if digits_only.startswith("254"):
            return len(digits_only) == 12 and digits_only[3] in "71"
        elif digits_only.startswith("0"):
            return len(digits_only) == 10 and digits_only[1] in "71"
        else:
            return len(digits_only) == 9 and digits_only[0] in "71"
    
    # Basic international format validation
    return 7 <= len(digits_only) <= 15


def validate_kenyan_id(id_number: str) -> bool:
    """
    Validate Kenyan national ID number.
    
    Args:
        id_number: ID number to validate
        
    Returns:
        True if ID number is valid
    """
    # Remove spaces and convert to string
    id_clean = str(id_number).replace(" ", "")
    
    # Must be 8 digits
    if not id_clean.isdigit() or len(id_clean) != 8:
        return False
    
    # Basic range check (1 to 50000000)
    id_int = int(id_clean)
    return 1 <= id_int <= 50000000


def sanitize_input(text: str, max_length: Optional[int] = None) -> str:
    """
    Sanitize user input by removing potentially harmful characters.
    
    Args:
        text: Text to sanitize
        max_length: Maximum allowed length
        
    Returns:
        Sanitized text
    """
    if not text:
        return ""
    
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    
    # Remove script tags and content
    text = re.sub(r'<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>', '', text, flags=re.IGNORECASE)
    
    # Remove potentially dangerous characters
    dangerous_chars = ['<', '>', '"', "'", '&', '\\', '/', '`']
    for char in dangerous_chars:
        text = text.replace(char, '')
    
    # Limit length if specified
    if max_length and len(text) > max_length:
        text = text[:max_length]
    
    return text.strip()


def validate_file_upload(
    filename: str, 
    allowed_extensions: List[str], 
    max_size_mb: Optional[float] = None,
    file_size: Optional[int] = None
) -> Dict[str, Any]:
    """
    Validate file upload parameters.
    
    Args:
        filename: Name of the uploaded file
        allowed_extensions: List of allowed file extensions
        max_size_mb: Maximum file size in MB
        file_size: Actual file size in bytes
        
    Returns:
        Dict with 'valid' boolean and 'errors' list
    """
    result = {"valid": True, "errors": []}
    
    if not filename:
        result["valid"] = False
        result["errors"].append("Filename is required")
        return result
    
    # Check file extension
    file_ext = Path(filename).suffix.lower()
    if file_ext not in [f".{ext.lower()}" for ext in allowed_extensions]:
        result["valid"] = False
        result["errors"].append(f"File type not allowed. Allowed types: {', '.join(allowed_extensions)}")
    
    # Check file size if provided
    if max_size_mb and file_size:
        max_size_bytes = max_size_mb * 1024 * 1024
        if file_size > max_size_bytes:
            result["valid"] = False
            result["errors"].append(f"File size exceeds {max_size_mb}MB limit")
    
    # Check for potentially dangerous filenames
    dangerous_names = ['index', 'config', 'admin', '.htaccess', 'web.config']
    base_name = Path(filename).stem.lower()
    if base_name in dangerous_names:
        result["valid"] = False
        result["errors"].append("Filename not allowed")
    
    return result


def validate_password_strength(password: str) -> Dict[str, Any]:
    """
    Validate password strength.
    
    Args:
        password: Password to validate
        
    Returns:
        Dict with 'valid' boolean, 'score' (0-4), and 'suggestions' list
    """
    result = {
        "valid": False,
        "score": 0,
        "suggestions": []
    }
    
    if not password:
        result["suggestions"].append("Password is required")
        return result
    
    score = 0
    
    # Length check
    if len(password) >= 8:
        score += 1
    else:
        result["suggestions"].append("Use at least 8 characters")
    
    # Uppercase letter
    if re.search(r'[A-Z]', password):
        score += 1
    else:
        result["suggestions"].append("Include uppercase letters")
    
    # Lowercase letter
    if re.search(r'[a-z]', password):
        score += 1
    else:
        result["suggestions"].append("Include lowercase letters")
    
    # Number
    if re.search(r'\d', password):
        score += 1
    else:
        result["suggestions"].append("Include numbers")
    
    # Special character
    if re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        score += 1
    else:
        result["suggestions"].append("Include special characters")
    
    # Common passwords check
    common_passwords = ['password', '123456', 'qwerty', 'admin', 'letmein']
    if password.lower() in common_passwords:
        score = 0
        result["suggestions"].append("Avoid common passwords")
    
    result["score"] = min(score, 4)  # Cap at 4
    result["valid"] = score >= 3
    
    return result


def validate_coordinates(latitude: float, longitude: float) -> bool:
    """
    Validate GPS coordinates.
    
    Args:
        latitude: Latitude value
        longitude: Longitude value
        
    Returns:
        True if coordinates are valid
    """
    return -90 <= latitude <= 90 and -180 <= longitude <= 180


def validate_kenyan_coordinates(latitude: float, longitude: float) -> bool:
    """
    Validate coordinates are within Kenya bounds.
    
    Args:
        latitude: Latitude value
        longitude: Longitude value
        
    Returns:
        True if coordinates are within Kenya
    """
    # Kenya approximate bounds
    return (
        -4.7 <= latitude <= 5.5 and
        33.9 <= longitude <= 41.9 and
        validate_coordinates(latitude, longitude)
    )
