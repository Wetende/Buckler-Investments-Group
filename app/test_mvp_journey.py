#!/usr/bin/env python3
"""
MVP End-to-End Testing Script
Tests complete user journeys from registration to booking and reviews
"""

from main import app
from fastapi.testclient import TestClient
import json
from datetime import datetime, timedelta
import sys
from typing import Dict, Optional

class MVPJourneyTester:
    def __init__(self):
        self.client = TestClient(app)
        self.users = {}  # Store created users and their tokens
        self.listings = {}  # Store created listings
        self.bookings = {}  # Store created bookings
        self.test_results = []

    def log_step(self, step: str, success: bool, details: str = "", error: str = ""):
        """Log a test step result"""
        timestamp = datetime.now().strftime('%H:%M:%S')
        status = "✅ PASS" if success else "❌ FAIL"
        message = f"[{timestamp}] {status} {step}"

        if details:
            message += f" - {details}"
        if error:
            message += f" - ERROR: {error}"

        print(message)
        self.test_results.append({
            'step': step,
            'success': success,
            'details': details,
            'error': error,
            'timestamp': timestamp
        })

    def register_user(self, email: str, name: str, role: str = "user") -> Optional[str]:
        """Register a new user and return access token"""
        try:
            # Add timestamp to make emails unique
            unique_email = f"{email.split('@')[0]}_{int(datetime.now().timestamp())}@{email.split('@')[1]}"

            registration_data = {
                'email': unique_email,
                'password': 'testpassword123',
                'name': name,
                'role': role
            }

            response = self.client.post('/api/v1/auth/register', json=registration_data)

            if response.status_code == 201:
                user_data = response.json()
                user_id = user_data.get('id')
                self.log_step(f"User Registration ({name})", True, f"User ID: {user_id}")

                # Login to get token
                login_data = {
                    'username': unique_email,
                    'password': 'testpassword123'
                }
                login_response = self.client.post('/api/v1/auth/token', data=login_data)

                if login_response.status_code == 200:
                    token_data = login_response.json()
                    access_token = token_data.get('access_token')
                    self.users[email] = {  # Store with original email key for easy reference
                        'user_id': user_id,
                        'access_token': access_token,
                        'user_data': user_data,
                        'actual_email': unique_email  # Store the actual email used
                    }
                    self.log_step(f"User Login ({name})", True, "Token obtained")
                    return access_token
                else:
                    self.log_step(f"User Login ({name})", False, error=f"Login failed: {login_response.text}")
            else:
                self.log_step(f"User Registration ({name})", False, error=f"Registration failed: {response.text}")

        except Exception as e:
            self.log_step(f"User Registration ({name})", False, error=str(e))

        return None

    def test_authentication_journey(self):
        """Test complete authentication journey"""
        print("\n" + "="*60)
        print("🔐 PHASE 1: AUTHENTICATION JOURNEY")
        print("="*60)

        # Test user registration
        self.log_step("Starting Authentication Journey", True, "Testing user registration and login")

        # Register a regular user
        buyer_token = self.register_user('john.buyer@example.com', 'John Buyer', 'user')

        # Register a host (using user role for now)
        host_token = self.register_user('sarah.host@example.com', 'Sarah Host', 'user')

        # Register a tour operator (using user role for now)
        operator_token = self.register_user('mike.operator@example.com', 'Mike Operator', 'user')

        if buyer_token and host_token and operator_token:
            self.log_step("Authentication Journey", True, "All users registered and logged in successfully")
            return True
        else:
            self.log_step("Authentication Journey", False, "Some user registrations failed")
            return False

    def get_auth_headers(self, email: str) -> Dict:
        """Get authorization headers for a user"""
        if email in self.users:
            return {'Authorization': f'Bearer {self.users[email]["access_token"]}'}
        return {}

    def get_user_id(self, email: str) -> Optional[int]:
        """Get user ID for a user"""
        if email in self.users:
            return self.users[email]["user_id"]
        return None

    def test_user_profile_journey(self):
        """Test user profile management"""
        print("\n" + "="*60)
        print("👤 PHASE 2: USER PROFILE JOURNEY")
        print("="*60)

        success_count = 0

        for email, user_info in self.users.items():
            headers = self.get_auth_headers(email)

            # Test get current user profile
            response = self.client.get('/api/v1/auth/me', headers=headers)

            if response.status_code == 200:
                profile_data = response.json()
                self.log_step(f"Get Profile ({email})", True, f"Profile retrieved: {profile_data.get('name')}")
                success_count += 1
            else:
                self.log_step(f"Get Profile ({email})", False, error=f"Failed to get profile: {response.text}")

        return success_count == len(self.users)

    def test_bnb_listing_creation_journey(self):
        """Test BnB listing creation by host"""
        print("\n" + "="*60)
        print("🏠 PHASE 3: BNB LISTING CREATION JOURNEY")
        print("="*60)

        # Get host user
        host_email = 'sarah.host@example.com'
        headers = self.get_auth_headers(host_email)

        if not headers:
            self.log_step("BnB Listing Creation", False, "No host token available")
            return False

        # Create a BnB listing
        listing_data = {
            'id': 0,
            'host_id': self.users[host_email]['user_id'],
            'title': 'Luxury Safari Lodge',
            'type': 'ENTIRE',
            'capacity': 6,
            'bedrooms': 3,
            'beds': 3,
            'baths': 2.0,
            'nightly_price': 250.00,
            'cleaning_fee': 50.00,
            'address': 'Maasai Mara, Kenya',
            'latitude': -1.4061,
            'longitude': 35.0085,
            'amenities': {'wifi': True, 'pool': True, 'safari_view': True},
            'rules': {'no_smoking': True, 'no_parties': True},
            'cancellation_policy': 'MODERATE',
            'instant_book': True,
            'min_nights': 2,
            'max_nights': 14
        }

        response = self.client.post('/api/v1/bnb/listings', json=listing_data, headers=headers)

        if response.status_code == 200:
            listing_result = response.json()
            listing_id = listing_result.get('id')
            self.listings['bnb_1'] = listing_result
            self.log_step("BnB Listing Creation", True, f"Listing created: {listing_result.get('title')} (ID: {listing_id})")
            return True
        else:
            self.log_step("BnB Listing Creation", False, error=f"Failed to create listing: {response.text}")
            return False

    def test_bnb_browsing_journey(self):
        """Test BnB browsing by buyer"""
        print("\n" + "="*60)
        print("🔍 PHASE 4: BNB BROWSING JOURNEY")
        print("="*60)

        # Test listing browsing (no auth required)
        response = self.client.get('/api/v1/bnb/listings')

        if response.status_code == 200:
            listings = response.json()
            self.log_step("BnB Listing Browse", True, f"Found {len(listings)} listings")
            return True
        else:
            self.log_step("BnB Listing Browse", False, error=f"Failed to browse listings: {response.text}")
            return False

    def test_bnb_booking_journey(self):
        """Test BnB booking by buyer"""
        print("\n" + "="*60)
        print("📅 PHASE 5: BNB BOOKING JOURNEY")
        print("="*60)

        # Get buyer user
        buyer_email = 'john.buyer@example.com'
        headers = self.get_auth_headers(buyer_email)

        if not headers:
            self.log_step("BnB Booking", False, "No buyer token available")
            return False

        # Get listing ID
        if 'bnb_1' not in self.listings:
            self.log_step("BnB Booking", False, "No listing available for booking")
            return False

        listing = self.listings['bnb_1']
        listing_id = listing.get('id')

        # Create booking
        booking_data = {
            'listing_id': listing_id,
            'guest_id': self.users[buyer_email]['user_id'],
            'check_in': '2024-03-15',
            'check_out': '2024-03-20',
            'guests': 4
        }

        response = self.client.post('/api/v1/bnb/bookings', json=booking_data, headers=headers)

        if response.status_code == 200:
            booking_result = response.json()
            booking_id = booking_result.get('id')
            self.bookings['bnb_1'] = booking_result
            self.log_step("BnB Booking Creation", True, f"Booking created (ID: {booking_id})")
            return True
        else:
            self.log_step("BnB Booking Creation", False, error=f"Failed to create booking: {response.text}")
            return False

    def test_reviews_journey(self):
        """Test reviews system"""
        print("\n" + "="*60)
        print("⭐ PHASE 6: REVIEWS JOURNEY")
        print("="*60)

        # Get buyer user
        buyer_email = 'john.buyer@example.com'
        headers = self.get_auth_headers(buyer_email)

        if not headers:
            self.log_step("Reviews Journey", False, "No buyer token available")
            return False

        # Get listing and booking IDs
        if 'bnb_1' not in self.listings or 'bnb_1' not in self.bookings:
            self.log_step("Reviews Journey", False, "No listing or booking available for review")
            return False

        listing = self.listings['bnb_1']
        booking = self.bookings['bnb_1']
        listing_id = listing.get('id')
        booking_id = booking.get('id')

        # Create a review
        review_data = {
            'id': 0,
            'target_type': 'BNB_LISTING',
            'target_id': listing_id,
            'rating': 5,
            'title': 'Amazing Safari Experience!',
            'comment': 'The lodge was perfect for our family safari. Great views, comfortable beds, and the host was very responsive. Highly recommended!',
            'booking_id': booking_id
        }

        response = self.client.post('/api/v1/reviews/', json=review_data, params={'reviewer_id': self.users[buyer_email]['user_id']})

        if response.status_code == 200:
            review_result = response.json()
            review_id = review_result.get('id')
            self.log_step("Review Creation", True, f"Review created: '{review_result.get('title')}' (ID: {review_id})")

            # Test getting reviews for the listing
            response = self.client.get(f'/api/v1/reviews/BNB_LISTING/{listing_id}')
            if response.status_code == 200:
                reviews = response.json()
                self.log_step("Get Reviews", True, f"Retrieved {len(reviews)} reviews for listing")
            else:
                self.log_step("Get Reviews", False, error=f"Failed to get reviews: {response.text}")

            # Test review statistics
            response = self.client.get(f'/api/v1/reviews/BNB_LISTING/{listing_id}/stats')
            if response.status_code == 200:
                stats = response.json()
                self.log_step("Review Statistics", True, f"Avg rating: {stats.get('average_rating')}, Total: {stats.get('total_reviews')}")
            else:
                self.log_step("Review Statistics", False, error=f"Failed to get stats: {response.text}")

            return True
        else:
            self.log_step("Review Creation", False, error=f"Failed to create review: {response.text}")
            return False

    def test_dashboard_journey(self):
        """Test dashboard analytics"""
        print("\n" + "="*60)
        print("📊 PHASE 7: DASHBOARD ANALYTICS JOURNEY")
        print("="*60)

        success_count = 0

        # Test host dashboard
        host_email = 'sarah.host@example.com'
        headers = self.get_auth_headers(host_email)

        if headers:
            response = self.client.get('/api/v1/bnb/host/dashboard', params={'host_id': self.users[host_email]['user_id']})

            if response.status_code == 200:
                dashboard_data = response.json()
                self.log_step("Host Dashboard", True, f"Revenue: ${dashboard_data.get('total_revenue', 0)}")
                success_count += 1
            else:
                self.log_step("Host Dashboard", False, error=f"Failed to get dashboard: {response.text}")

        # Test host earnings
        if headers:
            response = self.client.get('/api/v1/bnb/host/earnings', params={'host_id': self.users[host_email]['user_id'], 'period': 'month'})

            if response.status_code == 200:
                earnings_data = response.json()
                self.log_step("Host Earnings", True, f"Earnings: ${earnings_data.get('total_earnings', 0)}")
                success_count += 1
            else:
                self.log_step("Host Earnings", False, error=f"Failed to get earnings: {response.text}")

        return success_count > 0

    def test_tour_creation_journey(self):
        """Test tour creation by operator"""
        print("\n" + "="*60)
        print("🎯 PHASE 8: TOUR CREATION JOURNEY")
        print("="*60)

        # Get tour operator
        operator_email = 'mike.operator@example.com'
        headers = self.get_auth_headers(operator_email)

        if not headers:
            self.log_step("Tour Creation", False, "No operator token available")
            return False

        # Create a tour
        tour_data = {
            'id': 0,
            'name': 'Maasai Mara Safari Adventure',
            'description': 'Experience the great migration and Maasai culture',
            'price': 299.99,
            'duration_hours': 48,
            'operator_id': self.users[operator_email]['user_id'],
            'max_participants': 8,
            'included_services': ['guide', 'transport', 'meals']
        }

        response = self.client.post('/api/v1/tours/', json=tour_data, headers=headers)

        if response.status_code == 200:
            tour_result = response.json()
            tour_id = tour_result.get('id')
            self.listings['tour_1'] = tour_result
            self.log_step("Tour Creation", True, f"Tour created: {tour_result.get('name')} (ID: {tour_id})")
            return True
        else:
            self.log_step("Tour Creation", False, error=f"Failed to create tour: {response.text}")
            return False

    def run_complete_journey(self):
        """Run the complete MVP user journey test"""
        print("🚀 MVP END-TO-END JOURNEY TESTING")
        print("="*60)
        print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("-" * 60)

        # Phase 1: Authentication
        if not self.test_authentication_journey():
            print("\n❌ Journey stopped at Phase 1: Authentication failed")
            return False

        # Phase 2: User Profiles
        if not self.test_user_profile_journey():
            print("\n❌ Journey stopped at Phase 2: Profile management failed")
            return False

        # Phase 3: BnB Listing Creation
        if not self.test_bnb_listing_creation_journey():
            print("\n❌ Journey stopped at Phase 3: BnB listing creation failed")
            return False

        # Phase 4: BnB Browsing
        if not self.test_bnb_browsing_journey():
            print("\n❌ Journey stopped at Phase 4: BnB browsing failed")
            return False

        # Phase 5: BnB Booking
        if not self.test_bnb_booking_journey():
            print("\n❌ Journey stopped at Phase 5: BnB booking failed")
            return False

        # Phase 6: Reviews
        if not self.test_reviews_journey():
            print("\n❌ Journey stopped at Phase 6: Reviews failed")
            return False

        # Phase 7: Dashboard Analytics
        if not self.test_dashboard_journey():
            print("\n❌ Journey stopped at Phase 7: Dashboard analytics failed")
            return False

        # Phase 8: Tour Creation
        if not self.test_tour_creation_journey():
            print("\n❌ Journey stopped at Phase 8: Tour creation failed")
            return False

        # Final Summary
        print("\n" + "="*60)
        print("🎉 MVP JOURNEY COMPLETE!")
        print("="*60)

        total_steps = len(self.test_results)
        successful_steps = len([r for r in self.test_results if r['success']])

        print(f"✅ Successful Steps: {successful_steps}/{total_steps}")
        print(f"🎯 Success Rate: {(successful_steps/total_steps*100):.1f}%")

        if successful_steps == total_steps:
            print("\n🏆 ALL MVP FEATURES WORKING PERFECTLY!")
            print("Your Super Platform MVP is ready for users!")
        else:
            print(f"\n⚠️  {total_steps - successful_steps} steps need attention")

        return successful_steps == total_steps

def main():
    """Main execution function"""
    try:
        tester = MVPJourneyTester()
        success = tester.run_complete_journey()

        print(f"\n{'🎉 MVP Testing completed successfully!' if success else '⚠️ MVP Testing completed with issues!'}")

        # Show summary of failed steps
        failed_steps = [r for r in tester.test_results if not r['success']]
        if failed_steps:
            print("\n❌ Failed Steps Summary:")
            for step in failed_steps:
                print(f"  • {step['step']}: {step['error']}")

        sys.exit(0 if success else 1)

    except Exception as e:
        print(f"\n❌ MVP Testing failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
