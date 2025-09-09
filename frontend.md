# Buckler Investment Group – Frontend Specification

This document defines the complete frontend requirements, how the frontend communicates with the backend, screens/UX, and standards to follow. It is derived from the implemented backend (FastAPI) and MVP priorities in `MVP.md`.

## 1. Architecture & Conventions

- Framework: React 18 (TypeScript recommended for new modules), with React Router.
- Styling: Tailwind CSS (preferred) + component library where needed.
- Data fetching: React Query for caching, retries, and background refresh.
- State: Local component state + lightweight global state per domain (React Context or Zustand) if needed.
- Forms: React Hook Form + Zod/Yup for validation.
- i18n: English (default), Swahili (planned toggle).
- Performance: Code-splitting, lazy routes, image optimization, memoization, PWA (installable) on mobile.

### 1.1 API Communication Standards
- Base URL: `/api/v1`
- Auth: Bearer JWT in `Authorization` header; refresh token via `/auth/refresh`.
- HTTP methods (backend rule): only GET and POST.
  - Create/Update: POST with `id=0` for create and `id>0` to update.
  - Retrieve/Delete: GET (delete uses `/.../{id}/delete`).
- IDs: All IDs are integers.
- Request/Response: JSON. Pydantic DTOs validate inputs/outputs.
- Errors: Use HTTP status codes (400/401/403/404) with `{ detail: string }`. Frontend must show actionable toasts/messages.

### 1.2 Authentication Tokens
- Login returns `{ access_token, token_type, expires_in, refresh_token }`.
- Store tokens in memory + localStorage (refresh only) with rotation.
- Auto-refresh access token on 401 using `/auth/refresh`.
- Logout clears tokens and server-side session where applicable.

### 1.3 React Query Defaults
- `staleTime`: 60s (list pages), 5m (detail pages).
- `retry`: 1 for 4xx, 3 for 5xx.
- `refetchOnWindowFocus`: false.
- Cache keys must include filters/pagination params.

## General Frontend Plan (Decor Home)

- Homepage uses `Pages/Home/Decor.jsx` at route `/`.
  - Primary surfaces: unified search, category cards (BnB, Tours, Properties, Cars), featured tours, featured rentals, recently listed properties, trending searches.
  - Data endpoints:
    - GET `/api/v1/tours/featured?limit=8`
    - GET `/api/v1/bnb/listings/featured?limit=8`
    - GET `/api/v1/property/recently-listed?page_size=8`
    - GET `/api/v1/search/trending`

- Required routes (MVP):
  - Auth: `/login`, `/register`, `/forgot-password`, `/reset-password`, `/account`
    - POST `/auth/token`, `/auth/register`, `/auth/refresh`; GET `/auth/me`
  - Rentals (BnB): `/rentals` (list/search), `/rentals/:id` (detail + availability + booking)
    - GET `/bnb/listings?limit&offset` or POST `/bnb/search`
    - GET `/bnb/listings/{id}`, GET `/bnb/listings/{id}/availability?start_date&end_date`
    - POST `/bnb/bookings`, GET `/bnb/my-bookings`
  - Tours: `/tours` (list), `/tours/:id` (detail + availability)
    - GET `/tours?limit&offset`, GET `/tours/{id}`, GET `/tours/{id}/availability?start_date&end_date`
    - GET `/tours/featured`, GET `/tours/categories`
  - Properties: `/properties` (cursor list), `/properties/:id` (detail)
    - GET `/property?filters...` (returns `{ items, has_more, cursor }`)
    - GET `/property/{id}`
  - Cars: `/cars` (search/results)
    - POST `/cars/search`
  - Unified Search: surface in header/home
    - POST `/search/all`, GET `/search/suggestions?query=`, GET `/search/filters`

- Data layer & hooks:
  - Services in `frontend/src/api/*Service.js`; hooks in `frontend/src/api/use*.js`.
  - Respect pagination types: limit/offset (bnb/tours/cars) vs cursor (properties).

- Build order (MVP): Home (Decor) → Rentals core → Tours core → Properties discovery → Auth → Cars → Unified search. Payments UI scaffold only until endpoints are live.

---

## 2. Backend Endpoint Map (Contracts Summary)

Below is the canonical map for the main domains used by the frontend. All endpoints live under `/api/v1`.

### 2.1 Shared – Authentication & Users (prefix `/auth`)
- POST `/auth/token`: Form-encoded OAuth2 login. Returns JWT + refresh.
- POST `/auth/refresh`: Refresh access token using refresh token.
- POST `/auth/logout`: Invalidate client session (decode access token on server).
- POST `/auth/register`: Create user (email, password, name, phone, role optional).
- POST `/auth/password-reset/request` → trigger email.
- POST `/auth/password-reset/confirm` → confirm new password.
- POST `/auth/change-password` (Bearer): change current user's password.
- GET `/auth/me` (Bearer): current user profile DTO.

Notes: Email/phone verification and social-login routes are placeholders (501/ready to implement) and should be feature-flagged.

### 2.2 Short-term Rentals – BnB (prefix `/bnb`)
- POST `/bnb/search`: Search listings (criteria in DTO) → `ListingResponse[]`.
- GET `/bnb/listings?limit&offset`: Paginated list → `StListingRead[]`.
- GET `/bnb/listings/{id}`: Listing detail → `StListingRead`.
- GET `/bnb/listings/{id}/availability?start_date&end_date`: Availability array.
- GET `/bnb/listings/featured?limit`: Featured listings.
- GET `/bnb/listings/nearby?latitude&longitude&radius_km&limit`: Nearby listings (placeholder logic).
- POST `/bnb/listings`: Create/update listing → `StListingRead` (id rule applies).
- GET `/bnb/listings/{id}/delete`: Delete listing.
- GET `/bnb/my-listings`: Host listings (host_id placeholder via query until auth wiring).
- POST `/bnb/listings/{id}/availability`: Upsert availability (placeholder).
- POST `/bnb/listings/{id}/pricing`: Update pricing (placeholder).

Bookings:
- POST `/bnb/bookings`: Create booking → `BookingResponse`.
- GET `/bnb/bookings/{id}`: Booking detail → `BookingRead`.
- GET `/bnb/my-bookings`: Current user bookings (guest_id placeholder).
- POST or GET `/bnb/bookings/{id}/cancel`: Cancel booking.
- POST `/bnb/bookings/{id}/approve|reject`: Host actions.
- POST `/bnb/bookings/{id}/payment`: Process payment (placeholder).
- GET `/bnb/bookings/{id}/payment-status`: Payment status (placeholder).
- POST `/bnb/bookings/{id}/messages` / GET `/bnb/bookings/{id}/messages`: Booking messages (placeholder).
- GET `/bnb/host/bookings`, `/bnb/host/dashboard`, `/bnb/host/earnings`, `/bnb/host/payouts`: Host admin analytics/history.

### 2.3 Tours (prefix `/tours`)
- POST `/tours/search`: Search tours → `TourResponse[]`.
- GET `/tours?limit&offset`: List tours → `TourResponseDTO[]`.
- GET `/tours/{id}`: Tour detail → `TourResponseDTO`.
- GET `/tours/{id}/availability?start_date&end_date`: Availability array.
- GET `/tours/featured?limit`: Featured tours.
- GET `/tours/categories`: Static categories list.
- GET `/tours/categories/{category}/tours?limit&offset`: Tours filtered by category (placeholder).
- POST `/tours/` + id rule: Create/update tour.
- GET `/tours/{id}/delete`: Delete tour.
- GET `/tours/my-tours`: Operator tours (operator_id placeholder).
- POST `/tours/{id}/availability` / `/pricing`: Placeholders for management.

### 2.4 Properties (prefix `/property`)
- POST `/property/search`: Use-case search → list (DTO-based).
- GET `/property?filters...`: Paginated property list → `PaginatedPropertyResponse` with `cursor`, `has_more`.
- GET `/property/{id}`: Property detail.
- GET `/property/recently-listed?cursor&page_size`: Recently listed properties.

### 2.5 Cars (prefix `/cars`)
- POST `/cars/search`: Search vehicles → `VehicleResponse[]`.
- POST `/cars/rentals`: Create rental → `RentalResponse`.

### 2.6 Search (prefix `/search`)
- POST `/search/all?query&filters...`: Unified search across domains (placeholder returns structured mock data).
- GET `/search/suggestions?query&limit`: Autocomplete suggestions (placeholder).
- GET `/search/trending`: Trending terms/destinations (placeholder).
- GET `/search/filters`: Available filters (static meta, includes KES ranges).

---

## 3. Frontend API Client Patterns

### 3.1 HTTP Client
- Use `fetch` or `axios` with a base instance.
- Attach `Authorization: Bearer <access_token>` when logged in.
- Interceptor: on 401, attempt refresh via `/auth/refresh`; update token and retry once.
- Timeouts: 15s default; show toast on network failure.

### 3.2 Data Models (Selected)
- Mirror DTO shapes from backend responses for type safety in components/hooks.
- Prefer `model.fromApi` mappers if the UI uses derived or renamed fields.

### 3.3 Pagination Standards
- BnB/Tours/Cars use `limit/offset` patterns.
- Properties use cursor pagination; client must persist last cursor and append results; when `has_more=false` stop fetching.

### 3.4 Error Handling
- Map HTTP status codes:
  - 400: validation issues → inline form errors.
  - 401: token invalid/expired → refresh, if still 401 → sign-out and redirect to login.
  - 403: show "insufficient permissions" message.
  - 404: not found → show friendly empty state.
- Show toast notifications for critical failures and confirmations.

### 3.5 Caching & Revalidation
- Cache lists keyed by filters.
- Invalidate relevant caches after create/update/delete.
- Background revalidation on tab focus can be disabled by default; add explicit refresh controls on dashboards.

---

## 4. UX Flows & Screens

### 4.1 Homepage (Hero + Discovery)
- Hero: "Your East African Lifestyle Marketplace"; CTA search.
- Unified Search Bar: free-text + location + date range + guests.
- Category Cards: Short‑term Rentals, Tours, Property Listings, Cars.
- Featured Sections:
  - Featured Tours (GET `/tours/featured?limit=8`).
  - Featured Rentals (GET `/bnb/listings/featured?limit=8`).
  - Recently Listed Properties (GET `/property/recently-listed?page_size=8`).
- Popular Destinations: From `/search/trending` (destinations subset).
- Trust/Payments: M-Pesa, Cards, Secure Checkout badges.
- Reviews Highlight: pull top-rated items (once review system is ready).
- Newsletter Signup (marketing module).

Data Dependencies:
- `/search/trending`
- `/tours/featured`
- `/bnb/listings/featured`
- `/property/recently-listed`

### 4.2 Authentication
- Register, Login, Forgot Password, Reset, Change Password.
- User Profile page using `GET /auth/me`.
- Token storage and refresh logic as described in §1.2.

### 4.3 Short‑term Rentals
- Listings Index: filters (location, dates, guests, price range, amenities), list + map view.
  - Data: `POST /bnb/search` for complex queries or `GET /bnb/listings` for simple pagination.
- Listing Detail: gallery, amenities, rules, price, calendar (availability from `/bnb/listings/{id}/availability`).
- Booking Flow:
  1) Select dates/guests.
  2) Create booking `POST /bnb/bookings`.
  3) Payment initiation (placeholder endpoints); M-Pesa STK push UI (to be wired when payments ready).
  4) Confirmation page; email/SMS notifications.
- User Bookings: `GET /bnb/my-bookings`.
- Host Dashboard: `GET /bnb/host/dashboard`, `GET /bnb/host/earnings`, plus bookings, payouts.

### 4.4 Tours
- Catalog: categories (GET `/tours/categories`), featured tours, filters (date, price, category).
- Detail: itinerary, availability calendar (`/tours/{id}/availability`).
- Booking: aligned with BnB flow (create booking endpoint for tours lives in tours-booking router; when available).

### 4.5 Properties
- Explore: cursor-paginated list (`GET /property` with filters; client handles cursors).
- Detail: price KES & derived USD, images, details (`GET /property/{id}`).
- Search: `POST /property/search` for advanced queries.

### 4.6 Cars
- Search Vehicles: `POST /cars/search`.
- Create Rental: `POST /cars/rentals`.

### 4.7 Unified Search
- Single search UI calling `POST /search/all` with category filters.
- Suggestions: `GET /search/suggestions?query=` for autocomplete.

---

## 5. Component/Route Structure (Client)

- `/` Home
- `/login`, `/register`, `/forgot-password`, `/reset-password`
- `/account` (profile, bookings, messages)
- `/rentals` (list + filters + map)
- `/rentals/:id` (detail + availability + booking)
- `/tours` (list)
- `/tours/:id` (detail + availability + booking)
- `/properties` (list)
- `/properties/:id` (detail)
- `/cars` (search)

Shared UI:
- Layout (header with auth state, language/currency, footer)
- Search bar (unified)
- Toast/Modal system

---

## 6. Security & Compliance
- Always send HTTPS; secure cookies if used; CSRF not required for pure token flows.
- Validate Kenyan phone format client-side for M-Pesa flows.
- Input validation with schemas; sanitize user-provided HTML (if any) before render.
- Respect rate limits and backoff on repeated failures.

---

## 7. MVP Alignment (from `MVP.md`)

Highest impact areas to complete first:
- Short‑term rentals core: listings, detail, availability, booking, user bookings.
- Tours core: list, detail, categories, availability.
- Properties discovery: paginated lists, detail, recently listed.
- Payments (critical): wire UI now; integrate M-Pesa/Stripe when backend endpoints are live.
- Unified search surface on the homepage.

Out of scope for initial MVP UI (stubs/flags):
- Social login, phone/email verification (placeholders exist).
- Messaging center, payouts history (placeholder endpoints).
- Advanced analytics (basic host dashboard charts only initially).

---

## 8. Implementation Notes

- Errors: map backend `detail` to friendly copy; show field errors near inputs.
- Loading states: skeletons on list/detail; disable actions while submitting.
- Accessibility: focus management, keyboard navigation, alt text on images.
- Mobile-first: sticky bottom nav for primary actions.
- Observability: basic client logging for API failures (console in dev; hook for Sentry later).

---

## 9. Example Backend Contracts (Selected)

Auth
- Login: POST `/api/v1/auth/token` (form-data: username, password)
- Refresh: POST `/api/v1/auth/refresh` (JSON: { refresh_token })
- Me: GET `/api/v1/auth/me` (Bearer)

BnB
- Search: POST `/api/v1/bnb/search`
- List: GET `/api/v1/bnb/listings?limit&offset`
- Detail: GET `/api/v1/bnb/listings/{id}`
- Availability: GET `/api/v1/bnb/listings/{id}/availability?start_date&end_date`
- Booking: POST `/api/v1/bnb/bookings`

Properties
- List: GET `/api/v1/property?filters...` (cursor + has_more)
- Detail: GET `/api/v1/property/{id}`

Tours
- List: GET `/api/v1/tours`
- Detail: GET `/api/v1/tours/{id}`

Cars
- Search: POST `/api/v1/cars/search`

Search
- Unified: POST `/api/v1/search/all`

---

## 10. Deliverables & Definition of Done

- Navigable React app with routes listed in §5.
- Home populated with featured sections and unified search.
- Rentals/Tours/Properties/Cars pages wired to live endpoints with filters and pagination patterns.
- Auth flows complete with token refresh and profile fetch.
- Error/loading/empty states implemented.
- Mobile responsive; Lighthouse performance > 80 on core pages.
- Environment-configurable API base URL.

---

Appendix A: Environment
- `VITE_API_BASE_URL` or `REACT_APP_API_BASE_URL` depending on toolchain.
- Feature flags for placeholders: `ENABLE_SOCIAL_LOGIN`, `ENABLE_MESSAGING`, `ENABLE_PAYMENTS` (UI only until backend complete).

Appendix B: Future Enhancements
- Reviews & ratings UI once endpoints are implemented.
- Messaging center UI.
- Operator/host self-serve onboarding flows.
