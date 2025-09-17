# BnB Frontend Plan: End-to-End Customer & Host Journeys

## Purpose
Design the complete BnB customer and host experience from discovery to booking and host onboarding, aligned with existing endpoints (`bnb_endpoints.md`) and current UI composition (`frontend/src/Pages/Bnb/Bnb.jsx`).

## Entry & Navigation
- Unified Home → `Bnb.jsx` → Detail → Booking → Dashboard
- Primary routes:
  - `/bnb` (browse/search/featured/nearby)
  - `/bnb/:id` (listing detail + availability + booking modal)
  - `/login`, `/register` (auth)
  - `/account` (user dashboard: bookings)
  - `/host` (host dashboard)
  - `/host/listings/new` and `/host/listings/:id` (create/update)

## User Personas
- Guest: browses, searches, views detail, books stays, manages bookings
- Host: registers as host, creates/updates listings, manages bookings, views earnings
- Admin (out of scope for UI; backend-only)

---

## User Journeys

### 1) Guest Journey: Browse → Search → Detail → Booking → Dashboard
1. Discover (`/bnb`):
   - Hero search (EnhancedBnbSearch) sets criteria → uses `useSearchListings`
   - Featured listings carousel → `useFeaturedListings`
   - Latest listings slider (offset pagination) → `useListings`
   - Nearby listings (if geolocation permitted) → `useNearbyListings`
2. View Detail (`/bnb/:id`):
   - Fetch listing via `useListing(id)`
   - Fetch availability via `useAvailability(id, { start_date, end_date })`
   - Show images, amenities, pricing, availability calendar, booking CTA
3. Book:
   - Booking modal/form (dates, guests) → `useCreateBooking` (POST `/bnb/bookings`)
   - On success: toast + redirect to `/account` (or show inline success)
4. Manage Bookings (`/account`):
   - `useMyBookings` → list upcoming/past
   - Actions: (future) cancel via GET/POST `/bookings/{id}/cancel`

### 2) Host Journey: Become a Host → Create Listing → Manage Bookings → Earnings
1. Register/Login (`/register`, `/login`)
2. Host Onboarding (`/host`):
   - CTA: “Become a host” → guided checklist
   - Fetch host’s listings via GET `/bnb/my-listings` (placeholder host_id from auth)
3. Create/Update Listing:
   - Form maps to `StListingCU` → POST `/bnb/listings` (id=0 create, id>0 update)
   - Manage availability via POST `/bnb/listings/{id}/availability` (future)
   - Manage pricing via POST `/bnb/listings/{id}/pricing` (future)
4. Manage Bookings (`/host/bookings`):
   - GET `/bnb/host/bookings` → Approve/Reject via POST approve/reject
5. Earnings & Payouts:
   - GET `/bnb/host/earnings?period=`
   - GET `/bnb/host/dashboard`
   - GET `/bnb/host/payouts` (future UI)

---

## Epics → Phases → Tasks

### Epic A: Public Discovery & Detail
- Phase A1: BnB Landing Enhancements (current `Bnb.jsx` baseline)
  - [x] Featured listings with `useFeaturedListings`
  - [x] Latest listings slider with `useListings`
  - [x] Nearby listings with `useNearbyListings`
  - [x] Hero search hooked to `useSearchListings`
  - [x] Empty/edge states and skeletons for all sections
  - [x] Track filters in URL params for shareability
- Phase A2: Listing Detail Page (`/bnb/:id`)
  - [x] Create `Pages/Bnb/BnbDetail.jsx`
  - [x] Use `useListing(id)`, `useAvailability(id, range)`
  - [x] Gallery, amenities, pricing, map, availability calendar
  - [x] Include `BnbBookingModal` on detail page

### Epic B: Booking Flow (Guest)
- Phase B1: Booking Modal + Validation
  - [x] Reuse `BnbBookingModal` inside `Bnb.jsx` and detail page
  - [x] Form schema (Yup/Zod): dates, guests within `max_guests`
  - [x] Submit via `useCreateBooking` (POST `/bnb/bookings`)
  - [x] Success UI → CTA to `/account`
- Phase B2: User Dashboard (`/account`)
  - [x] Page scaffold with tabs: Bookings, Profile
  - [x] Bookings: `useMyBookings` list + statuses
  - [x] Cancel flow (wire GET/POST cancel when ready)

### Epic C: Auth
- Phase C1: Auth Integration
  - [x] Wire `/login`, `/register` to existing auth service/hooks
  - [x] Guard `/account`, `/host/*` with ProtectedRoute
  - [x] Token refresh via axios interceptors (already present)

### Epic D: Host Experience
- Phase D1: Host Dashboard (`/host`)
  - [ ] Overview cards (totals via `/host/dashboard`)
  - [ ] Recent bookings (`/host/bookings`)
  - [ ] Quick links to create listing
- Phase D2: Listing Management
  - [ ] List host listings via `/my-listings`
  - [ ] Create/Update listing form mapping to `StListingCU`
  - [ ] Delete GET `/listings/{id}/delete`
  - [ ] Availability (future) + Pricing (future)
- Phase D3: Booking Management
  - [ ] Host bookings list (`/host/bookings`)
  - [ ] Approve/Reject actions
- Phase D4: Earnings
  - [ ] Earnings chart via `/host/earnings?period=`
  - [ ] Payout history via `/host/payouts` (future)

### Epic E: Messaging & Payments (Future)
- Phase E1: Messaging
  - [ ] Booking messages POST/GET
  - [ ] Conversations list
- Phase E2: Payments
  - [ ] Payment intent POST `/bookings/{id}/payment`
  - [ ] Status GET `/bookings/{id}/payment-status`
  - [ ] Refund POST `/bookings/{id}/refund`

---

## Routes → Components → Hooks → Endpoints
- `/bnb` → `Bnb.jsx`
  - Hooks: `useFeaturedListings`, `useListings`, `useNearbyListings`, `useSearchListings`, `useMyBookings`
  - Endpoints: GET featured, GET listings, GET nearby, POST search, GET my-bookings
- `/bnb/:id` → `BnbDetail.jsx`
  - Hooks: `useListing`, `useAvailability`, `useCreateBooking`
  - Endpoints: GET listing, GET availability, POST bookings
- `/account` → `Account.jsx`
  - Hooks: `useMyBookings`
  - Endpoints: GET my-bookings, (future) cancel booking
- `/host` → `HostDashboard.jsx`
  - Hooks: custom `useHostDashboard`, `useHostBookings`, `useHostListings`
  - Endpoints: GET host/dashboard, GET host/bookings, GET my-listings
- `/host/listings/new` and `/host/listings/:id`
  - Hooks: `useHostListings`, `useUpsertListing`
  - Endpoints: POST listings (id=0/create, id>0/update), GET delete

---

## User Stories

### Guest
- As a guest, I can browse featured and latest BnBs so I can discover options quickly.
- As a guest, I can search by location/dates/guests so I can find suitable stays.
- As a guest, I can view listing details and availability so I can choose dates confidently.
- As a guest, I can book a stay and see a confirmation so I can plan my trip.
- As a guest, I can view my bookings in my dashboard so I can manage them later.

### Host
- As a host, I can become a host and create a listing so I can start accepting bookings.
- As a host, I can update my listing details, availability, and pricing so I can optimize revenue.
- As a host, I can view and manage bookings (approve/reject) so I stay in control.
- As a host, I can view earnings and payouts so I understand my performance.

### Technical
- As a developer, I can reuse Litho components and hooks so the UI remains consistent and performant.
- As a developer, I can follow GET/POST-only conventions and DTOs so we’re consistent with backend standards.

---

## Component & UX Notes (Litho Reuse)
- Grids/Carousels: `InteractiveBanners15`, `Portfolio` patterns for cards
- Forms: `Components/Form/Form`
- Buttons: `Components/Button/Buttons`
- Modals: `Components/CustomModal`
- Loading/Error: existing patterns in `Bnb.jsx` (add skeletons)

---

## Tech Tasks Inventory
- Hooks: extend `useBnb.js` with host-related hooks (dashboard, bookings, listings CRUD)
- Services: add host endpoints to `bnbService.js` (approve/reject, dashboard, earnings, payouts)
- Pages: create `BnbDetail.jsx`, `Account.jsx`, `HostDashboard.jsx`, `HostListingsForm.jsx`
- Routing: ensure routes added in router with guards for `/account` and `/host/*`
- State/URL: sync search filters with query params on `/bnb`
- Validation: schemas for booking and listing forms
- Accessibility: ensure modals, forms, carousels follow existing ARIA patterns

---

## Milestones
1) Public discovery + booking (MVP): `/bnb`, `/bnb/:id`, booking modal, `/account`
2) Host onboarding + listing CRUD: `/host`, create/update, host bookings
3) Earnings + payouts + messaging
4) Payments (live integration) + advanced availability/pricing

---

## Success Metrics
- Search-to-detail click-through rate
- Booking conversion rate
- Host onboarding completion rate
- Time-to-first-listing for new hosts
- Page performance (LCP < 2.5s on `/bnb` and detail)
