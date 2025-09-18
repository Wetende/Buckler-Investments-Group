## MVP Frontend Plan — Tours, Car Hire, and BnB (Final)

### Purpose
Ship a usable MVP that lets visitors discover tours and short-stay rentals (BnB) and request car rentals, with basic booking flows and stubbed payments. Focus strictly on public browsing and simple bookings; defer advanced dashboards, complex search, and payments reconciliation to later phases.

### In-Scope Domains
- Tours (list, detail, basic availability view)
- BnB short-stay rentals (list, detail, booking)
- Car hire (vehicle search and rental request)

Out of scope for Day-1: Property marketplace and investment sections (kept as marketing pages only), user dashboards, advanced filters, and content/blog tooling.

---

### User Roles (MVP)
- Visitor (unauthenticated): browse tours and rentals; initiate bookings/rentals; basic contact details provided at booking time.
- Authenticated user (optional for MVP day-1): can create bookings and view "my bookings" when logged in. If login isn’t finished, accept guest email/phone in booking payloads.

Future roles (post-MVP): Host/Operator dashboards, Admin, Finance.

---

### Reference Endpoints (aligned to current backend)

BnB (Short-term rentals)
- GET /api/v1/bnb/listings — list rentals (offset/limit)
- GET /api/v1/bnb/listings/{id} — rental detail
- GET /api/v1/bnb/listings/{id}/availability — availability list
- POST /api/v1/bnb/bookings — create booking (request body CreateBookingRequest)
- GET /api/v1/bnb/bookings/{id} — booking detail
- GET /api/v1/bnb/bookings/{id}/payment-status — payment status (stubbed)
- POST /api/v1/bnb/bookings/{id}/payment — trigger payment (stubbed)

Tours
- GET /api/v1/tours — list tours (offset/limit)
- GET /api/v1/tours/{id} — tour detail
- GET /api/v1/tours/{id}/availability — availability list
- POST /api/v1/tours/bookings — create booking (TourBookingCreateUpdateDTO)
- GET /api/v1/tours/bookings/{id} — booking detail

Cars (hire)
- POST /api/v1/cars/search — vehicle search
- POST /api/v1/cars/rentals — create rental (CreateRentalRequest)

Auth (optional for MVP day-1)
- POST /api/v1/auth/token — login; returns access/refresh
- POST /api/v1/auth/refresh — refresh tokens
- GET /api/v1/auth/me — current user

---

### Existing Frontend Pages/Components to Reuse
- Tours landing: `frontend/src/Pages/Tours/Tour.jsx` (marketing hero/sections)
- Car hire landing: `frontend/src/Pages/Cars/CarHire.jsx` (marketing hero/sections)
- BnB landing: `frontend/src/Pages/Bnb/Bnb.jsx` (marketing hero/sections)
- Lists/Details for data wiring:
  - Rentals list/detail: `frontend/src/Pages/Bnb/RentalsList.jsx`, `frontend/src/Pages/Bnb/RentalDetail.jsx`
  - Tours list/detail: `frontend/src/Pages/Tours/ToursList.jsx`, `frontend/src/Pages/Tours/TourDetail.jsx`
- Hooks/Services already present:
  - BnB: `frontend/src/api/bnbService.js`, `frontend/src/api/useBnb.js`
  - Tours: `frontend/src/api/toursService.js`, `frontend/src/api/useTours.js`
  - Cars: `frontend/src/api/carsService.js`
  - Auth: `frontend/src/api/authService.js`, `frontend/src/api/axios.js`

---

### User Journeys (MVP)

1) Browse BnB rentals and book
- User visits `/bnb` → sees list from GET /bnb/listings (offset/limit via `useListings`).
- Click a card → `/bnb/{id}` detail from GET /bnb/listings/{id}.
- See price and availability (GET /bnb/listings/{id}/availability).
- Click Book → modal with form fields required by CreateBookingRequest:
  - listing_id (hidden), check_in, check_out, guests, guest_email, guest_phone?, special_requests?
- Submit → POST /bnb/bookings; on success, show success UI and optional payment step (call POST /bookings/{id}/payment and/or GET payment-status to demo).

2) Discover tours and (optionally) book
- User visits `/tours` → sees list from GET /tours.
- Click a card → `/tours/{id}` detail and availability (GET /tours/{id}/availability).
- MVP day-1: keep booking CTA visible; booking form wired later in Phase 2 unless time allows to POST /tours/bookings.

3) Car hire inquiry and rental request
- User visits `/cars` (marketing page `CarHire.jsx`).
- MVP day-1: Add a light search widget (pickup date/location, vehicle type) that posts to POST /cars/search; render results in a grid.
- From results, CTA to "Request Rental" → minimal form → POST /cars/rentals.

4) Authentication (optional for MVP day-1)
- If time allows: add login/register using `authService`. Otherwise allow guest bookings by including email/phone fields in booking payloads.

---

### Detailed Phases

Phase 0 — Wiring foundations (0.5h)
- Confirm base URL and axios interceptors (`frontend/src/api/axios.js`).
- Ensure environment variable `REACT_APP_API_BASE_URL` points to backend.
- Verify CORS and health endpoint `/health` reachable.

Phase 1 — BnB Rentals (2h)
- Listings page `/bnb`:
  - Use `useListings` with limit/offset; render via `InfoBannerStyle05` (already done in `RentalsList.jsx`).
  - Add basic filters later; MVP shows default list and Load More.
- Detail page `/bnb/{id}`:
  - Use `useListing` and `useAvailability` (already done in `RentalDetail.jsx`).
  - Replace the current Confirm flow with a proper booking form modal collecting CreateBookingRequest:
    - Fields: check_in (date), check_out (date), guests (int), guest_email, guest_phone (optional), special_requests (optional).
    - Submit to `useCreateBooking` → POST /bnb/bookings.
  - After success: display booking reference; optionally show "Pay Now" to call POST `/bnb/bookings/{id}/payment` and then poll GET `/bnb/bookings/{id}/payment-status` to simulate completion.

Deliverables:
- Booking form component (reusing existing Form/Input styles) mounted inside `CustomModal.Wrapper` on `RentalDetail.jsx`.
- Success UI and light payment trigger (stubbed backend).

Phase 2 — Tours (1.5h)
- Listings page `/tours` via `useTours` (already implemented in `ToursList.jsx`).
- Detail page `/tours/{id}` via `useTour` and `useTourAvailability` (done in `TourDetail.jsx`).
- MVP: Keep CTA and show availability; defer booking form to post-MVP or add a simple modal (same pattern as BnB) if capacity allows:
  - POST /tours/bookings with required DTO fields (tour_id, date/participants as per backend `TourBookingCreateUpdateDTO`).

Phase 3 — Car Hire (1.5h)
- Add a simple search panel (dates, pickup location, vehicle type) to `CarHire.jsx` that calls POST /cars/search and renders a results grid using Litho banner/list components.
- From a result item, open a minimal rental request modal and submit to POST /cars/rentals with `CreateRentalRequest` (name, contact, pickup/return, vehicle_id, notes).

Phase 4 — Auth (optional, 1h buffer)
- Add login/register modals using `authService` (POST /auth/token, /auth/register if available) and persist tokens using provided axios setup.
- If omitted, ensure booking forms include email/phone fields.

Phase 5 — Polish, QA, and Hand-off (1h)
- Copy cleanup, button states, error messages for network errors (map backend `{detail}` where present).
- Accessibility: buttons labeled, alt text on images, focus trapping in modals.
- Performance: React.lazy where heavy, keep lists lightweight.
- Smoke tests: create a rental booking, a tour view flow, car search + rental request.

---

### Minimal UI Additions
- BookingForm (BnB): Reuse `Components/Form/Form` inputs + `CustomModal.Wrapper`.
- CarSearchPanel: Simple form (pickup date/location, type) + results list section on `CarHire.jsx`.
- PaymentButton (stub): Calls POST payment and polls GET payment-status; shows status badge.

---

### Component Implementation Details
- BnB booking form
  - Mount inside `frontend/src/Pages/Bnb/RentalDetail.jsx` within `CustomModal.Wrapper`.
  - Fields (CreateBookingRequest): `listing_id` (Number(id)), `check_in` (YYYY-MM-DD), `check_out` (YYYY-MM-DD), `guests` (int ≥ 1), `guest_email` (string), `guest_phone?` (string), `special_requests?` (string).
  - Validation: `check_in` required; `check_out` > `check_in`; `guests` ≥ 1; valid `guest_email`.
  - Submit: `useCreateBooking().mutate(payload)`; on success capture `bookingId` and show confirmation.
- BnB payment (stub)
  - Show "Pay Now" → POST `/api/v1/bnb/bookings/{bookingId}/payment`.
  - Poll GET `/api/v1/bnb/bookings/{bookingId}/payment-status` every 2000 ms using React Query (`refetchInterval: 2000`) until status is `completed` or `failed`.
  - Display status badge (processing/completed/failed) and stop polling on terminal state.
- Tours (optional Day‑1)
  - Same pattern as BnB; DTO: `TourBookingCreateUpdateDTO` (e.g., `tour_id`, `start_date/booking_date`, `participants`, `guest_email`, `guest_phone?`, `special_requests?`).
  - Wire in `frontend/src/Pages/Tours/TourDetail.jsx` with a modal when ready.
- Cars
  - Add a search panel to `frontend/src/Pages/Cars/CarHire.jsx` → POST `/api/v1/cars/search` and render results (use Litho banners/grids).
  - Minimal rental request modal → POST `/api/v1/cars/rentals` with `vehicle_id`, pickup/return, and contact fields.
- Auth
  - Endpoints: `/api/v1/auth/token`, `/api/v1/auth/register`, `/api/v1/auth/refresh`, `/api/v1/auth/me`.
  - Use `frontend/src/api/axios.js` interceptors to attach/refresh tokens.

---

### Phase Deliverables Checklist (Day‑1)
- Phase 0: Axios base URL and interceptors set; React Query client configured; `/health` reachable.
- Phase 1 (BnB): BnB list/detail render; booking form submits (validates DTO) and returns ID; payment mock button + status polling works.
- Phase 2 (Tours): Tours list/detail render; booking modal prepared or CTA stub (booking optional Day‑1).
- Phase 3 (Cars): Search panel returns results; rental request submits successfully.
- Phase 4 (Auth, optional): Login/register flows working; tokens persisted and `me` fetch succeeds.
- Phase 5: QA pass for copy, loading/error states, accessibility basics (focus in modals, ARIA on buttons).

---

### Data Contracts to Respect
- BnB CreateBookingRequest:
  - listing_id: int
  - check_in: date (YYYY-MM-DD)
  - check_out: date (YYYY-MM-DD)
  - guests: int
  - guest_email: string
  - guest_phone?: string
  - special_requests?: string
- Cars CreateRentalRequest: follow backend DTO (pickup/return, vehicle_id, contact fields). Keep optional notes.
- Tours booking DTO: follow `TourBookingCreateUpdateDTO` (tour_id, date(s), participants, contact fields).
- IDs are integers; GET/POST only (no PUT/PATCH/DELETE).

---

### Navigation & Routes
- `/bnb` → bnb list; `/bnb/:id` → detail + booking modal.
- `/tours` → tours list; `/tours/:id` → detail (booking optional in Phase 2).
- `/cars` → marketing + search + rental request modal.

---

### Success Criteria (Day-1)
- BnB: list/detail functional; booking form submits to backend and returns an ID. Optional stubbed payment trigger works.
- Tours: list/detail functional. Optional basic booking if time remains.
- Car hire: search runs and returns data; rental request submits.
- Pages reuse Litho components and maintain consistent styles.

---

### Risks & Mitigations
- Payment endpoints stubbed: communicate clearly in UI that payment is mocked; hide in production flag.
- Auth not finalized: collect email/phone on forms; upgrade later to use JWT and user profiles.
- Data shape drift: keep forms tolerant; show backend `{detail}` on error.

---

### Post-MVP Backlog
- Full user accounts: registration, profile, view my bookings/rentals.
- Advanced filters (price range, location, amenities) and map views.
- Operators/hosts dashboards with availability/pricing editors.
- Real payment providers (M-Pesa, cards) and reconciliations.
- Notifications, receipts, invoices.


