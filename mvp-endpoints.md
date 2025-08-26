# MVP Backend Endpoints

This document outlines all required backend endpoints for the MVP, covering **BnB (Airbnb-Style Rentals)** and **Tour Packages** modules. Based on analysis of current implementation and MVP feature requirements from `MVP.md`.

## Current Implementation Status
✅ = Already implemented  
🔶 = Partially implemented  
❌ = Missing/Required for MVP

---

## Authentication & User Management

### Auth Endpoints (✅ Implemented in `/api/v1/shared/auth_routes.py`)
- `POST /api/v1/token` - Login for access token
- `POST /api/v1/refresh` - Refresh access token  
- `POST /api/v1/logout` - Logout user
- `POST /api/v1/revoke` - Revoke refresh token
- `POST /api/v1/password-reset/request` - Request password reset
- `POST /api/v1/password-reset/confirm` - Confirm password reset
- `POST /api/v1/change-password` - Change password

### User Management (✅ Implemented in `/api/v1/shared/user_routes.py`)
- `POST /api/v1/users/` - Create user account
- `GET /api/v1/users/me` - Get current user info
- `GET /api/v1/users/profile` - Get user profile
- `POST /api/v1/users/profile` - Update user profile

---

## BnB (Airbnb-Style Rentals) Module

### Listing Management

#### Public Listing Endpoints
- `POST /api/v1/bnb/search` ✅ - Search available listings
- `GET /api/v1/bnb/listings` ❌ - List all public listings (with pagination)
- `GET /api/v1/bnb/listings/{listing_id}` ❌ - Get listing details
- `GET /api/v1/bnb/listings/{listing_id}/availability` ❌ - Get listing availability calendar
- `GET /api/v1/bnb/listings/featured` ❌ - Get featured listings
- `GET /api/v1/bnb/listings/nearby` ❌ - Get nearby listings by location

#### Host/Admin Listing Management
- `POST /api/v1/bnb/listings` ❌ - Create new listing (host/admin)
- `POST /api/v1/bnb/listings/{listing_id}` ❌ - Update listing (host/admin)
- `GET /api/v1/bnb/listings/{listing_id}/delete` ❌ - Delete listing (host/admin)
- `GET /api/v1/bnb/my-listings` ❌ - Get host's listings
- `POST /api/v1/bnb/listings/{listing_id}/availability` ❌ - Update availability calendar
- `POST /api/v1/bnb/listings/{listing_id}/pricing` ❌ - Update pricing (seasonal/dynamic)

### Booking Management

#### Guest Booking Endpoints  
- `POST /api/v1/bnb/bookings` ✅ - Create booking
- `GET /api/v1/bnb/bookings/{booking_id}` ❌ - Get booking details
- `GET /api/v1/bnb/my-bookings` ❌ - Get user's bookings
- `POST /api/v1/bnb/bookings/{booking_id}/cancel` ❌ - Cancel booking
- `GET /api/v1/bnb/bookings/{booking_id}/cancel` ❌ - Cancel booking (alternative GET)

#### Host Booking Management
- `GET /api/v1/bnb/host/bookings` ❌ - Get host's property bookings
- `POST /api/v1/bnb/bookings/{booking_id}/approve` ❌ - Approve booking (if not instant-book)
- `POST /api/v1/bnb/bookings/{booking_id}/reject` ❌ - Reject booking

### Reviews & Ratings
- `POST /api/v1/bnb/listings/{listing_id}/reviews` ❌ - Create review
- `GET /api/v1/bnb/listings/{listing_id}/reviews` ❌ - Get listing reviews
- `GET /api/v1/bnb/reviews/{review_id}` ❌ - Get review details
- `POST /api/v1/bnb/reviews/{review_id}/response` ❌ - Host response to review

### Payment Integration
- `POST /api/v1/bnb/bookings/{booking_id}/payment` ❌ - Process payment
- `GET /api/v1/bnb/bookings/{booking_id}/payment-status` ❌ - Check payment status
- `POST /api/v1/bnb/bookings/{booking_id}/refund` ❌ - Process refund

### Messaging & Communication  
- `POST /api/v1/bnb/bookings/{booking_id}/messages` ❌ - Send message
- `GET /api/v1/bnb/bookings/{booking_id}/messages` ❌ - Get booking messages
- `GET /api/v1/bnb/conversations` ❌ - Get user's conversations

### Host Dashboard & Analytics
- `GET /api/v1/bnb/host/dashboard` ❌ - Host dashboard stats
- `GET /api/v1/bnb/host/earnings` ❌ - Host earnings summary
- `GET /api/v1/bnb/host/payouts` ❌ - Host payout history

---

## Tour Packages Module

### Tour Management

#### Public Tour Endpoints
- `POST /api/v1/tours/search` ✅ - Search available tours
- `GET /api/v1/tours` ❌ - List all public tours (with pagination)
- `GET /api/v1/tours/{tour_id}` ❌ - Get tour details
- `GET /api/v1/tours/{tour_id}/availability` ❌ - Get tour availability
- `GET /api/v1/tours/featured` ❌ - Get featured tours
- `GET /api/v1/tours/categories` ❌ - Get tour categories
- `GET /api/v1/tours/categories/{category}/tours` ❌ - Get tours by category

#### Operator/Admin Tour Management
- `POST /api/v1/tours` ❌ - Create new tour (operator/admin)
- `POST /api/v1/tours/{tour_id}` ❌ - Update tour (operator/admin)
- `GET /api/v1/tours/{tour_id}/delete` ❌ - Delete tour (operator/admin)
- `GET /api/v1/tours/my-tours` ❌ - Get operator's tours
- `POST /api/v1/tours/{tour_id}/availability` ❌ - Update tour availability
- `POST /api/v1/tours/{tour_id}/pricing` ❌ - Update tour pricing

### Tour Booking Management

#### Customer Booking Endpoints
- `POST /api/v1/tours/bookings` ✅ - Create tour booking
- `GET /api/v1/tours/bookings/{booking_id}` ❌ - Get booking details
- `GET /api/v1/tours/my-bookings` ❌ - Get user's tour bookings
- `POST /api/v1/tours/bookings/{booking_id}/cancel` ❌ - Cancel tour booking
- `GET /api/v1/tours/bookings/{booking_id}/cancel` ❌ - Cancel tour booking (alternative GET)

#### Operator Booking Management
- `GET /api/v1/tours/operator/bookings` ❌ - Get operator's tour bookings
- `POST /api/v1/tours/bookings/{booking_id}/confirm` ❌ - Confirm tour booking
- `POST /api/v1/tours/bookings/{booking_id}/complete` ❌ - Mark tour as completed

### Tour Reviews & Ratings
- `POST /api/v1/tours/{tour_id}/reviews` ❌ - Create tour review
- `GET /api/v1/tours/{tour_id}/reviews` ❌ - Get tour reviews
- `GET /api/v1/tours/reviews/{review_id}` ❌ - Get review details
- `POST /api/v1/tours/reviews/{review_id}/response` ❌ - Operator response to review

### Tour Payment Integration
- `POST /api/v1/tours/bookings/{booking_id}/payment` ❌ - Process tour payment
- `GET /api/v1/tours/bookings/{booking_id}/payment-status` ❌ - Check payment status
- `POST /api/v1/tours/bookings/{booking_id}/refund` ❌ - Process tour refund

### Tour Communication
- `POST /api/v1/tours/bookings/{booking_id}/messages` ❌ - Send message to operator
- `GET /api/v1/tours/bookings/{booking_id}/messages` ❌ - Get booking messages
- `GET /api/v1/tours/conversations` ❌ - Get user's tour conversations

### Operator Dashboard & Analytics
- `GET /api/v1/tours/operator/dashboard` ❌ - Operator dashboard stats
- `GET /api/v1/tours/operator/earnings` ❌ - Operator earnings summary
- `GET /api/v1/tours/operator/payouts` ❌ - Operator payout history

---

## Bundling & Cross-Module Features

### Bundle Management (🔶 Partially Implemented in `/api/v1/bundle/`)
- `POST /api/v1/bundles` ✅ - Create bundle (tours + accommodation)
- `POST /api/v1/bundles/bookings` ✅ - Book bundle
- `GET /api/v1/bundles` ❌ - List available bundles
- `GET /api/v1/bundles/{bundle_id}` ❌ - Get bundle details
- `GET /api/v1/bundles/my-bundles` ❌ - Get user's bundle bookings

### Cross-Platform Search
- `POST /api/v1/search/all` ❌ - Unified search across BnB, Tours, and Cars
- `GET /api/v1/search/suggestions` ❌ - Search suggestions/autocomplete

---

## Media & File Management

### Media Endpoints (✅ Implemented in `/api/v1/shared/media_routes.py`)
- `POST /api/v1/media` ✅ - Upload media files (images/videos)
- `GET /api/v1/media/{media_id}/delete` ✅ - Delete media file

---

## Administrative & Support Features

### Admin Endpoints (✅ Implemented in `/api/v1/shared/admin_routes.py`)
- `GET /api/v1/admin/dashboard/stats` ✅ - Admin dashboard statistics
- `GET /api/v1/admin/users` ✅ - List all users
- `GET /api/v1/admin/users/{user_id}` ✅ - Get user details
- `POST /api/v1/admin/users` ✅ - Create/update user
- `GET /api/v1/admin/users/{user_id}/deactivate` ✅ - Deactivate user

### Settings & Configuration
- `GET /api/v1/admin/settings` ✅ - Get system settings
- `POST /api/v1/admin/settings` ✅ - Update system settings

### GDPR & Data Management
- `GET /api/v1/admin/gdpr/export/{user_id}` ✅ - Export user data
- `GET /api/v1/admin/gdpr/delete/{user_id}` ✅ - Delete user data

---

## Payment Integration Endpoints (Missing - Critical for MVP)

### Payment Processing
- `POST /api/v1/payments/intent` ❌ - Create payment intent
- `POST /api/v1/payments/confirm` ❌ - Confirm payment
- `POST /api/v1/payments/webhook` ❌ - Payment webhook handler
- `GET /api/v1/payments/{payment_id}/status` ❌ - Get payment status

### Payout Management
- `GET /api/v1/payouts` ❌ - Get user payouts
- `POST /api/v1/payouts/request` ❌ - Request payout
- `GET /api/v1/payouts/{payout_id}` ❌ - Get payout details

---

## Notification Endpoints

### Notification Management  
- `GET /api/v1/notifications` ❌ - Get user notifications
- `POST /api/v1/notifications/{notification_id}/read` ❌ - Mark notification as read
- `GET /api/v1/notifications/preferences` ❌ - Get notification preferences
- `POST /api/v1/notifications/preferences` ❌ - Update notification preferences

---

## Health & Monitoring

### System Health (✅ Implemented in `/api/main.py`)
- `GET /health` ✅ - Health check endpoint
- `GET /` ✅ - API root with information

---

## Summary

### Implementation Priority for MVP:

**High Priority (Essential for Launch):**
1. BnB listing CRUD and availability management
2. Tour CRUD and availability management  
3. Reviews & ratings system
4. Payment integration (M-Pesa + Stripe)
5. Basic messaging/communication
6. Dashboard endpoints for hosts/operators

**Medium Priority (Enhance UX):**
7. Advanced search and filtering
8. Notification system
9. Payout management
10. Bundle enhancement

**Low Priority (Post-MVP):**
11. Advanced analytics
12. Cross-platform unified search
13. GDPR enhancements

### Current Coverage:
- **Auth & Users**: ✅ Complete
- **Basic Search & Booking**: ✅ Core implemented
- **Property Listings**: ✅ Complete (for reference)
- **Admin Features**: ✅ Complete
- **Missing Critical**: Reviews, Payments, Availability Management, Messaging, Dashboards

**Total Endpoints**: ~80 required, ~25 implemented (31% complete)
**MVP-Critical Missing**: ~35 endpoints need implementation
