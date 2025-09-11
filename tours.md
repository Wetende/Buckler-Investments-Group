## Tours API Integration Plan (Only Available Endpoints)

### Base
- Base URL: `/api/v1/tours`
- Methods: only GET and POST (mutations via POST; deletes via GET `/{id}/delete`)
- IDs: integers

### Endpoints
- Public listings
  - POST `/search` → List (criteria: `location`, `start_date`, optional `max_price`) ⇒ returns `TourResponse[]`
  - GET `/` → List with pagination (`limit`, `offset`) ⇒ returns `TourResponseDTO[]`
  - GET `/{tour_id}` → Detail ⇒ `TourResponseDTO`
  - GET `/{tour_id}/availability` → Availability by date range (`start_date`, `end_date`) ⇒ `TourAvailabilityItem[]`
  - GET `/featured` → Featured list (`limit`) ⇒ `TourResponseDTO[]`
  - GET `/categories` → Static categories ⇒ `TourCategoryDTO[]`
  - GET `/categories/{category}/tours` → List by category (`limit`, `offset`) ⇒ `TourResponseDTO[]`

- Operator/Admin
  - POST `/` → Create/update `TourCreateUpdateDTO` (id=0 create; id>0 update) ⇒ `TourResponseDTO`
  - GET `/{tour_id}/delete` → Delete ⇒ `{ ok: True, tour_id }`
  - GET `/my-tours` → Operator tours (`operator_id` from auth later) ⇒ `TourResponseDTO[]`
  - POST `/{tour_id}/availability` → Update availability (body: `TourAvailabilityDTO`) ⇒ `{ ok: True }`
  - POST `/{tour_id}/pricing` → Update pricing ⇒ `{ ok: True }`

- Bookings (customer/operator flows)
  - POST `/bookings` → Create booking (`CreateTourBookingRequest`) ⇒ `TourBookingResponse`
  - GET `/bookings/{booking_id}` → Booking detail ⇒ `TourBookingResponseDTO`
  - GET `/my-bookings` → User bookings (`customer_id` temp query) ⇒ `TourBookingResponseDTO[]`
  - POST `/bookings/{booking_id}/cancel` or GET `/bookings/{booking_id}/cancel` ⇒ `{ ok: True }`
  - POST `/bookings/{booking_id}/confirm` ⇒ `{ ok: True }`
  - POST `/bookings/{booking_id}/complete` ⇒ `{ ok: True }`
  - POST `/bookings/{booking_id}/payment` ⇒ `{ ok: True, payment_id }`
  - GET `/bookings/{booking_id}/payment-status` ⇒ `{ booking_id, payment_status, payment_id }`
  - POST `/bookings/{booking_id}/refund` ⇒ `{ ok: True, refund_id }`
  - POST `/bookings/{booking_id}/messages` ⇒ `{ ok: True, message_id }`
  - GET `/bookings/{booking_id}/messages` ⇒ `[{ ...message }]`
  - GET `/conversations` ⇒ `[{ ...conversation }]`
  - Operator analytics: GET `/operator/dashboard`, `/operator/earnings`, `/operator/payouts`

### DTO Snapshots (frontend mapping)
- `TourResponseDTO`: `{ id, title|name, description?, price, currency, duration|duration_hours?, image?, rating?, reviews_count?, operator_id?, max_participants?, created_at, updated_at? }`
- `TourAvailabilityItem`: `{ date, available_spots, price_override? }`
- `CreateTourBookingRequest`: `{ tour_id, customer_id, booking_date, participants }`
- `TourBookingResponseDTO`: `{ id, tour_id, customer_id, booking_date, participants, total_price, currency, status, created_at, updated_at? }`

---

## Frontend Consumption Plan

### Services (existing)
- `frontend/src/api/toursService.js`
  - `searchTours(criteria)` → POST `/tours/search`
  - `listTours(params)` → GET `/tours`
  - `getTour(id)` → GET `/tours/{id}`
  - `getTourAvailability(id, params)` → GET `/tours/{id}/availability`
  - `getFeaturedTours(limit)` → GET `/tours/featured`

Add later (private/auth):
- `createTour(payload)` POST `/tours`
- `deleteTour(id)` GET `/tours/{id}/delete`
- `getMyTours()` GET `/tours/my-tours`
- Booking flows: `createTourBooking`, `getTourBooking`, `getMyTourBookings`, `cancel/confirm/complete/payment/refund/messages`

### Hooks (existing)
- `frontend/src/api/useTours.js`
  - `useTours(filters, pageSize)` → infinite GET list via `limit/offset`
  - `useTour(id)` → detail
  - `useTourAvailability(id, params)` → availability
  - `useFeaturedTours(limit)` → featured
  - `useSearchTours(criteria)` → search

Extend later with mutations/privates for bookings and operator tools.

---

## Pages & Data Wiring

### Entry: `frontend/src/Pages/Tours/Tour.jsx`
- Purpose: Marketing/landing for tours (hero, highlights, carousels).
- Sections → Data
  - Hero slider: GET `/tours/featured` (limit=3) for slide items; fallback to current placeholders
  - Top destinations (InteractiveBanners07): GET `/tours/categories`
  - Interests grid (InteractiveBanners09): GET `/tours/categories` (same data; different presentation)
  - Popular packages (InfoBannerStyle05): GET `/tours/featured` (primary) or GET `/tours` (limit=12)
  - Detail links: `/tours/{id}` hydrate via `useTour(id)`
- Data to hydrate now:
  - Replace `popularpackagedata` with `useFeaturedTours(limit)` mapped to `InfoBannerStyle05` shape
  - Optionally add a search strip posting to `/tours/search` via `useSearchTours(criteria)` and navigate to list
- Components to reuse: `Header`, `InfoBannerStyle05`, `InteractiveBanners*`, `Testimonials`, `BlogClassic`
- Loading/error: Use existing skeletons; show friendly message if API down

Implementation notes:
- Keep presentational components dumb; data via hooks in this page and passed as props to Litho components.
- Respect Litho classnames and spacing; avoid deep fetching in child components.

### Listing: `frontend/src/Pages/Tours/ToursList.jsx`
- Uses `useTours({}, 20)` to render grid with `InfoBannerStyle05`.
- Keep “Load more” using `fetchNextPage` and `hasNextPage`.
- Filters (future): Add category filter powered by GET `/tours/categories` and `/tours/categories/{category}/tours`.

### Detail: `frontend/src/Pages/Tours/TourDetail.jsx`
- Uses `useTour(id)` for core details.
- Uses `useTourAvailability(id, { start_date, end_date })` when date range is present; default to a 7–14 day window.
- Sidebar shows price, currency, and availability summary.

### Bookings (future pages)
- New components/pages (auth required):
  - Booking form (sidebar or modal) posting to POST `/tours/bookings`.
  - My bookings page consuming GET `/tours/my-bookings`.
  - Booking detail page GET `/tours/bookings/{booking_id}`.
  - Actions (cancel/confirm/complete/payment/refund) via POST endpoints.

### Operator (future dashboard)
- Operator tours list: GET `/tours/my-tours`.
- Availability/pricing management: POST `/{tour_id}/availability`, `/{tour_id}/pricing`.
- Analytics widgets: GET `/tours/operator/dashboard`, `/earnings`, `/payouts`.

---

## Mapping API → UI Components
- Info grids/carousels (`InfoBannerStyle05`): map `TourResponseDTO` → `{ img, title, packageprice, days, reviews, link, rating }`
  - `img`: fallback to existing asset if backend lacks images
  - `title`: `title` or `name`
  - `packageprice`: `${price} ${currency}` (prefix with "From " where appropriate)
  - `days`: `duration` or derive from `duration_hours` (e.g., `"{duration_hours} hrs"`)
  - `reviews`/`rating`: placeholders until reviews integration
  - `link`: `/tours/{id}`

## Error & Loading
- Reuse existing skeletons and `MessageBox`.
- For list/detail: show clear error if backend offline.

## Routing
- `/tours` → `ToursList.jsx`
- `/tours/:id` → `TourDetail.jsx`
- `/tours/featured` (optional marketing route) still uses same data.

## Next Steps
1) Wire `Tour.jsx` popular section to `useFeaturedTours(8)`; remove hardcoded `popularpackagedata` (fallback allowed during loading)
2) Optionally map hero slides to `useFeaturedTours(3)` while preserving current placeholders as fallback
3) Add simple search bar on `Tour.jsx` that navigates to `/tours` with query params and triggers `useTours` or `useSearchTours`
4) Add categories filter on `ToursList.jsx` using `/tours/categories`
5) After auth, implement booking service and hooks; add booking UI on `TourDetail.jsx`


