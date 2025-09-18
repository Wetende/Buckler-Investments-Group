## BnB Homepage Implementation Plan

### Scope
Implement the BnB homepage using available backend endpoints and existing frontend hooks, reusing Litho components. Focus on featured listings, latest listings, simple search, and navigation to detail pages.

### Verified Endpoints
- POST `/api/v1/bnb/search`
- GET `/api/v1/bnb/listings?limit&offset`
- GET `/api/v1/bnb/listings/featured?limit`
- GET `/api/v1/bnb/listings/{id}`
- GET `/api/v1/bnb/listings/{id}/availability?start_date&end_date`
- (Optional homepage mini-panel when authenticated) GET `/api/v1/bnb/my-bookings`
- (Available, not yet wired) GET `/api/v1/bnb/listings/nearby?latitude&longitude&radius_km&limit`

### Phases & Tasks

#### Phase 1 — Homepage Core (Today)
- [ ] Add hero search form (location, dates, guests) posting to `/bnb/search`
- [ ] Render featured listings carousel via `useFeaturedListings(8)`
- [ ] Render latest listings grid via first page of `useListings`
- [ ] Link listing cards to `/bnb/:id` detail pages
- [ ] Add “View all stays” CTA linking to `/bnb`
- [ ] Add loading and error states for each section

Deliverable: BnB homepage shows featured + latest sections, search form scaffold, correct routing/links.

#### Phase 2 — Enhancements
- [ ] Add nearby listings section using geolocation and `/bnb/listings/nearby`
- [ ] Create `getNearbyListings` service and `useNearbyListings` hook
- [ ] Add small “Your bookings” panel (if authenticated) using `useMyBookings`
- [ ] Improve card data mapping (price formatting, images, badges)

#### Phase 3 — Polish & Performance
- [ ] Add skeleton loaders; refine error toasts
- [ ] Memoize mapped data; lazy-load heavy sections
- [ ] Accessibility checks for carousels and buttons
- [ ] Copy cleanup and mobile spacing updates

### Component/Hook Reuse
- Hooks: `useListings`, `useFeaturedListings`, `useMyBookings` (optional), `searchListings`
- Components: `InfoBannerStyle05` for carousels/grids, existing Buttons, CustomModal (for future booking/search modals)

### Routing
- Homepage: `/bnb`
- Detail: `/bnb/:id`


