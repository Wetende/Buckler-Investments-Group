#!/usr/bin/env python3
"""
Complete User Journey Test - Testing all authentication endpoints
This script simulates a real user going through the entire authentication flow.
"""
import json
import time
from datetime import datetime
from fastapi.testclient import TestClient
from api.main import app

# Create test client
client = TestClient(app)
API_BASE = "/api/v1"

class AuthTestSuite:
    def __init__(self):
        self.access_token = None
        self.refresh_token = None
        self.user_data = None
        self.test_user = {
            "email": f"testuser_{int(time.time())}@example.com",
            "name": "Test User Journey",
            "password": "TestPassword123!",
            "phone": "+1234567890",
            "role": "user"
        }
        self.results = []

    def log_test(self, test_name, success, details="", response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   📝 {details}")
        if response_data and not success:
            print(f"   🔍 Response: {response_data}")
        print()
        
        self.results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })

    def test_1_user_registration(self):
        """Test 1: User Registration"""
        print("🚀 TEST 1: User Registration")
        
        try:
            response = client.post(
                f"{API_BASE}/users/",
                json=self.test_user,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 201:
                user_data = response.json()
                self.user_data = user_data
                self.log_test(
                    "User Registration", 
                    True, 
                    f"User created with ID: {user_data.get('id')}, Email: {user_data.get('email')}"
                )
                return True
            else:
                self.log_test(
                    "User Registration", 
                    False, 
                    f"Status: {response.status_code}",
                    response.text
                )
                return False
                
        except Exception as e:
            self.log_test("User Registration", False, f"Exception: {str(e)}")
            return False

    def test_2_user_login(self):
        """Test 2: User Login & Token Generation"""
        print("🔐 TEST 2: User Login & Token Generation")
        
        try:
            # OAuth2 login format
            login_data = {
                "username": self.test_user["email"],
                "password": self.test_user["password"]
            }
            
            response = client.post(
                f"{API_BASE}/auth/token",
                data=login_data,
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            
            if response.status_code == 200:
                token_data = response.json()
                self.access_token = token_data.get("access_token")
                self.refresh_token = token_data.get("refresh_token")
                
                self.log_test(
                    "User Login", 
                    True, 
                    f"Tokens received - Access: {self.access_token[:20]}..., Refresh: {self.refresh_token[:20] if self.refresh_token else 'None'}..."
                )
                return True
            else:
                self.log_test(
                    "User Login", 
                    False, 
                    f"Status: {response.status_code}",
                    response.text
                )
                return False
                
        except Exception as e:
            self.log_test("User Login", False, f"Exception: {str(e)}")
            return False

    def test_3_protected_route_access(self):
        """Test 3: Access Protected Route (Get Current User)"""
        print("🛡️ TEST 3: Protected Route Access")
        
        if not self.access_token:
            self.log_test("Protected Route Access", False, "No access token available")
            return False
        
        try:
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }
            
            response = client.get(f"{API_BASE}/users/me", headers=headers)
            
            if response.status_code == 200:
                user_data = response.json()
                self.log_test(
                    "Protected Route Access", 
                    True, 
                    f"Current user data retrieved: {user_data.get('name')} ({user_data.get('email')})"
                )
                return True
            else:
                self.log_test(
                    "Protected Route Access", 
                    False, 
                    f"Status: {response.status_code}",
                    response.text
                )
                return False
                
        except Exception as e:
            self.log_test("Protected Route Access", False, f"Exception: {str(e)}")
            return False

    def test_4_token_refresh(self):
        """Test 4: Token Refresh"""
        print("🔄 TEST 4: Token Refresh")
        
        if not self.refresh_token:
            self.log_test("Token Refresh", False, "No refresh token available")
            return False
        
        try:
            refresh_data = {"refresh_token": self.refresh_token}
            
            response = client.post(
                f"{API_BASE}/auth/refresh",
                json=refresh_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                token_data = response.json()
                new_access_token = token_data.get("access_token")
                
                self.log_test(
                    "Token Refresh", 
                    True, 
                    f"New access token received: {new_access_token[:20]}..."
                )
                
                # Update with new token for subsequent tests
                self.access_token = new_access_token
                return True
            else:
                self.log_test(
                    "Token Refresh", 
                    False, 
                    f"Status: {response.status_code}",
                    response.text
                )
                return False
                
        except Exception as e:
            self.log_test("Token Refresh", False, f"Exception: {str(e)}")
            return False

    def test_5_change_password(self):
        """Test 5: Change Password"""
        print("🔑 TEST 5: Change Password")
        
        if not self.access_token:
            self.log_test("Change Password", False, "No access token available")
            return False
        
        try:
            new_password = "NewTestPassword456!"
            password_data = {
                "old_password": self.test_user["password"],
                "new_password": new_password
            }
            
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }
            
            response = client.post(
                f"{API_BASE}/auth/change-password",
                json=password_data,
                headers=headers
            )
            
            if response.status_code == 200:
                self.log_test(
                    "Change Password", 
                    True, 
                    "Password changed successfully"
                )
                # Update password for future tests
                self.test_user["password"] = new_password
                return True
            else:
                self.log_test(
                    "Change Password", 
                    False, 
                    f"Status: {response.status_code}",
                    response.text
                )
                return False
                
        except Exception as e:
            self.log_test("Change Password", False, f"Exception: {str(e)}")
            return False

    def test_6_password_reset_request(self):
        """Test 6: Password Reset Request"""
        print("📧 TEST 6: Password Reset Request")
        
        try:
            reset_data = {"email": self.test_user["email"]}
            
            response = client.post(
                f"{API_BASE}/auth/password-reset/request",
                json=reset_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                self.log_test(
                    "Password Reset Request", 
                    True, 
                    "Password reset email request sent successfully"
                )
                return True
            else:
                self.log_test(
                    "Password Reset Request", 
                    False, 
                    f"Status: {response.status_code}",
                    response.text
                )
                return False
                
        except Exception as e:
            self.log_test("Password Reset Request", False, f"Exception: {str(e)}")
            return False

    def test_7_revoke_refresh_token(self):
        """Test 7: Revoke Refresh Token"""
        print("🚫 TEST 7: Revoke Refresh Token")
        
        if not self.refresh_token:
            self.log_test("Revoke Refresh Token", False, "No refresh token available")
            return False
        
        try:
            revoke_data = {"refresh_token": self.refresh_token}
            
            response = client.post(
                f"{API_BASE}/auth/revoke",
                json=revoke_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                self.log_test(
                    "Revoke Refresh Token", 
                    True, 
                    "Refresh token revoked successfully"
                )
                return True
            else:
                self.log_test(
                    "Revoke Refresh Token", 
                    False, 
                    f"Status: {response.status_code}",
                    response.text
                )
                return False
                
        except Exception as e:
            self.log_test("Revoke Refresh Token", False, f"Exception: {str(e)}")
            return False

    def test_8_logout(self):
        """Test 8: User Logout"""
        print("👋 TEST 8: User Logout")
        
        if not self.access_token:
            self.log_test("User Logout", False, "No access token available")
            return False
        
        try:
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }
            
            response = client.post(f"{API_BASE}/auth/logout", headers=headers)
            
            if response.status_code == 200:
                self.log_test(
                    "User Logout", 
                    True, 
                    "User logged out successfully"
                )
                return True
            else:
                self.log_test(
                    "User Logout", 
                    False, 
                    f"Status: {response.status_code}",
                    response.text
                )
                return False
                
        except Exception as e:
            self.log_test("User Logout", False, f"Exception: {str(e)}")
            return False

    def test_9_verify_token_invalidation(self):
        """Test 9: Verify Token is Invalidated After Logout"""
        print("🔒 TEST 9: Verify Token Invalidation")
        
        try:
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }
            
            response = client.get(f"{API_BASE}/users/me", headers=headers)
            
            # Should fail with 401 if logout properly invalidated the token
            if response.status_code == 401:
                self.log_test(
                    "Token Invalidation", 
                    True, 
                    "Token properly invalidated after logout"
                )
                return True
            elif response.status_code == 200:
                self.log_test(
                    "Token Invalidation", 
                    False, 
                    "Token still valid after logout (logout may not invalidate client-side)"
                )
                return False
            else:
                self.log_test(
                    "Token Invalidation", 
                    False, 
                    f"Unexpected status: {response.status_code}",
                    response.text
                )
                return False
                
        except Exception as e:
            self.log_test("Token Invalidation", False, f"Exception: {str(e)}")
            return False

    def run_complete_journey(self):
        """Run the complete user journey test suite"""
        print("=" * 80)
        print("🧪 COMPLETE USER JOURNEY TEST SUITE")
        print("=" * 80)
        print(f"🎯 Testing user: {self.test_user['email']}")
        print(f"🌐 API Base URL: {API_BASE}")
        print(f"⏰ Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 80)
        print()

        # Run all tests in sequence
        tests = [
            self.test_1_user_registration,
            self.test_2_user_login,
            self.test_3_protected_route_access,
            self.test_4_token_refresh,
            self.test_5_change_password,
            self.test_6_password_reset_request,
            self.test_7_revoke_refresh_token,
            self.test_8_logout,
            self.test_9_verify_token_invalidation
        ]

        passed = 0
        failed = 0

        for test in tests:
            try:
                if test():
                    passed += 1
                else:
                    failed += 1
            except Exception as e:
                print(f"❌ Test failed with exception: {e}")
                failed += 1
            
            # Small delay between tests
            time.sleep(0.5)

        # Print final summary
        print("=" * 80)
        print("📊 TEST SUMMARY")
        print("=" * 80)
        print(f"✅ Tests Passed: {passed}")
        print(f"❌ Tests Failed: {failed}")
        print(f"📈 Success Rate: {(passed/(passed+failed)*100):.1f}%")
        print("=" * 80)

        if failed == 0:
            print("🎉 ALL TESTS PASSED! Authentication system is working perfectly!")
        else:
            print("⚠️  Some tests failed. Check the details above for issues.")

        return passed, failed


if __name__ == "__main__":
    # Wait a moment for server to start
    print("⏳ Waiting for server to start...")
    time.sleep(3)
    
    # Run the complete test suite
    test_suite = AuthTestSuite()
    test_suite.run_complete_journey()
