# Frontend Plan (MVP) — Pages and API Integration

This plan enumerates the pages to build and the exact backend APIs each consumes. Conventions follow frontend.md (GET/POST only, int IDs, React Query hooks, Litho reuse). Homepage uses `Pages/Home/Decor.jsx`.

## 1) Home (Decor) — `/`
- Sections and data:
  - Featured Tours: GET `/api/v1/tours/featured?limit=8`
  - Featured Rentals: GET `/api/v1/bnb/listings/featured?limit=8`
  - Recently Listed Properties: GET `/api/v1/property/recently-listed?page_size=8`
  - Trending Searches: GET `/api/v1/search/trending`
  - Unified Search (submit): POST `/api/v1/search/all` (criteria)
  - Suggestions (typeahead): GET `/api/v1/search/suggestions?query=&limit=`

Hooks/services:
- `toursService.getFeaturedTours(limit)`
- `bnbService.getFeaturedListings(limit)`
- `propertyService.getRecentlyListed({ page_size })`
- `searchService.getTrending()`, `searchService.getSuggestions(query, limit)`, `searchService.searchAll(criteria)`

## 2) Authentication
- Routes: `/login`, `/register`, `/forgot-password`, `/reset-password`, `/account`
- APIs:
  - Login: POST `/api/v1/auth/token` (form: username, password)
  - Register: POST `/api/v1/auth/register`
  - Refresh: POST `/api/v1/auth/refresh`
  - Me: GET `/api/v1/auth/me`
  - Password reset request: POST `/api/v1/auth/password-reset/request`
  - Password reset confirm: POST `/api/v1/auth/password-reset/confirm`
  - Change password: POST `/api/v1/auth/change-password`

Hooks/services:
- `authService.login(form)`, `authService.register(data)`, `authService.refresh(token)`, `authService.me()`
- Pages use React Hook Form + Zod; React Query mutations for requests

## 3) Rentals (BnB)
### 3.1 Listings — `/rentals`
- Data sources:
  - Simple pagination: GET `/api/v1/bnb/listings?limit&offset`
  - Advanced search: POST `/api/v1/bnb/search` (criteria)
- Hook examples:
  - `useListings(filters)` → GET list
  - `useSearchListings(criteria)` → POST search

### 3.2 Listing Detail — `/rentals/:id`
- GET `/api/v1/bnb/listings/{id}`
- GET `/api/v1/bnb/listings/{id}/availability?start_date&end_date`
- POST `/api/v1/bnb/bookings` (create booking)
- GET `/api/v1/bnb/my-bookings` (user bookings overview link/section)

Components:
- Gallery (Litho ImageGallery), amenities, price, availability calendar, booking form

## 4) Tours
### 4.1 Catalog — `/tours`
- GET `/api/v1/tours?limit&offset`
- GET `/api/v1/tours/categories` (filters)
- GET `/api/v1/tours/featured?limit` (highlight strip)

### 4.2 Tour Detail — `/tours/:id`
- GET `/api/v1/tours/{id}`
- GET `/api/v1/tours/{id}/availability?start_date&end_date`

## 5) Properties
### 5.1 Explore — `/properties`
- Cursor pagination:
  - GET `/api/v1/property?filters...` → `{ items, cursor, has_more }`
  - Use `useInfiniteQuery` for load more

### 5.2 Detail — `/properties/:id`
- GET `/api/v1/property/{id}`

## 6) Cars
### 6.1 Search — `/cars`
- POST `/api/v1/cars/search`

## 7) Unified Search Surface
- In header and home hero
- POST `/api/v1/search/all`
- GET `/api/v1/search/suggestions?query=&limit=`
- GET `/api/v1/search/filters`

## 8) Payments (UI scaffold only for MVP)
- Prepare UI hooks for initiating payments on bookings; wire when endpoints are finalized.
- Placeholder endpoints (do not hard-fail UI if 501):
  - POST `/api/v1/bnb/bookings/{id}/payment`
  - GET `/api/v1/bnb/bookings/{id}/payment-status`
  - POST `/api/v1/tours/bookings/{id}/payment`
  - GET `/api/v1/tours/bookings/{id}/payment-status`

## 9) Hooks & Services Files
- `frontend/src/api/authService.js`
- `frontend/src/api/bnbService.js`, `frontend/src/api/useBnb.js`
- `frontend/src/api/toursService.js`, `frontend/src/api/useTours.js`
- `frontend/src/api/propertyService.js`, `frontend/src/api/useProperties.js`
- `frontend/src/api/carsService.js`, `frontend/src/api/useCars.js`
- `frontend/src/api/searchService.js`, `frontend/src/api/useSearch.js`

## 10) Pagination & Caching Rules
- BnB/Tours/Cars: limit/offset in query params; React Query `staleTime` ~60s
- Properties: cursor pagination with `useInfiniteQuery`; stop when `has_more=false`
- Cache keys include filters/pagination params; invalidate on mutations

## 11) Build Order (Execution)
1. Home (Decor): featured sections + unified search + suggestions
2. Rentals list/detail/booking (core)
3. Tours list/detail (core)
4. Properties list/detail (explore)
5. Auth flows (login/register/account)
6. Cars page (search)
7. Unified search polish; payments UI scaffold


