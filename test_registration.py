#!/usr/bin/env python3
"""
Test registration endpoint specifically
"""

import requests
import json

def test_registration():
    """Test user registration endpoint"""
    url = "http://localhost:8000/api/v1/auth/register"

    data = {
        "email": "wetende_test@example.com",
        "password": "testpassword123",
        "name": "Wetende Test User",
        "phone": "+254712345678",
        "role": "BUYER"
    }

    headers = {
        "Content-Type": "application/json"
    }

    print("🧪 Testing User Registration Endpoint")
    print("=" * 50)
    print(f"URL: {url}")
    print(f"Method: POST")
    print(f"Headers: {headers}")
    print(f"Request Body: {json.dumps(data, indent=2)}")
    print("-" * 50)

    try:
        response = requests.post(url, json=data, headers=headers)

        print(f"Status Code: {response.status_code}")

        if response.status_code == 201:
            print("✅ Registration SUCCESSFUL!")
            print("Response Body:")
            print(json.dumps(response.json(), indent=2))
        else:
            print(f"❌ Registration FAILED with status {response.status_code}")
            print("Response Body:")
            try:
                print(json.dumps(response.json(), indent=2))
            except:
                print(response.text)

    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")

if __name__ == "__main__":
    test_registration()


