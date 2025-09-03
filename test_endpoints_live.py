#!/usr/bin/env python3
"""
Live endpoint testing with requests library
"""

import requests
import json
import time
from datetime import datetime

BASE_URL = "http://localhost:8000"
ACCESS_TOKEN = None
USER_ID = None
USER_EMAIL = None

def test_endpoint(name, method, url, headers=None, data=None, params=None, expected_status=None):
    """Test an endpoint and return formatted results"""
    print(f"\n🔹 {name}")
    print("=" * 60)

    headers = headers or {}
    params = params or {}

    try:
        if method == "GET":
            response = requests.get(url, headers=headers, params=params)
        elif method == "POST":
            response = requests.post(url, headers=headers, json=data, params=params)
        elif method == "PUT":
            response = requests.put(url, headers=headers, json=data, params=params)
        elif method == "DELETE":
            response = requests.delete(url, headers=headers, params=params)
        else:
            print("❌ Unsupported method")
            return None

        print(f"Method: {method}")
        print(f"URL: {url}")
        print(f"Status Code: {response.status_code}")

        if expected_status and response.status_code != expected_status:
            print(f"⚠️  Expected {expected_status}, got {response.status_code}")

        if params:
            print(f"Query Params: {params}")

        if data:
            print(f"Request Body: {json.dumps(data, indent=2)}")

        try:
            response_data = response.json()
            print("Response Body:")
            print(json.dumps(response_data, indent=2))
            return response_data
        except:
            print("Response Body:")
            print(response.text)
            return response.text

    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return None

def get_auth_headers():
    """Get authorization headers"""
    if ACCESS_TOKEN:
        return {
            'Authorization': f'Bearer {ACCESS_TOKEN}',
            'Content-Type': 'application/json'
        }
    return {'Content-Type': 'application/json'}

def main():
    """Main testing function"""
    print("🧪 LIVE ENDPOINT TESTING - WETENDE USER JOURNEY")
    print("=" * 70)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)

    # Test 1: Health Check
    response = test_endpoint(
        "Health Check",
        "GET",
        f"{BASE_URL}/health",
        expected_status=200
    )

    if not response:
        print("\n❌ Server is not running or not responding!")
        print("Please start the server first:")
        print("cd app && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000")
        return

    # Test 2: Register Wetende
    global USER_ID, USER_EMAIL
    timestamp = int(datetime.now().timestamp())
    USER_EMAIL = f'wetende_{timestamp}@example.com'

    response = test_endpoint(
        "Register Wetende User",
        "POST",
        f"{BASE_URL}/api/v1/auth/register",
        data={
            "email": USER_EMAIL,
            "password": "testpassword123",
            "name": "Wetende User",
            "phone": "+254712345678",
            "role": "BUYER"
        },
        expected_status=201
    )

    if response and isinstance(response, dict):
        USER_ID = response.get('id')
        print(f"\n✅ User registered successfully! ID: {USER_ID}")

        # Test 3: Login
        global ACCESS_TOKEN
        login_response = test_endpoint(
            "Login Wetende User",
            "POST",
            f"{BASE_URL}/api/v1/auth/token",
            headers={'Content-Type': 'application/x-www-form-urlencoded'},
            data=f'username={USER_EMAIL}&password=testpassword123',
            expected_status=200
        )

        if login_response and isinstance(login_response, dict):
            ACCESS_TOKEN = login_response.get('access_token')
            print(f"\n✅ Login successful! Token obtained")

            # Test 4: Get User Profile
            test_endpoint(
                "Get User Profile",
                "GET",
                f"{BASE_URL}/api/v1/auth/me",
                headers=get_auth_headers(),
                expected_status=200
            )

            # Test 5: BnB Listings
            test_endpoint(
                "List BnB Listings",
                "GET",
                f"{BASE_URL}/api/v1/bnb/listings",
                expected_status=200
            )

            test_endpoint(
                "Get Specific BnB Listing",
                "GET",
                f"{BASE_URL}/api/v1/bnb/listings/1",
                expected_status=200
            )

            # Test 6: Reviews System
            test_endpoint(
                "Get Reviews for Listing",
                "GET",
                f"{BASE_URL}/api/v1/reviews/BNB_LISTING/1",
                expected_status=200
            )

            test_endpoint(
                "Get Review Statistics",
                "GET",
                f"{BASE_URL}/api/v1/reviews/BNB_LISTING/1/stats",
                expected_status=200
            )

            # Test 7: Dashboard Analytics
            test_endpoint(
                "Host Dashboard",
                "GET",
                f"{BASE_URL}/api/v1/bnb/host/dashboard",
                headers=get_auth_headers(),
                params={"host_id": USER_ID or 1},
                expected_status=200
            )

            # Test 8: Tours System
            test_endpoint(
                "List Tours",
                "GET",
                f"{BASE_URL}/api/v1/tours/",
                expected_status=200
            )

            test_endpoint(
                "Tour Operator Dashboard",
                "GET",
                f"{BASE_URL}/api/v1/tours/operator/dashboard",
                headers=get_auth_headers(),
                params={"operator_id": USER_ID or 1},
                expected_status=200
            )

            # Test 9: Property System
            test_endpoint(
                "List Properties",
                "GET",
                f"{BASE_URL}/api/v1/property/",
                expected_status=200
            )

            # Test 10: Missing Systems (expected 404)
            test_endpoint(
                "Investment System (Expected 404)",
                "GET",
                f"{BASE_URL}/api/v1/investment/products",
                expected_status=404
            )

            test_endpoint(
                "Cars System (Expected 404)",
                "GET",
                f"{BASE_URL}/api/v1/cars/",
                expected_status=404
            )

            test_endpoint(
                "Bundle System (Expected 404)",
                "GET",
                f"{BASE_URL}/api/v1/bundle/",
                expected_status=404
            )

            test_endpoint(
                "Search System (Expected 404)",
                "GET",
                f"{BASE_URL}/api/v1/search/",
                expected_status=404
            )

            # Test 11: API Documentation
            test_endpoint(
                "API Documentation",
                "GET",
                f"{BASE_URL}/docs",
                expected_status=200
            )

        else:
            print("\n❌ Login failed!")
    else:
        print("\n❌ User registration failed!")

    print("\n" + "=" * 70)
    print("🎉 WETENDE USER JOURNEY TESTING COMPLETE!")
    print("=" * 70)
    print(f"Completed at: {datetime.now().strftime('%H:%M:%S')}")

if __name__ == "__main__":
    main()


