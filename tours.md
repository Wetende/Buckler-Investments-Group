# Tours API Endpoints & Frontend Implementation Plan

## Complete Tours API Endpoints

Base URL prefix: `/api/v1/tours`

### Public Tours
- GET `/` — List tours (query: `limit` int [1..100], `offset` int >=0)
- GET `/featured` — Featured tours (query: `limit` int [1..50])
- POST `/search` — Search tours (body: `SearchToursRequest`)
- GET `/categories` — Static categories list
- GET `/categories/{category}/tours` — List tours by category (query: `limit`, `offset`)
- GET `/{tour_id}` — Get tour details by id (int)
- GET `/{tour_id}/availability` — Availability (query: `start_date` YYYY-MM-DD, `end_date` YYYY-MM-DD)

### Customer Bookings
- POST `/bookings` — Create booking (body: `TourBookingCreateDTO`, id: 0=create, >0=update)
- GET `/my-bookings` — User's tour bookings (query: `user_id` int; placeholder until auth wiring)
- GET `/bookings/{booking_id}` — Get booking details by id (int)
- GET `/bookings/{booking_id}/cancel` — Cancel booking by id (int)
- POST `/bookings/{booking_id}/modify` — Modify booking (body: `TourBookingModifyDTO`)

### Customer Payments
- POST `/bookings/{booking_id}/payments` — Process payment (body: `PaymentDTO`)
- GET `/bookings/{booking_id}/payments` — List payments for booking
- GET `/bookings/{booking_id}/invoice` — Get invoice for booking

### Customer Messaging
- POST `/bookings/{booking_id}/messages` — Send a message in booking thread
- GET `/bookings/{booking_id}/messages` — List messages for booking
- GET `/conversations` — List tour conversations for current user (query: `user_id` int; placeholder)

### Cross-Domain Endpoints (Tours-related)

#### Bundle/Package Endpoints (`/api/v1/bundles`)
- POST `/` — Create bundle combining tours + accommodation + vehicles
- GET `/` — List bundles (query: `limit`, `offset`, `location`, `min_price`, `max_price`)
- GET `/{bundle_id}` — Get bundle details  
- GET `/my-bundles` — User's bundle bookings (query: `user_id`)
- POST `/bookings` — Create bundle booking (body: `BundleBookingDTO`)

#### Unified Search System (`/api/v1/search`)
- POST `/all` — Cross-domain search (body: `UnifiedSearchDTO`)
- GET `/suggestions` — Search suggestions (query: `query` string, `limit` int)
- GET `/trending` — Trending searches and destinations
- GET `/filters` — Available filter options for search

#### Reviews for Tours (`/api/v1/reviews`)
- GET `/tour/{tour_id}` — List reviews for tour (query: `limit`, `offset`, `sort`)
- POST `/tour` — Create tour review (body: `TourReviewDTO`)
- GET `/tour/{tour_id}/stats` — Review statistics (avg rating, count, distribution)
- GET `/tour/{tour_id}/summary` — Review summary and highlights
- GET `/tour/my-reviews` — User's tour reviews (query: `user_id`)
- POST `/tour/{review_id}/response` — Respond to review (operator only)
- POST `/tour/{review_id}/like` — Like/unlike review
- GET `/tour/{review_id}/replies` — Get review replies/responses
- POST `/tour/{review_id}/flag` — Flag inappropriate review
- GET `/tour/{tour_id}/photos` — User-uploaded photos from reviews

#### Favorites System (`/api/v1/favorites`)
- POST `/` — Add/remove favorite (body: `FavoriteDTO` with `item_type: "tour"`)
- GET `/` — List user favorites (query: `item_type`, `user_id`)
- GET `/tours` — List favorite tours specifically
- GET `/{item_type}/{item_id}/toggle` — Toggle favorite status

---

## Admin-Only Endpoints (Excluded from Customer Frontend)

### Operator Tours
- POST `/` — Create or update tour (body: `TourCreateUpdateDTO`, id: 0=create, >0=update)
- GET `/{tour_id}/delete` — Delete tour by id (int)
- GET `/my-tours` — Operator tours (query: `operator_id` int; placeholder until auth wiring)
- POST `/{tour_id}/availability` — Update availability (body: `TourAvailabilityDTO`)
- POST `/{tour_id}/pricing` — Update pricing (body: `TourPricingDTO`)

### Operator Bookings  
- GET `/bookings` — List all bookings for operator (query: `operator_id`, `status`, `limit`, `offset`)
- POST `/bookings/{booking_id}/confirm` — Confirm booking
- POST `/bookings/{booking_id}/status` — Update booking status (body: `BookingStatusDTO`)

### Operator Analytics
- GET `/analytics/bookings` — Booking analytics (query: `operator_id`, `start_date`, `end_date`)
- GET `/analytics/revenue` — Revenue analytics
- GET `/analytics/performance` — Tour performance metrics

---

## Frontend Routes
- `/tours` — Main tours page (existing Tour.jsx)
- `/tours/search` — Search results page
- `/tours/:id` — Tour detail page
- `/tours/:id/book` — Booking flow
- `/tours/categories/:category` — Category listings
- `/tours/my-bookings` — User booking history

### Homepage Composition (Tours)
- Hero + Smart Search
  - Components: `Form.Input`, `Buttons`
  - Endpoints: `/api/v1/search/suggestions`, `/api/v1/search/trending`, `/api/v1/search/all`
- Featured Tours Carousel
  - Components: `InfoBannerStyle05`
  - Endpoint: `/api/v1/tours/featured`
- Categories & Interests
  - Components: `InteractiveBanners07`, `InteractiveBanners09`
  - Endpoints: `/api/v1/tours/categories`, `/api/v1/tours/categories/{category}/tours`
- Top Rated This Week (badges on cards)
  - Components: badge overlays on `InfoBannerStyle05`
  - Endpoints: `/api/v1/reviews/tour/{tour_id}/stats`
- Bundle Packages (cross-sell)
  - Components: `InfoBannerStyle05`
  - Endpoints: `/api/v1/bundles/`
- Availability Strip (on cards)
  - Components: small indicator overlays
  - Endpoints: `/api/v1/tours/{tour_id}/availability`
- From Travelers (recent reviews)
  - Components: `Testimonials`
  - Endpoints: `/api/v1/reviews/tour/{tour_id}` for featured tours
- My Bookings Teaser (auth-only)
  - Components: compact CTA panel
  - Endpoints: `/api/v1/tours/my-bookings`

---

## Frontend Implementation Plan (6-Phase Approach)

### UX Research Insights
- **Trust Building**: Reviews and ratings critical for trust
- **Social Proof**: User-generated content drives conversions  
- **Urgency**: Availability indicators create booking urgency
- **Discovery**: Multi-path navigation (search, browse, categories)
- **Mobile-First**: 70%+ traffic from mobile devices
- **Personalization**: Authenticated users expect tailored experience

### Phase 1: Foundation & Hero (Week 1)
**Tasks:**
- [x] Enhance existing Tour.jsx with proper API integration
- [x] Implement hero search form with location, dates, category filters
- [x] Integrate unified search (`/api/v1/search/all`) for cross-domain results
- [x] Add search suggestions with autocomplete (`/api/v1/search/suggestions`)
- [x] Create SearchResults component using InfoBannerStyle05
- [x] Add search state management and URL params
- [x] Implement featured tours carousel with booking CTAs
- [x] Add loading states and error handling

**Litho Components:**
- `InfoBannerStyle05` for tour cards
- `CustomModal` for booking overlay
- `Form` components for search
- `Buttons` for CTAs
- `MessageBox` for errors

### Phase 2: Tour Discovery & Categories (Week 2)
**Tasks:**
- [x] Build category browsing with InteractiveBanners07/09
- [x] Implement tour filtering (price, duration, rating)
- [x] Add infinite scroll for tour listings
- [x] Create tour comparison feature
- [x] Add favorites/wishlist functionality (`/api/v1/favorites/` - extend for tours)
- [x] Implement tour sharing capabilities
- [x] Add review integration (`/api/v1/reviews/tour/{tour_id}`)
- [x] Include bundle package discovery (`/api/v1/bundles/`)

**Litho Components:**
- `InteractiveBanners07` for category grid
- `InteractiveBanners09` for interest-based discovery
- `Lists` for filter options
- `Testimonials` for social proof

### Phase 3: Tour Detail & Rich Content (Week 3) ✅ **COMPLETED**
**Tasks:**
- [x] Build comprehensive tour detail page
- [x] Implement image gallery with fullscreen modal
- [x] Add itinerary timeline component
- [x] Create inclusions/exclusions lists
- [x] Add tour guide profiles
- [x] Implement availability calendar (`/api/v1/tours/{tour_id}/availability`)
- [x] Add customer reviews section (`/api/v1/reviews/tour/{tour_id}`)
- [x] Include bundle suggestions (`/api/v1/bundles/` filtered by tour)

**Litho Components:**
- `ImageGallery` for tour photos
- `CustomModal` for photo lightbox
- `Lists` for itinerary details
- `Testimonials` for reviews
- `BlogClassic` for related content

### Phase 4: Booking Flow & Payments (Week 4) ✅ **COMPLETED**
**Tasks:**
- [x] Create multi-step booking form
- [x] Implement date/group size selection
- [x] Add pricing calculator with discounts
- [x] Build payment integration
- [x] Create booking confirmation flow
- [x] Add booking modification capabilities
- [x] Implement cancellation process

**Litho Components:**
- `Form` for booking details
- `ModalPopup` for confirmations
- `Buttons` for actions
- `Lists` for booking summary

### Phase 5: User Account & Bookings (Week 5) ✅ **COMPLETED**
**Tasks:**
- [x] Create user booking dashboard (`/api/v1/tours/my-bookings`)
- [x] Implement booking history with status tracking
- [x] Add booking detail view (`/api/v1/tours/bookings/{booking_id}`)
- [x] Create cancellation flow (`/api/v1/tours/bookings/{booking_id}/cancel`)
- [x] Add rebooking capabilities
- [x] Implement booking reminders
- [x] Add messaging system for tour inquiries (`/api/v1/tours/bookings/{booking_id}/messages`)
- [x] Show user's bundle bookings (`/api/v1/bundles/my-bundles`)

**Litho Components:**
- `Table` for booking history
- `ModalPopup` for booking details
- `Form` for modifications
- `Lists` for booking timeline

### Phase 6: Advanced Features (Week 6) ✅ **COMPLETED**
**Tasks:**
- [x] Add tour recommendations engine (using unified search trends)
- [x] Implement group booking features
- [x] Create bundle package builder (`/api/v1/bundles/`)
- [x] Add weather integration for tours
- [x] Implement live chat for inquiries
- [x] Add tour tracking for active bookings
- [x] Build review moderation tools (flag inappropriate reviews)
- [x] Add advanced search filters (`/api/v1/search/filters`)
- [x] Implement cross-domain search results (`/api/v1/search/all`)

**Litho Components:**
- `InfoBanner` for recommendations
- `CustomModal` for group booking
- `TextSlider` for testimonials
- `Charts` for weather data

---

## Key User Flows

### 1. Discovery Flow
Home → Unified Search → Filter Results → Tour Detail → Book
- **Alternative**: Home → Categories → Browse Tours → Filter → Detail → Book
- **Bundle Flow**: Home → Search → Bundle Packages → Custom Bundle → Book

### 2. Booking Flow  
Tour Detail → Select Date → Add Participants → Review → Payment → Confirmation
- **Bundle Booking**: Bundle Detail → Customize → Select Dates → Review → Payment → Confirmation

### 3. Account Flow
Login → My Bookings → Booking Detail → Modify/Cancel
- **Extended**: My Account → Tours + Bundles + Favorites → Manage

### 4. Support Flow
Tour Detail → Questions → Live Chat → Book with Confidence
- **Review Flow**: Post-Tour → Leave Review → Share Photos → Build Community

### 5. Cross-selling Flow
Tours → Bundle Suggestion → Add Accommodation → Add Vehicle → Complete Package

---

## Technical Implementation Notes

### API Integration Priority
1. **Core Tours**: `/tours/`, `/tours/featured`, `/tours/categories` 
2. **Search**: `/search/all`, `/search/suggestions`, `/search/trending`
3. **Reviews**: `/reviews/tour/{id}`, `/reviews/tour/{id}/stats`
4. **Bundles**: `/bundles/`, `/bundles/{id}`
5. **User Features**: `/tours/my-bookings`, `/favorites/`

### Component Reuse Strategy
- Leverage existing Litho components from TravelAgency theme
- Create minimal custom wrappers for API data integration
- Maintain consistent styling and motion patterns
- Extend InfoBannerStyle05 for various tour card layouts

### Performance Considerations
- Implement React Query for caching and background updates
- Use infinite scroll for tour listings (limit/offset pagination)
- Add skeleton loading states
- Optimize images and lazy-load content
- Cache search suggestions and trending data

### Cross-Domain Integration
- Unified search combines tours, accommodation, and vehicles
- Bundle packages create complete travel experiences
- Shared favorites and review systems
- Consistent user authentication across domains

---

## Success Metrics
- **Conversion Rate**: Tour detail → Booking completion
- **Cross-sell Rate**: Single tour → Bundle package adoption  
- **User Engagement**: Time on tour pages, review completion
- **Search Effectiveness**: Search → Booking conversion
- **Customer Satisfaction**: Review ratings and repeat bookings
