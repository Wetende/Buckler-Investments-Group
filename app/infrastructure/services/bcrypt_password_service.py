"""Bcrypt implementation of password service."""
from domain.services.password_service import PasswordService
from infrastructure.config.auth import get_password_hash, verify_password


class BcryptPasswordService(PasswordService):
    """Bcrypt implementation of password service."""
    
    def hash_password(self, password: str) -> str:
        """Hash a plain text password using bcrypt.
        
        Args:
            password: Plain text password to hash
            
        Returns:
            Hashed password string
        """
        return get_password_hash(password)
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash using bcrypt.
        
        Args:
            plain_password: Plain text password to verify
            hashed_password: Stored hash to verify against
            
        Returns:
            True if password matches, False otherwise
        """
        return verify_password(plain_password, hashed_password)
