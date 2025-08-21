"""Password service abstraction for domain layer."""
from abc import ABC, abstractmethod


class PasswordService(ABC):
    """Abstract password service for domain layer."""
    
    @abstractmethod
    def hash_password(self, password: str) -> str:
        """Hash a plain text password.
        
        Args:
            password: Plain text password to hash
            
        Returns:
            Hashed password string
        """
        pass
    
    @abstractmethod
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash.
        
        Args:
            plain_password: Plain text password to verify
            hashed_password: Stored hash to verify against
            
        Returns:
            True if password matches, False otherwise
        """
        pass
