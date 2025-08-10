## Phase 3 Plan — Short‑Term Rentals (BNB)

Principles: GET/POST only; separation of public (guest) and host scopes; strong validation; idempotent updates; secure payments stubbed first.

### Subphase 3.1 — Core Entities & Migrations
- Tasks
  - Models:
    - `StListing(id, host_id FK users, title, type ENUM[ENTIRE, PRIVATE, SHARED], capacity, bedrooms, beds, baths, nightly_price, cleaning_fee, service_fee, security_deposit, address, lat/long, amenities JSON, rules JSON, cancellation_policy ENUM, instant_book bool, min_nights, max_nights, created_at, updated_at)`
    - `StAvailability(id, listing_id FK, date, is_available, price_override, min_nights_override)`
    - `StBooking(id, guest_id FK, listing_id FK, check_in, check_out, guests, status ENUM[PENDING, CONFIRMED, CANCELED, COMPLETED], amount_total, deposit_amount, currency, created_at, updated_at)`
    - `StMessage(id, booking_id FK, sender_id FK, body, created_at)`
    - `StPayout(id, host_id FK, booking_id FK, amount, currency, status, scheduled_at, paid_at)`
    - `StTaxJurisdiction(id, code, name, rules JSON)` and `StTaxRecord(id, booking_id, amount, breakdown JSON)`
  - Alembic migrations with indexes: (`listing_id,date`), (`host_id`), (`guest_id`), (`status`).

### Subphase 3.2 — Public Guest APIs
- Tasks
  - Router `app/routers/public/bnb.py`:
    - GET `/api/v1/public/bnb` search: params (check_in, check_out, guests, type, price_min/max, amenities[], instant_book, bbox/radius); paginated.
    - GET `/api/v1/public/bnb/{id}` detail: listing data, host summary (masked), aggregated rating placeholder, rules, amenities.
    - GET `/api/v1/public/bnb/{id}/availability` (month view or date range).

### Subphase 3.3 — Booking Flows
- Tasks
  - Router `app/routers/bnb/bookings.py`:
    - POST `/api/v1/bnb/bookings` (create or update by id) — supports Instant Book or Request-To-Book semantics; validate availability and min/max nights.
    - GET `/api/v1/bnb/bookings/{id}/cancel` (policy‑aware cancellation; store refund intent; emit notification).
  - Add domain functions: price quote (base + cleaning/service + tax), deposit calc, availability hold on confirm.
  - Payment integration stub: a provider service interface; simulate authorization and capture; persistence of txn ids.

### Subphase 3.4 — Host Tools
- Tasks
  - Router `app/routers/host/bnb_listings.py`:
    - POST `/api/v1/host/bnb/listings` (id==0 create, id>0 update).
    - GET `/api/v1/host/bnb/listings` (my listings)
    - GET `/api/v1/host/bnb/listings/{id}/delete`
  - Router `app/routers/host/bnb_calendar.py`:
    - POST `/api/v1/host/bnb/calendar` (bulk upsert availability, price overrides)
  - iCal:
    - Import/export helpers (ics parsing/writing); endpoints for tokenized GET to export a listing calendar.

### Subphase 3.5 — Messaging & Notifications
- Tasks
  - Router `app/routers/bnb/messages.py`:
    - GET `/api/v1/bnb/bookings/{id}/messages` (auth parties only)
    - POST `/api/v1/bnb/bookings/{id}/messages` (send)
  - Notification templates: booking created, confirmed, canceled, payout scheduled.

### Subphase 3.6 — Compliance, Taxes, KYC
- Tasks
  - Host KYC requirements (store `kyc_status` on User or dedicated table); block payouts until verified.
  - Tax calc module per jurisdiction and listing location; persist `StTaxRecord` on booking.
  - PII minimization; privacy retention policy for messages.

### Subphase 3.7 — Payouts
- Tasks
  - Payout scheduling job (APScheduler) — after check‑in; aggregate per host; create `StPayout` rows; status lifecycle.
  - Provider adapter placeholder for bank/mobile money disbursements.

### Subphase 3.8 — Tests, Seeding, Limits
- Tasks
  - Integration tests for search, booking, cancellation, calendar updates.
  - Seed sample hosts, listings, availability, bookings.
  - Rate limit booking endpoints and messaging; audit host admin‑like actions.



