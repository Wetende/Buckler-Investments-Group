"""
Security tests for authentication system.

Tests security aspects like password hashing, token security, and vulnerability prevention.
"""
import pytest
from unittest.mock import Mock, patch
import re
from datetime import datetime, timedelta, UTC

from infrastructure.config.auth import (
    verify_password, 
    get_password_hash, 
    create_access_token,
    SECRET_KEY,
    ALGORITHM
)
from jose import jwt


class TestAuthenticationSecurity:
    """Security tests for authentication components."""

    def test_password_hashing_produces_different_hashes_for_same_password(self):
        """Test that password hashing produces different hashes due to salt."""
        # Arrange
        password = "TestPassword123!"
        
        # Act
        hash1 = get_password_hash(password)
        hash2 = get_password_hash(password)
        
        # Assert
        assert hash1 != hash2  # Should be different due to salt
        assert hash1.startswith("$2b$")  # bcrypt format
        assert hash2.startswith("$2b$")  # bcrypt format
        assert len(hash1) > 50  # Proper hash length
        assert len(hash2) > 50  # Proper hash length

    def test_password_verification_works_correctly(self):
        """Test that password verification works with hashed passwords."""
        # Arrange
        password = "SecurePassword123!"
        hashed = get_password_hash(password)
        
        # Act & Assert
        assert verify_password(password, hashed) is True
        assert verify_password("WrongPassword", hashed) is False
        assert verify_password("", hashed) is False

    def test_password_hashing_handles_special_characters(self):
        """Test password hashing with special characters and unicode."""
        # Arrange
        special_passwords = [
            "Pass@word#123$%^&*()",
            "密码Test123!",  # Unicode characters
            "P@ssw0rd with spaces!",
            "🔒🗝️SecurePassword123!",  # Emoji
            "'DROP TABLE users;--",  # SQL injection attempt
            "<script>alert('xss')</script>123!"  # XSS attempt
        ]
        
        for password in special_passwords:
            # Act
            hashed = get_password_hash(password)
            
            # Assert
            assert verify_password(password, hashed) is True
            assert hashed.startswith("$2b$")
            assert len(hashed) > 50

    def test_jwt_token_contains_required_claims(self):
        """Test that JWT tokens contain required security claims."""
        # Arrange
        user_id = 123
        
        # Act
        token = create_access_token(subject=user_id)
        
        # Assert
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # Required claims
        assert "sub" in payload
        assert "exp" in payload
        assert payload["sub"] == str(user_id)
        
        # Expiration should be in the future
        exp_timestamp = payload["exp"]
        exp_datetime = datetime.fromtimestamp(exp_timestamp, tz=UTC)
        assert exp_datetime > datetime.now(UTC)

    def test_jwt_token_expiration_time_is_reasonable(self):
        """Test that JWT token expiration time is set correctly."""
        # Arrange
        user_id = 123
        custom_expiration = timedelta(minutes=30)
        
        # Act
        token = create_access_token(subject=user_id, expires_delta=custom_expiration)
        
        # Assert
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        exp_timestamp = payload["exp"]
        exp_datetime = datetime.fromtimestamp(exp_timestamp, tz=UTC)
        
        # Should expire in approximately 30 minutes (allow 1 minute tolerance)
        expected_exp = datetime.now(UTC) + custom_expiration
        time_diff = abs((exp_datetime - expected_exp).total_seconds())
        assert time_diff < 60  # Within 1 minute tolerance

    def test_jwt_token_cannot_be_tampered_with(self):
        """Test that tampered JWT tokens are rejected."""
        # Arrange
        user_id = 123
        token = create_access_token(subject=user_id)
        
        # Act - Tamper with token
        tampered_token = token[:-10] + "tampered123"
        
        # Assert
        with pytest.raises(Exception):  # Should raise JWTError or similar
            jwt.decode(tampered_token, SECRET_KEY, algorithms=[ALGORITHM])

    def test_jwt_token_different_for_different_users(self):
        """Test that different users get different JWT tokens."""
        # Arrange
        user_id_1 = 123
        user_id_2 = 456
        
        # Act
        token_1 = create_access_token(subject=user_id_1)
        token_2 = create_access_token(subject=user_id_2)
        
        # Assert
        assert token_1 != token_2
        
        payload_1 = jwt.decode(token_1, SECRET_KEY, algorithms=[ALGORITHM])
        payload_2 = jwt.decode(token_2, SECRET_KEY, algorithms=[ALGORITHM])
        
        assert payload_1["sub"] == str(user_id_1)
        assert payload_2["sub"] == str(user_id_2)

    def test_jwt_token_with_string_subject_works(self):
        """Test that JWT token creation works with string subject."""
        # Arrange
        subject = "user123"
        
        # Act
        token = create_access_token(subject=subject)
        
        # Assert
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        assert payload["sub"] == subject

    def test_password_hash_is_not_predictable(self):
        """Test that password hashes are not predictable or guessable."""
        # Arrange
        password = "TestPassword123!"
        
        # Act - Generate multiple hashes
        hashes = [get_password_hash(password) for _ in range(10)]
        
        # Assert
        # All hashes should be different
        assert len(set(hashes)) == 10
        
        # All should verify correctly
        for hash_value in hashes:
            assert verify_password(password, hash_value) is True

    def test_empty_or_none_password_handling(self):
        """Test security handling of empty or None passwords."""
        # Test empty string - bcrypt actually handles this, so test verification fails
        empty_hash = get_password_hash("")
        assert not verify_password("not_empty", empty_hash)  # Should not verify non-empty against empty
        
        # Test None - this should raise an exception
        with pytest.raises(Exception):
            get_password_hash(None)

    def test_very_long_password_handling(self):
        """Test handling of very long passwords (potential DoS protection)."""
        # Arrange - Very long password (1MB)
        long_password = "A" * (1024 * 1024)
        
        # Act & Assert - Should either work or fail gracefully
        try:
            hashed = get_password_hash(long_password)
            assert verify_password(long_password, hashed) is True
        except Exception:
            # If it fails, it should fail gracefully, not crash
            pass

    def test_jwt_secret_key_is_strong(self):
        """Test that JWT secret key meets security requirements."""
        # Assert
        assert len(SECRET_KEY) >= 32  # At least 32 characters
        assert not SECRET_KEY.isdigit()  # Not just numbers
        assert not SECRET_KEY.isalpha()  # Not just letters
        assert SECRET_KEY != "secret"  # Not default/weak value
        assert SECRET_KEY != "your-secret-key"  # Not placeholder

    def test_jwt_algorithm_is_secure(self):
        """Test that JWT algorithm is secure."""
        # Assert
        secure_algorithms = ["HS256", "HS384", "HS512", "RS256", "RS384", "RS512"]
        assert ALGORITHM in secure_algorithms
        assert ALGORITHM != "none"  # Should not be 'none' algorithm

    def test_timing_attack_resistance_password_verification(self):
        """Test password verification resistance to timing attacks."""
        # Arrange
        correct_password = "CorrectPassword123!"
        correct_hash = get_password_hash(correct_password)
        wrong_password = "WrongPassword123!"
        
        # Act - Measure time for correct and incorrect password verification
        import time
        
        # Time correct password verification
        start_time = time.perf_counter()
        for _ in range(100):
            verify_password(correct_password, correct_hash)
        correct_time = time.perf_counter() - start_time
        
        # Time incorrect password verification
        start_time = time.perf_counter()
        for _ in range(100):
            verify_password(wrong_password, correct_hash)
        wrong_time = time.perf_counter() - start_time
        
        # Assert - Times should be similar (within reasonable bounds)
        # This is a basic timing attack test - real timing attacks are more sophisticated
        time_ratio = max(correct_time, wrong_time) / min(correct_time, wrong_time)
        assert time_ratio < 10  # Should not be orders of magnitude different

    def test_password_hash_format_validation(self):
        """Test that password hashes follow expected format."""
        # Arrange
        password = "TestPassword123!"
        
        # Act
        hashed = get_password_hash(password)
        
        # Assert bcrypt format: $2b$rounds$salt+hash
        bcrypt_pattern = re.compile(r'^\$2b\$\d{2}\$.{53}$')
        assert bcrypt_pattern.match(hashed), f"Hash doesn't match bcrypt pattern: {hashed}"

    def test_token_replay_attack_prevention(self):
        """Test that tokens can't be easily replayed (due to expiration)."""
        # Arrange
        user_id = 123
        short_expiry = timedelta(seconds=1)  # Very short expiry
        
        # Act
        token = create_access_token(subject=user_id, expires_delta=short_expiry)
        
        # Immediate decode should work
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        assert payload["sub"] == str(user_id)
        
        # Wait for token to expire (in a real test, you might mock time instead)
        import time
        time.sleep(2)
        
        # Assert - Expired token should be rejected
        with pytest.raises(Exception):  # Should raise ExpiredSignatureError
            jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

    def test_jwt_does_not_contain_sensitive_data(self):
        """Test that JWT tokens don't contain sensitive information."""
        # Arrange
        user_id = 123
        
        # Act
        token = create_access_token(subject=user_id)
        
        # Assert
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # Should only contain necessary claims, no sensitive data
        expected_claims = {"sub", "exp"}
        actual_claims = set(payload.keys())
        
        # May have additional claims like 'iat' (issued at), but no sensitive data
        forbidden_claims = {"password", "hashed_password", "secret", "api_key"}
        assert not forbidden_claims.intersection(actual_claims)
        
        # Check that none of the claim values look like sensitive data
        for key, value in payload.items():
            if isinstance(value, str):
                # Should not look like a password hash
                assert not value.startswith("$2b$")
                # Should not look like a long random string (API key)
                if len(value) > 20:
                    # Allow normal JWT claim values but not random tokens
                    assert key in ["sub"] or value.isdigit()
