"""
Comprehensive test suite for all authentication endpoints.

This test file covers:
- User registration
- Login/logout flows
- Token refresh
- Password management
- Protected endpoints
- Error scenarios
"""
import pytest
import asyncio
from datetime import datetime
from typing import Dict, Any
from fastapi.testclient import TestClient
from fastapi import status
from sqlalchemy.ext.asyncio import AsyncSession

from api.main import app
from infrastructure.config.database import get_async_session
from application.dto.user import UserCreateDTO, TokenResponse, PasswordResetRequest, ChangePasswordRequest
from domain.value_objects.user_role import UserRole


class AuthenticationTester:
    """Helper class to manage authentication test flows."""
    
    def __init__(self, client: TestClient):
        self.client = client
        self.base_url = "/api/v1"
        self.auth_url = f"{self.base_url}/auth"
        self.users_url = f"{self.base_url}/users"
        
        # Test user data
        self.test_user_data = {
            "email": "test@buckler-investments.com",
            "password": "SecureTestPassword123!",
            "name": "Test User",
            "phone": "+1234567890",
            "role": "buyer"
        }
        
        self.test_user_2_data = {
            "email": "test2@buckler-investments.com", 
            "password": "AnotherSecurePassword456!",
            "name": "Test User 2",
            "phone": "+1987654321",
            "role": "seller"
        }
        
        self.access_token: str = ""
        self.refresh_token: str = ""
        self.user_id: int = 0
    
    def register_user(self, user_data: Dict[str, Any] = None):
        """Register a new user."""
        if user_data is None:
            user_data = self.test_user_data
            
        registration_payload = {
            "email": user_data["email"],
            "password": user_data["password"], 
            "name": user_data["name"],
            "phone": user_data.get("phone"),
            "role": user_data.get("role", "buyer")
        }
        
        response = self.client.post(f"{self.users_url}/", json=registration_payload)
        return response
    
    def login_user(self, email: str = None, password: str = None):
        """Login user and get tokens."""
        if email is None:
            email = self.test_user_data["email"]
        if password is None:
            password = self.test_user_data["password"]
            
        login_data = {
            "username": email,  # OAuth2 uses 'username' field
            "password": password,
            "grant_type": "password"
        }
        
        response = self.client.post(
            f"{self.auth_url}/token",
            data=login_data,  # Use form data for OAuth2
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        if response.status_code == 200:
            token_data = response.json()
            self.access_token = token_data["access_token"]
            self.refresh_token = token_data.get("refresh_token", "")
            
        return response
    
    def logout_user(self):
        """Logout current user."""
        headers = self.get_auth_headers()
        response = self.client.post(f"{self.auth_url}/logout", headers=headers)
        return response
    
    def refresh_access_token(self, refresh_token: str = None):
        """Refresh access token."""
        if refresh_token is None:
            refresh_token = self.refresh_token
            
        payload = {"refresh_token": refresh_token}
        response = self.client.post(f"{self.auth_url}/refresh", json=payload)
        
        if response.status_code == 200:
            token_data = response.json()
            self.access_token = token_data["access_token"]
            
        return response
    
    def get_current_user(self):
        """Get current authenticated user profile."""
        headers = self.get_auth_headers()
        response = self.client.get(f"{self.users_url}/me", headers=headers)
        
        if response.status_code == 200 and self.user_id == 0:
            user_data = response.json()
            self.user_id = user_data["id"]
            
        return response
    
    def change_password(self, old_password: str, new_password: str):
        """Change user password."""
        headers = self.get_auth_headers()
        payload = {
            "old_password": old_password,
            "new_password": new_password
        }
        response = self.client.post(f"{self.auth_url}/change-password", json=payload, headers=headers)
        return response
    
    def request_password_reset(self, email: str):
        """Request password reset."""
        payload = {"email": email}
        response = self.client.post(f"{self.auth_url}/password-reset/request", json=payload)
        return response
    
    def revoke_refresh_token(self, refresh_token: str = None):
        """Revoke a refresh token."""
        if refresh_token is None:
            refresh_token = self.refresh_token
            
        payload = {"refresh_token": refresh_token}
        response = self.client.post(f"{self.auth_url}/revoke", json=payload)
        return response
    
    def get_auth_headers(self) -> Dict[str, str]:
        """Get authorization headers with Bearer token."""
        return {"Authorization": f"Bearer {self.access_token}"}
    
    def test_protected_endpoint(self, endpoint: str, method: str = "GET"):
        """Test a protected endpoint with current auth token."""
        headers = self.get_auth_headers()
        
        if method.upper() == "GET":
            response = self.client.get(endpoint, headers=headers)
        elif method.upper() == "POST":
            response = self.client.post(endpoint, headers=headers)
        else:
            raise ValueError(f"Unsupported method: {method}")
            
        return response


@pytest.fixture
def auth_tester():
    """Fixture providing AuthenticationTester instance."""
    client = TestClient(app)
    return AuthenticationTester(client)


class TestUserRegistration:
    """Test user registration functionality."""
    
    def test_successful_registration(self, auth_tester: AuthenticationTester):
        """Test successful user registration."""
        response = auth_tester.register_user()
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        
        assert "id" in data
        assert data["email"] == auth_tester.test_user_data["email"]
        assert data["name"] == auth_tester.test_user_data["name"]
        assert data["is_active"] is True
        assert "created_at" in data
        
        # Sensitive data should not be returned
        assert "password" not in data
        assert "hashed_password" not in data
    
    def test_duplicate_email_registration(self, auth_tester: AuthenticationTester):
        """Test registration with duplicate email fails."""
        # Register first user
        response1 = auth_tester.register_user()
        assert response1.status_code == status.HTTP_201_CREATED
        
        # Try to register with same email
        response2 = auth_tester.register_user()
        assert response2.status_code == status.HTTP_400_BAD_REQUEST
        
        error_data = response2.json()
        assert "already exists" in error_data["detail"].lower()
    
    def test_invalid_email_registration(self, auth_tester: AuthenticationTester):
        """Test registration with invalid email format."""
        invalid_user_data = auth_tester.test_user_data.copy()
        invalid_user_data["email"] = "invalid-email-format"
        
        response = auth_tester.register_user(invalid_user_data)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_weak_password_registration(self, auth_tester: AuthenticationTester):
        """Test registration with weak password."""
        weak_password_data = auth_tester.test_user_data.copy()
        weak_password_data["password"] = "123"  # Too short
        
        response = auth_tester.register_user(weak_password_data)
        # Should either return 422 for validation error or 400 for business rule
        assert response.status_code in [status.HTTP_422_UNPROCESSABLE_ENTITY, status.HTTP_400_BAD_REQUEST]


class TestUserLogin:
    """Test user login functionality."""
    
    def test_successful_login(self, auth_tester: AuthenticationTester):
        """Test successful login flow."""
        # Register user first
        reg_response = auth_tester.register_user()
        assert reg_response.status_code == status.HTTP_201_CREATED
        
        # Login
        login_response = auth_tester.login_user()
        assert login_response.status_code == status.HTTP_200_OK
        
        token_data = login_response.json()
        assert "access_token" in token_data
        assert "refresh_token" in token_data
        assert token_data["token_type"] == "bearer"
        assert "expires_in" in token_data
        
        # Verify tokens are stored
        assert auth_tester.access_token != ""
        assert auth_tester.refresh_token != ""
    
    async def test_login_invalid_credentials(self, auth_tester: AuthenticationTester):
        """Test login with invalid credentials."""
        # Register user first
        reg_response = await auth_tester.register_user()
        assert reg_response.status_code == status.HTTP_201_CREATED
        
        # Try login with wrong password
        login_response = await auth_tester.login_user(
            email=auth_tester.test_user_data["email"],
            password="wrong_password"
        )
        assert login_response.status_code == status.HTTP_401_UNAUTHORIZED
        
        error_data = login_response.json()
        assert "incorrect" in error_data["detail"].lower()
    
    async def test_login_nonexistent_user(self, auth_tester: AuthenticationTester):
        """Test login with non-existent user."""
        login_response = await auth_tester.login_user(
            email="nonexistent@example.com",
            password="any_password"
        )
        assert login_response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.asyncio
class TestTokenRefresh:
    """Test token refresh functionality."""
    
    async def test_successful_token_refresh(self, auth_tester: AuthenticationTester):
        """Test successful token refresh."""
        # Setup: Register and login
        await auth_tester.register_user()
        await auth_tester.login_user()
        
        original_access_token = auth_tester.access_token
        
        # Refresh token
        refresh_response = await auth_tester.refresh_access_token()
        assert refresh_response.status_code == status.HTTP_200_OK
        
        token_data = refresh_response.json()
        assert "access_token" in token_data
        assert token_data["token_type"] == "bearer"
        
        # Verify new token is different
        assert auth_tester.access_token != original_access_token
    
    async def test_refresh_with_invalid_token(self, auth_tester: AuthenticationTester):
        """Test refresh with invalid refresh token."""
        refresh_response = await auth_tester.refresh_access_token("invalid_refresh_token")
        assert refresh_response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.asyncio
class TestUserLogout:
    """Test user logout functionality."""
    
    async def test_successful_logout(self, auth_tester: AuthenticationTester):
        """Test successful logout."""
        # Setup: Register and login
        await auth_tester.register_user()
        await auth_tester.login_user()
        
        # Logout
        logout_response = await auth_tester.logout_user()
        assert logout_response.status_code == status.HTTP_200_OK
        
        logout_data = logout_response.json()
        assert logout_data["ok"] is True
        assert "logged out" in logout_data["message"].lower()
    
    async def test_logout_without_authentication(self, auth_tester: AuthenticationTester):
        """Test logout without being authenticated."""
        logout_response = await auth_tester.logout_user()
        assert logout_response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.asyncio
class TestProtectedEndpoints:
    """Test protected endpoints with authentication."""
    
    async def test_get_current_user_profile(self, auth_tester: AuthenticationTester):
        """Test getting current user profile."""
        # Setup: Register and login
        await auth_tester.register_user()
        await auth_tester.login_user()
        
        # Get current user
        profile_response = await auth_tester.get_current_user()
        assert profile_response.status_code == status.HTTP_200_OK
        
        profile_data = profile_response.json()
        assert "id" in profile_data
        assert profile_data["email"] == auth_tester.test_user_data["email"]
        assert profile_data["is_active"] is True
    
    async def test_protected_endpoint_without_token(self, auth_tester: AuthenticationTester):
        """Test accessing protected endpoint without authentication."""
        response = await auth_tester.client.get(f"{auth_tester.users_url}/me")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    async def test_protected_endpoint_with_invalid_token(self, auth_tester: AuthenticationTester):
        """Test accessing protected endpoint with invalid token."""
        invalid_headers = {"Authorization": "Bearer invalid_token_here"}
        response = await auth_tester.client.get(f"{auth_tester.users_url}/me", headers=invalid_headers)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.asyncio
class TestPasswordManagement:
    """Test password management functionality."""
    
    async def test_change_password_success(self, auth_tester: AuthenticationTester):
        """Test successful password change."""
        # Setup: Register and login
        await auth_tester.register_user()
        await auth_tester.login_user()
        
        new_password = "NewSecurePassword789!"
        
        # Change password
        change_response = await auth_tester.change_password(
            old_password=auth_tester.test_user_data["password"],
            new_password=new_password
        )
        assert change_response.status_code == status.HTTP_200_OK
        
        change_data = change_response.json()
        assert change_data["ok"] is True
        
        # Verify old password no longer works
        old_login_response = await auth_tester.login_user(
            password=auth_tester.test_user_data["password"]
        )
        assert old_login_response.status_code == status.HTTP_401_UNAUTHORIZED
        
        # Verify new password works
        new_login_response = await auth_tester.login_user(password=new_password)
        assert new_login_response.status_code == status.HTTP_200_OK
    
    async def test_change_password_wrong_old_password(self, auth_tester: AuthenticationTester):
        """Test change password with wrong old password."""
        # Setup: Register and login
        await auth_tester.register_user()
        await auth_tester.login_user()
        
        # Try to change with wrong old password
        change_response = await auth_tester.change_password(
            old_password="wrong_old_password",
            new_password="NewSecurePassword789!"
        )
        assert change_response.status_code == status.HTTP_400_BAD_REQUEST
    
    async def test_password_reset_request(self, auth_tester: AuthenticationTester):
        """Test password reset request."""
        # Register user first
        await auth_tester.register_user()
        
        # Request password reset
        reset_response = await auth_tester.request_password_reset(
            auth_tester.test_user_data["email"]
        )
        assert reset_response.status_code == status.HTTP_200_OK
        
        reset_data = reset_response.json()
        assert reset_data["ok"] is True
    
    async def test_password_reset_nonexistent_email(self, auth_tester: AuthenticationTester):
        """Test password reset request for non-existent email."""
        reset_response = await auth_tester.request_password_reset("nonexistent@example.com")
        # Should still return 200 to prevent email enumeration
        assert reset_response.status_code == status.HTTP_200_OK


@pytest.mark.asyncio
class TestTokenRevocation:
    """Test token revocation functionality."""
    
    async def test_revoke_refresh_token(self, auth_tester: AuthenticationTester):
        """Test revoking a refresh token."""
        # Setup: Register and login
        await auth_tester.register_user()
        await auth_tester.login_user()
        
        refresh_token = auth_tester.refresh_token
        
        # Revoke refresh token
        revoke_response = await auth_tester.revoke_refresh_token(refresh_token)
        assert revoke_response.status_code == status.HTTP_200_OK
        
        revoke_data = revoke_response.json()
        assert revoke_data["ok"] is True
        
        # Try to use revoked refresh token
        refresh_response = await auth_tester.refresh_access_token(refresh_token)
        assert refresh_response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.asyncio
class TestCompleteAuthenticationFlow:
    """Test complete authentication workflows."""
    
    async def test_complete_user_journey(self, auth_tester: AuthenticationTester):
        """Test complete user authentication journey."""
        print("\n=== Starting Complete Authentication Journey Test ===")
        
        # Step 1: Register user
        print("1. Registering new user...")
        reg_response = await auth_tester.register_user()
        assert reg_response.status_code == status.HTTP_201_CREATED
        user_data = reg_response.json()
        print(f"   ✓ User registered with ID: {user_data['id']}")
        
        # Step 2: Login
        print("2. Logging in...")
        login_response = await auth_tester.login_user()
        assert login_response.status_code == status.HTTP_200_OK
        token_data = login_response.json()
        print(f"   ✓ Login successful, access token: {token_data['access_token'][:20]}...")
        
        # Step 3: Access protected endpoint
        print("3. Accessing protected endpoint...")
        profile_response = await auth_tester.get_current_user()
        assert profile_response.status_code == status.HTTP_200_OK
        profile_data = profile_response.json()
        print(f"   ✓ Profile retrieved for user: {profile_data['email']}")
        
        # Step 4: Refresh token
        print("4. Refreshing access token...")
        old_token = auth_tester.access_token
        refresh_response = await auth_tester.refresh_access_token()
        assert refresh_response.status_code == status.HTTP_200_OK
        print(f"   ✓ Token refreshed successfully")
        
        # Step 5: Use new token to access endpoint
        print("5. Using new token to access endpoint...")
        profile_response2 = await auth_tester.get_current_user()
        assert profile_response2.status_code == status.HTTP_200_OK
        print(f"   ✓ New token works correctly")
        
        # Step 6: Change password
        print("6. Changing password...")
        new_password = "SuperNewPassword456!"
        change_response = await auth_tester.change_password(
            old_password=auth_tester.test_user_data["password"],
            new_password=new_password
        )
        assert change_response.status_code == status.HTTP_200_OK
        print(f"   ✓ Password changed successfully")
        
        # Step 7: Login with new password
        print("7. Logging in with new password...")
        new_login_response = await auth_tester.login_user(password=new_password)
        assert new_login_response.status_code == status.HTTP_200_OK
        print(f"   ✓ Login with new password successful")
        
        # Step 8: Logout
        print("8. Logging out...")
        logout_response = await auth_tester.logout_user()
        assert logout_response.status_code == status.HTTP_200_OK
        print(f"   ✓ Logout successful")
        
        print("=== Complete Authentication Journey Test PASSED ===\n")
    
    async def test_multiple_users_isolation(self, auth_tester: AuthenticationTester):
        """Test that multiple users are properly isolated."""
        print("\n=== Testing Multiple Users Isolation ===")
        
        # Register and login first user
        print("1. Setting up first user...")
        await auth_tester.register_user()
        await auth_tester.login_user()
        user1_profile = await auth_tester.get_current_user()
        user1_token = auth_tester.access_token
        user1_data = user1_profile.json()
        print(f"   ✓ User 1: {user1_data['email']}")
        
        # Register and login second user (using different client instance)
        print("2. Setting up second user...")
        async with AsyncClient(app=app, base_url="http://testserver") as client2:
            auth_tester2 = AuthenticationTester(client2)
            await auth_tester2.register_user(auth_tester.test_user_2_data)
            await auth_tester2.login_user(
                email=auth_tester.test_user_2_data["email"],
                password=auth_tester.test_user_2_data["password"]
            )
            user2_profile = await auth_tester2.get_current_user()
            user2_token = auth_tester2.access_token
            user2_data = user2_profile.json()
            print(f"   ✓ User 2: {user2_data['email']}")
            
            # Verify users are different
            assert user1_data["id"] != user2_data["id"]
            assert user1_data["email"] != user2_data["email"]
            assert user1_token != user2_token
            print(f"   ✓ Users are properly isolated")
            
            # Verify User 1's token doesn't work for User 2's client
            user2_headers = {"Authorization": f"Bearer {user1_token}"}
            cross_response = await client2.get(f"{auth_tester2.users_url}/me", headers=user2_headers)
            
            # The token should still work but return User 1's data, not User 2's
            if cross_response.status_code == 200:
                cross_data = cross_response.json()
                assert cross_data["id"] == user1_data["id"]  # Should get User 1's data
                print(f"   ✓ Cross-token usage returns correct user data")
        
        print("=== Multiple Users Isolation Test PASSED ===\n")


if __name__ == "__main__":
    # For manual testing
    async def main():
        async with AsyncClient(app=app, base_url="http://testserver") as client:
            tester = AuthenticationTester(client)
            
            print("🔐 Starting Manual Authentication Tests")
            print("=" * 50)
            
            try:
                # Test complete journey
                complete_test = TestCompleteAuthenticationFlow()
                await complete_test.test_complete_user_journey(tester)
                
                # Test isolation
                await complete_test.test_multiple_users_isolation(tester)
                
                print("✅ All manual tests passed!")
                
            except Exception as e:
                print(f"❌ Test failed: {e}")
                raise
    
    # Run manual tests
    # asyncio.run(main())
