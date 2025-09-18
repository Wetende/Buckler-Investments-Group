# BnB (Short-term Rentals) API Endpoints Documentation

## Overview
This document lists all available endpoints for the BnB (Airbnb-style rentals) domain in the Buckler Investments Group super platform. The BnB module handles short-term accommodation bookings, property listings, and host management.

## Base URL
All endpoints are prefixed with `/api/v1/bnb`

## HTTP Methods Convention
- **GET**: Data retrieval and deletion operations
- **POST**: All data mutations (create/update operations)
- **IDs**: All IDs are integers (no UUIDs)
- **Create/Update Pattern**: Use `id: 0` for create, `id > 0` for update

---

## 🏠 Listing Management Endpoints

### Public Listing Endpoints

#### Search Listings
```http
POST /api/v1/bnb/search
```
**Purpose**: Search available listings based on criteria
**Body**: `SearchListingsRequest` DTO
**Response**: `List[ListingResponse]`
**Frontend**: `searchListings(criteria)` in `bnbService.js`

#### List All Listings
```http
GET /api/v1/bnb/listings?limit=20&offset=0
```
**Purpose**: List all public listings with pagination
**Query Params**:
- `limit` (int, 1-100, default: 20)
- `offset` (int, >=0, default: 0)
**Response**: `List[StListingRead]`
**Frontend**: `listListings(params)` in `bnbService.js`

#### Get Featured Listings
```http
GET /api/v1/bnb/listings/featured?limit=10
```
**Purpose**: Get featured listings (high ratings, promoted)
**Query Params**:
- `limit` (int, 1-50, default: 10)
**Response**: `List[StListingRead]`
**Frontend**: `getFeaturedListings(limit)` in `bnbService.js`

#### Get Nearby Listings
```http
GET /api/v1/bnb/listings/nearby?latitude=37.7749&longitude=-122.4194&radius_km=10&limit=20
```
**Purpose**: Get nearby listings by geolocation
**Query Params**:
- `latitude` (float, -90 to 90)
- `longitude` (float, -180 to 180)
- `radius_km` (float, 1-100, default: 10)
- `limit` (int, 1-100, default: 20)
**Response**: `List[StListingRead]`
**Frontend**: `getNearbyListings({latitude, longitude, radius_km, limit})` in `bnbService.js`

#### Get Listing Details
```http
GET /api/v1/bnb/listings/{listing_id}
```
**Purpose**: Get detailed information about a specific listing
**Path Params**: `listing_id` (int)
**Response**: `StListingRead`
**Frontend**: `getListing(id)` in `bnbService.js`

#### Get Listing Availability
```http
GET /api/v1/bnb/listings/{listing_id}/availability?start_date=2024-01-01&end_date=2024-01-31
```
**Purpose**: Get listing availability calendar for date range
**Path Params**: `listing_id` (int)
**Query Params**:
- `start_date` (string, YYYY-MM-DD)
- `end_date` (string, YYYY-MM-DD)
**Response**: `List[AvailabilityItem]`
**Frontend**: `getAvailability(id, params)` in `bnbService.js`

### Host Listing Management

#### Create/Update Listing
```http
POST /api/v1/bnb/listings
```
**Purpose**: Create new listing (id=0) or update existing listing (id>0)
**Body**: `StListingCU` DTO
**Response**: `StListingRead`
**Frontend**: Not implemented in frontend yet

#### Delete Listing
```http
GET /api/v1/bnb/listings/{listing_id}/delete
```
**Purpose**: Delete a listing (following platform GET deletion convention)
**Path Params**: `listing_id` (int)
**Response**: `{"ok": true, "listing_id": int}`
**Frontend**: Not implemented in frontend yet

#### Get Host Listings
```http
GET /api/v1/bnb/my-listings?host_id=1
```
**Purpose**: Get all listings for the authenticated host
**Query Params**: `host_id` (int, from auth context)
**Response**: `List[StListingRead]`
**Frontend**: Not implemented in frontend yet

#### Update Listing Availability
```http
POST /api/v1/bnb/listings/{listing_id}/availability
```
**Purpose**: Update availability calendar for a listing
**Path Params**: `listing_id` (int)
**Body**: `AvailabilityUpsert` DTO
**Response**: `{"ok": true, "message": "Availability updated", "listing_id": int}`
**Status**: TODO - Not fully implemented

#### Update Listing Pricing
```http
POST /api/v1/bnb/listings/{listing_id}/pricing
```
**Purpose**: Update pricing (seasonal/dynamic) for a listing
**Path Params**: `listing_id` (int)
**Body**: Pricing DTO (TODO)
**Response**: `{"ok": true, "message": "Pricing updated", "listing_id": int}`
**Status**: TODO - Not fully implemented

---

## 📅 Booking Management Endpoints

### Guest Booking Endpoints

#### Create Booking
```http
POST /api/v1/bnb/bookings
```
**Purpose**: Create a new booking
**Body**: `CreateBookingRequest` DTO
**Response**: `BookingResponse`
**Frontend**: `createBooking(payload)` in `bnbService.js`

#### Get Booking Details
```http
GET /api/v1/bnb/bookings/{booking_id}
```
**Purpose**: Get detailed information about a specific booking
**Path Params**: `booking_id` (int)
**Response**: `BookingRead`
**Frontend**: `getBooking(id)` in `bnbService.js`

#### Get User Bookings
```http
GET /api/v1/bnb/my-bookings?guest_id=1
```
**Purpose**: Get all bookings for the authenticated user
**Query Params**: `guest_id` (int, from auth context)
**Response**: `List[BookingRead]`
**Frontend**: `listMyBookings()` in `bnbService.js`

#### Cancel Booking (POST)
```http
POST /api/v1/bnb/bookings/{booking_id}/cancel
```
**Purpose**: Cancel a booking (POST method)
**Path Params**: `booking_id` (int)
**Response**: `{"ok": true, "message": "Booking cancelled", "booking_id": int}`
**Frontend**: Not implemented in frontend yet

#### Cancel Booking (GET)
```http
GET /api/v1/bnb/bookings/{booking_id}/cancel
```
**Purpose**: Cancel a booking (GET method alternative)
**Path Params**: `booking_id` (int)
**Response**: `{"ok": true, "message": "Booking cancelled", "booking_id": int}`
**Frontend**: Not implemented in frontend yet

### Host Booking Management

#### Get Host Bookings
```http
GET /api/v1/bnb/host/bookings?host_id=1
```
**Purpose**: Get all bookings for the host's properties
**Query Params**: `host_id` (int, from auth context)
**Response**: `List[BookingRead]`
**Frontend**: Not implemented in frontend yet

#### Approve Booking
```http
POST /api/v1/bnb/bookings/{booking_id}/approve
```
**Purpose**: Approve a booking (if not instant-book)
**Path Params**: `booking_id` (int)
**Response**: `{"ok": true, "message": "Booking approved", "booking_id": int}`
**Frontend**: Not implemented in frontend yet

#### Reject Booking
```http
POST /api/v1/bnb/bookings/{booking_id}/reject
```
**Purpose**: Reject a booking
**Path Params**: `booking_id` (int)
**Response**: `{"ok": true, "message": "Booking rejected", "booking_id": int}`
**Frontend**: Not implemented in frontend yet

### Payment Integration

#### Process Booking Payment
```http
POST /api/v1/bnb/bookings/{booking_id}/payment
```
**Purpose**: Process payment for a booking
**Path Params**: `booking_id` (int)
**Body**: Payment DTO (TODO)
**Response**: `{"ok": true, "message": "Payment processed", "booking_id": int, "payment_id": "mock_payment_123"}`
**Status**: TODO - Mock implementation

#### Get Booking Payment Status
```http
GET /api/v1/bnb/bookings/{booking_id}/payment-status
```
**Purpose**: Check payment status for a booking
**Path Params**: `booking_id` (int)
**Response**: `{"booking_id": int, "payment_status": "completed", "payment_id": "mock_payment_123"}`
**Status**: TODO - Mock implementation

#### Process Booking Refund
```http
POST /api/v1/bnb/bookings/{booking_id}/refund
```
**Purpose**: Process refund for a booking
**Path Params**: `booking_id` (int)
**Body**: Refund DTO (TODO)
**Response**: `{"ok": true, "message": "Refund processed", "booking_id": int, "refund_id": "mock_refund_123"}`
**Status**: TODO - Mock implementation

### Messaging & Communication

#### Send Booking Message
```http
POST /api/v1/bnb/bookings/{booking_id}/messages
```
**Purpose**: Send a message related to a booking
**Path Params**: `booking_id` (int)
**Body**: `MessageCU` DTO
**Response**: `MessageRead`
**Status**: TODO - Mock implementation

#### Get Booking Messages
```http
GET /api/v1/bnb/bookings/{booking_id}/messages
```
**Purpose**: Get all messages for a booking
**Path Params**: `booking_id` (int)
**Response**: `List[MessageRead]`
**Status**: TODO - Mock implementation

#### Get User Conversations
```http
GET /api/v1/bnb/conversations?user_id=1
```
**Purpose**: Get all conversations for the user
**Query Params**: `user_id` (int, from auth context)
**Response**: `List[dict]`
**Status**: TODO - Mock implementation

---

## 📊 Host Analytics & Earnings

#### Get Host Dashboard
```http
GET /api/v1/bnb/host/dashboard?host_id=1
```
**Purpose**: Get host dashboard statistics
**Query Params**: `host_id` (int, from auth context)
**Response**: Dashboard statistics object
**Frontend**: Not implemented in frontend yet

#### Get Host Earnings
```http
GET /api/v1/bnb/host/earnings?host_id=1&period=month
```
**Purpose**: Get host earnings summary
**Query Params**:
- `host_id` (int, from auth context)
- `period` (string: "day", "week", "month", "year", default: "month")
**Response**: Earnings summary object
**Frontend**: Not implemented in frontend yet

#### Get Host Payouts
```http
GET /api/v1/bnb/host/payouts?host_id=1&limit=20&offset=0
```
**Purpose**: Get host payout history
**Query Params**:
- `host_id` (int, from auth context)
- `limit` (int, 1-100, default: 20)
- `offset` (int, >=0, default: 0)
**Response**: `List[dict]`
**Status**: TODO - Not implemented

---

## 🎯 Frontend Implementation Status

### ✅ Fully Implemented in Frontend
- `searchListings(criteria)` - POST /search
- `listListings(params)` - GET /listings
- `getListing(id)` - GET /listings/{id}
- `getAvailability(id, params)` - GET /listings/{id}/availability
- `getFeaturedListings(limit)` - GET /listings/featured
- `getNearbyListings({latitude, longitude, radius_km, limit})` - GET /listings/nearby
- `createBooking(payload)` - POST /bookings
- `getBooking(id)` - GET /bookings/{id}
- `listMyBookings()` - GET /my-bookings

### 🚧 Partially Implemented
- Host management endpoints (backend ready, frontend not implemented)
- Payment integration (mock backend, not connected to frontend)
- Messaging system (mock backend, not connected to frontend)

### 📋 TODO / Not Fully Implemented
- Host dashboard and earnings (backend use cases exist)
- Advanced availability management
- Dynamic pricing management
- Full messaging and conversation system
- Payment processing integration
- Refund processing
- Payout management

---

## 📝 DTO Reference

### SearchListingsRequest
```json
{
  "location": "string",
  "check_in": "2024-01-01",
  "check_out": "2024-01-07",
  "guests": 2,
  "min_price": 0,
  "max_price": 1000,
  "property_type": "string",
  "amenities": ["wifi", "parking"]
}
```

### CreateBookingRequest
```json
{
  "listing_id": 123,
  "check_in": "2024-01-01",
  "check_out": "2024-01-07",
  "guests": 2,
  "total_price": 500.00,
  "guest_id": 456
}
```

### StListingCU (Create/Update)
```json
{
  "id": 0,
  "title": "Beautiful Beach House",
  "description": "Amazing 3BR house with ocean view",
  "price_per_night": 150.00,
  "max_guests": 6,
  "bedrooms": 3,
  "bathrooms": 2,
  "location": "Malibu, CA",
  "latitude": 34.0259,
  "longitude": -118.7798,
  "amenities": ["wifi", "pool", "parking"],
  "images": ["url1.jpg", "url2.jpg"]
}
```

---

## 🔗 Related Files

### Backend
- `app/api/v1/bnb/routes.py` - Main router combining listing and booking routes
- `app/api/v1/bnb/listing_routes.py` - All listing-related endpoints
- `app/api/v1/bnb/booking_routes.py` - All booking-related endpoints
- `app/application/use_cases/bnb/` - 14 use case implementations
- `app/application/dto/bnb/` - Data Transfer Objects

### Frontend
- `frontend/src/api/bnbService.js` - API service functions
- `frontend/src/api/useBnb.js` - React Query hooks (if exists)

---

## 📊 Endpoint Summary

**Total Endpoints**: 28
- **Listing Endpoints**: 12 (7 public, 5 host management)
- **Booking Endpoints**: 13 (5 guest, 3 host, 3 payment, 2 messaging)
- **Analytics Endpoints**: 3 (dashboard, earnings, payouts)

**HTTP Methods Used**:
- **GET**: 17 endpoints (retrieval + deletion)
- **POST**: 11 endpoints (creation + updates)

**Implementation Status**:
- **Backend**: 28/28 implemented (some with TODO/mock status)
- **Frontend**: 9/28 implemented (basic CRUD operations)
- **Fully Functional**: 9/28 (public listing and booking operations)

---

*Last updated: September 14, 2025*

