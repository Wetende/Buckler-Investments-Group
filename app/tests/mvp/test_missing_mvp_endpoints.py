"""
Missing MVP Endpoints Analysis

This test identifies exactly which endpoints from mvp-endpoints.md 
are missing and need to be implemented for MVP launch.
"""
import pytest
from fastapi.testclient import TestClient
from datetime import date, timedelta

from api.main import app


class TestMissingMVPEndpoints:
    """Identify missing MVP endpoints that need implementation."""
    
    @pytest.fixture
    def client(self):
        """HTTP client for testing."""
        return TestClient(app)
    
    def test_missing_bnb_crud_endpoints(self, client):
        """Identify missing BnB CRUD endpoints (HIGH PRIORITY)."""
        
        missing_bnb_endpoints = []
        
        # Test critical BnB endpoints from mvp-endpoints.md
        critical_bnb_endpoints = [
            # Public Listing Endpoints
            ("GET", "/api/v1/bnb/listings", "List all public listings"),
            ("GET", "/api/v1/bnb/listings/1", "Get listing details"),  
            ("GET", "/api/v1/bnb/listings/1/availability", "Get listing availability"),
            ("GET", "/api/v1/bnb/listings/featured", "Get featured listings"),
            ("GET", "/api/v1/bnb/listings/nearby", "Get nearby listings"),
            
            # Host/Admin Listing Management  
            ("POST", "/api/v1/bnb/listings", "Create new listing"),
            ("POST", "/api/v1/bnb/listings/1", "Update listing"),
            ("GET", "/api/v1/bnb/listings/1/delete", "Delete listing"),
            ("GET", "/api/v1/bnb/my-listings", "Get host's listings"),
            ("POST", "/api/v1/bnb/listings/1/availability", "Update availability"),
            ("POST", "/api/v1/bnb/listings/1/pricing", "Update pricing"),
            
            # Guest Booking Endpoints
            ("GET", "/api/v1/bnb/bookings/1", "Get booking details"),
            ("GET", "/api/v1/bnb/my-bookings", "Get user's bookings"),
            ("GET", "/api/v1/bnb/bookings/1/cancel", "Cancel booking"),
            
            # Host Booking Management
            ("GET", "/api/v1/bnb/host/bookings", "Get host's bookings"),
            ("POST", "/api/v1/bnb/bookings/1/approve", "Approve booking"),
            ("POST", "/api/v1/bnb/bookings/1/reject", "Reject booking"),
        ]
        
        for method, endpoint, description in critical_bnb_endpoints:
            try:
                if method == "GET":
                    response = client.get(endpoint)
                elif method == "POST":
                    # Use minimal test data
                    response = client.post(endpoint, json={})
                
                if response.status_code == 404:
                    missing_bnb_endpoints.append((method, endpoint, description))
                    
            except Exception as e:
                missing_bnb_endpoints.append((method, endpoint, f"{description} (Error: {e})"))
        
        print(f"\n🏠 MISSING BnB ENDPOINTS ({len(missing_bnb_endpoints)}/{len(critical_bnb_endpoints)}):")
        for method, endpoint, description in missing_bnb_endpoints:
            print(f"   {method} {endpoint} - {description}")
        
        return missing_bnb_endpoints

    def test_missing_tour_crud_endpoints(self, client):
        """Identify missing Tour CRUD endpoints (HIGH PRIORITY)."""
        
        missing_tour_endpoints = []
        
        # Test critical Tour endpoints from mvp-endpoints.md
        critical_tour_endpoints = [
            # Public Tour Endpoints
            ("GET", "/api/v1/tours", "List all tours"),
            ("GET", "/api/v1/tours/1", "Get tour details"),
            ("GET", "/api/v1/tours/1/availability", "Get tour availability"),
            ("GET", "/api/v1/tours/featured", "Get featured tours"),
            ("GET", "/api/v1/tours/categories", "Get tour categories"),
            ("GET", "/api/v1/tours/categories/safari/tours", "Get tours by category"),
            
            # Operator/Admin Tour Management
            ("POST", "/api/v1/tours", "Create new tour"),
            ("POST", "/api/v1/tours/1", "Update tour"),
            ("GET", "/api/v1/tours/1/delete", "Delete tour"),
            ("GET", "/api/v1/tours/my-tours", "Get operator's tours"),
            ("POST", "/api/v1/tours/1/availability", "Update availability"),
            ("POST", "/api/v1/tours/1/pricing", "Update pricing"),
            
            # Customer Booking Endpoints
            ("GET", "/api/v1/tours/bookings/1", "Get booking details"),
            ("GET", "/api/v1/tours/my-bookings", "Get user's bookings"), 
            ("GET", "/api/v1/tours/bookings/1/cancel", "Cancel booking"),
            
            # Operator Booking Management
            ("GET", "/api/v1/tours/operator/bookings", "Get operator's bookings"),
            ("POST", "/api/v1/tours/bookings/1/confirm", "Confirm booking"),
            ("POST", "/api/v1/tours/bookings/1/complete", "Complete tour"),
        ]
        
        for method, endpoint, description in critical_tour_endpoints:
            try:
                if method == "GET":
                    response = client.get(endpoint)
                elif method == "POST":
                    # Use minimal test data
                    response = client.post(endpoint, json={})
                
                if response.status_code == 404:
                    missing_tour_endpoints.append((method, endpoint, description))
                    
            except Exception as e:
                missing_tour_endpoints.append((method, endpoint, f"{description} (Error: {e})"))
        
        print(f"\n🎫 MISSING TOUR ENDPOINTS ({len(missing_tour_endpoints)}/{len(critical_tour_endpoints)}):")
        for method, endpoint, description in missing_tour_endpoints:
            print(f"   {method} {endpoint} - {description}")
        
        return missing_tour_endpoints

    def test_missing_review_system(self, client):
        """Identify missing Review & Rating endpoints (MEDIUM PRIORITY)."""
        
        missing_review_endpoints = []
        
        # Review endpoints from mvp-endpoints.md
        review_endpoints = [
            # BnB Reviews
            ("POST", "/api/v1/bnb/listings/1/reviews", "Create BnB review"),
            ("GET", "/api/v1/bnb/listings/1/reviews", "Get BnB reviews"),
            ("GET", "/api/v1/bnb/reviews/1", "Get review details"),
            ("POST", "/api/v1/bnb/reviews/1/response", "Host response to review"),
            
            # Tour Reviews  
            ("POST", "/api/v1/tours/1/reviews", "Create tour review"),
            ("GET", "/api/v1/tours/1/reviews", "Get tour reviews"),
            ("GET", "/api/v1/tours/reviews/1", "Get review details"),
            ("POST", "/api/v1/tours/reviews/1/response", "Operator response"),
        ]
        
        for method, endpoint, description in review_endpoints:
            try:
                if method == "GET":
                    response = client.get(endpoint)
                elif method == "POST":
                    response = client.post(endpoint, json={"rating": 5, "comment": "test"})
                
                if response.status_code == 404:
                    missing_review_endpoints.append((method, endpoint, description))
                    
            except Exception as e:
                missing_review_endpoints.append((method, endpoint, f"{description} (Error: {e})"))
        
        print(f"\n⭐ MISSING REVIEW ENDPOINTS ({len(missing_review_endpoints)}/{len(review_endpoints)}):")
        for method, endpoint, description in missing_review_endpoints:
            print(f"   {method} {endpoint} - {description}")
        
        return missing_review_endpoints

    def test_missing_payment_system(self, client):
        """Identify missing Payment endpoints (CRITICAL MVP BLOCKER)."""
        
        missing_payment_endpoints = []
        
        # Payment endpoints from mvp-endpoints.md
        payment_endpoints = [
            # Core Payment Processing
            ("POST", "/api/v1/payments/intent", "Create payment intent"),
            ("POST", "/api/v1/payments/confirm", "Confirm payment"),
            ("POST", "/api/v1/payments/webhook", "Payment webhook"),
            ("GET", "/api/v1/payments/1/status", "Get payment status"),
            
            # BnB Payment Integration
            ("POST", "/api/v1/bnb/bookings/1/payment", "Process BnB payment"),
            ("GET", "/api/v1/bnb/bookings/1/payment-status", "Check BnB payment status"),
            ("POST", "/api/v1/bnb/bookings/1/refund", "Process BnB refund"),
            
            # Tour Payment Integration
            ("POST", "/api/v1/tours/bookings/1/payment", "Process tour payment"),
            ("GET", "/api/v1/tours/bookings/1/payment-status", "Check tour payment status"),
            ("POST", "/api/v1/tours/bookings/1/refund", "Process tour refund"),
            
            # Payout Management
            ("GET", "/api/v1/payouts", "Get user payouts"),
            ("POST", "/api/v1/payouts/request", "Request payout"),
            ("GET", "/api/v1/payouts/1", "Get payout details"),
        ]
        
        for method, endpoint, description in payment_endpoints:
            try:
                if method == "GET":
                    response = client.get(endpoint)
                elif method == "POST":
                    response = client.post(endpoint, json={"amount": 1000, "currency": "KES"})
                
                if response.status_code == 404:
                    missing_payment_endpoints.append((method, endpoint, description))
                    
            except Exception as e:
                missing_payment_endpoints.append((method, endpoint, f"{description} (Error: {e})"))
        
        print(f"\n💳 MISSING PAYMENT ENDPOINTS ({len(missing_payment_endpoints)}/{len(payment_endpoints)}):")
        for method, endpoint, description in missing_payment_endpoints:
            print(f"   {method} {endpoint} - {description}")
        
        return missing_payment_endpoints

    def test_missing_messaging_system(self, client):
        """Identify missing Messaging & Communication endpoints (MEDIUM PRIORITY)."""
        
        missing_messaging_endpoints = []
        
        # Messaging endpoints from mvp-endpoints.md
        messaging_endpoints = [
            # BnB Messaging
            ("POST", "/api/v1/bnb/bookings/1/messages", "Send BnB message"),
            ("GET", "/api/v1/bnb/bookings/1/messages", "Get BnB messages"),
            ("GET", "/api/v1/bnb/conversations", "Get BnB conversations"),
            
            # Tour Communication
            ("POST", "/api/v1/tours/bookings/1/messages", "Send tour message"),
            ("GET", "/api/v1/tours/bookings/1/messages", "Get tour messages"),
            ("GET", "/api/v1/tours/conversations", "Get tour conversations"),
        ]
        
        for method, endpoint, description in messaging_endpoints:
            try:
                if method == "GET":
                    response = client.get(endpoint)
                elif method == "POST":
                    response = client.post(endpoint, json={"body": "Test message"})
                
                if response.status_code == 404:
                    missing_messaging_endpoints.append((method, endpoint, description))
                    
            except Exception as e:
                missing_messaging_endpoints.append((method, endpoint, f"{description} (Error: {e})"))
        
        print(f"\n💬 MISSING MESSAGING ENDPOINTS ({len(missing_messaging_endpoints)}/{len(messaging_endpoints)}):")
        for method, endpoint, description in missing_messaging_endpoints:
            print(f"   {method} {endpoint} - {description}")
        
        return missing_messaging_endpoints

    def test_missing_dashboard_analytics(self, client):
        """Identify missing Dashboard & Analytics endpoints (MEDIUM PRIORITY)."""
        
        missing_dashboard_endpoints = []
        
        # Dashboard endpoints from mvp-endpoints.md
        dashboard_endpoints = [
            # BnB Host Dashboard
            ("GET", "/api/v1/bnb/host/dashboard", "BnB host dashboard"),
            ("GET", "/api/v1/bnb/host/earnings", "BnB host earnings"),
            ("GET", "/api/v1/bnb/host/payouts", "BnB host payouts"),
            
            # Tour Operator Dashboard
            ("GET", "/api/v1/tours/operator/dashboard", "Tour operator dashboard"),
            ("GET", "/api/v1/tours/operator/earnings", "Tour operator earnings"),
            ("GET", "/api/v1/tours/operator/payouts", "Tour operator payouts"),
        ]
        
        for method, endpoint, description in dashboard_endpoints:
            try:
                response = client.get(endpoint)
                if response.status_code == 404:
                    missing_dashboard_endpoints.append((method, endpoint, description))
                    
            except Exception as e:
                missing_dashboard_endpoints.append((method, endpoint, f"{description} (Error: {e})"))
        
        print(f"\n📊 MISSING DASHBOARD ENDPOINTS ({len(missing_dashboard_endpoints)}/{len(dashboard_endpoints)}):")
        for method, endpoint, description in missing_dashboard_endpoints:
            print(f"   {method} {endpoint} - {description}")
        
        return missing_dashboard_endpoints

    def test_mvp_implementation_priority_summary(self, client):
        """Generate comprehensive summary of missing MVP endpoints with implementation priorities."""
        
        print("\n" + "="*80)
        print("MVP ENDPOINT IMPLEMENTATION PRIORITY ANALYSIS")
        print("="*80)
        
        # Run all missing endpoint tests
        missing_bnb = self.test_missing_bnb_crud_endpoints(client)
        missing_tours = self.test_missing_tour_crud_endpoints(client)
        missing_reviews = self.test_missing_review_system(client)
        missing_payments = self.test_missing_payment_system(client)
        missing_messaging = self.test_missing_messaging_system(client)
        missing_dashboards = self.test_missing_dashboard_analytics(client)
        
        # Calculate totals
        total_missing = (len(missing_bnb) + len(missing_tours) + len(missing_reviews) + 
                        len(missing_payments) + len(missing_messaging) + len(missing_dashboards))
        
        print(f"\n📋 IMPLEMENTATION SUMMARY:")
        print(f"Total Missing Endpoints: {total_missing}")
        print()
        
        print("🚨 CRITICAL (MVP BLOCKERS):")
        print(f"   💳 Payment System: {len(missing_payments)} endpoints - MUST IMPLEMENT")
        print()
        
        print("🔥 HIGH PRIORITY (Core MVP Features):")
        print(f"   🏠 BnB CRUD Operations: {len(missing_bnb)} endpoints")
        print(f"   🎫 Tour CRUD Operations: {len(missing_tours)} endpoints")
        print()
        
        print("🔶 MEDIUM PRIORITY (MVP Enhancement):")
        print(f"   ⭐ Reviews & Ratings: {len(missing_reviews)} endpoints")
        print(f"   💬 Messaging System: {len(missing_messaging)} endpoints")
        print(f"   📊 Dashboards & Analytics: {len(missing_dashboards)} endpoints")
        print()
        
        print("🎯 RECOMMENDED IMPLEMENTATION ORDER:")
        print("1. Payment System (13 endpoints) - MVP BLOCKER")
        print("2. BnB Core CRUD (17 endpoints) - Core features")
        print("3. Tour Core CRUD (18 endpoints) - Core features")
        print("4. Reviews System (8 endpoints) - User trust & feedback")
        print("5. Messaging System (6 endpoints) - Communication")
        print("6. Dashboards (6 endpoints) - Host/operator tools")
        print()
        
        mvp_completion = (80 - total_missing) / 80 * 100  # Assuming ~80 total MVP endpoints
        print(f"📊 CURRENT MVP COMPLETION: ~{mvp_completion:.1f}%")
        print(f"🚀 LAUNCH READINESS: {'BLOCKED' if len(missing_payments) > 10 else 'PARTIAL'}")
        
        print("="*80)
        
        # Return summary for potential automation
        return {
            "total_missing": total_missing,
            "critical_payment": len(missing_payments),
            "high_priority_bnb": len(missing_bnb), 
            "high_priority_tours": len(missing_tours),
            "medium_reviews": len(missing_reviews),
            "medium_messaging": len(missing_messaging),
            "medium_dashboards": len(missing_dashboards),
            "mvp_completion_percent": mvp_completion
        }

