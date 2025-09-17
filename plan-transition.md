Dashboards Transition Plan (Litho → Dashlite)

Objective
- Consolidate all dashboard and data-ops experiences in Dashlite.
- Keep Litho focused on public discovery and booking flows.

Guiding Rule
- If it’s “dashboard-like” (tables, analytics, approvals, CRUD consoles), it belongs in Dashlite.
- Litho links to Dashlite; Dashlite links back to Litho with a return_to when useful.

Scope Focus: BnB and Tours

BNB – Litho (keep)
- Pages
  - frontend/src/Pages/Bnb/Bnb.jsx (landing)
  - frontend/src/Pages/Bnb/BnbList.jsx (public list)
  - frontend/src/Pages/Bnb/BnbDetail.jsx (public detail)
  - frontend/src/Pages/Bnb/BookingConfirmation.jsx (public confirmation)
- Components/UX: Keep all customer-facing sections, filters, galleries, booking forms.

BNB – Admin (move/create)
- Inventory Management: listings table, create/update listing forms, photos/media management.
- Pricing & Availability: calendar management, seasonal pricing, blackout dates.
- Bookings Management: bookings table; approve/decline; refunds/cancellations; messages.
- Payouts & Finance: payouts list; earnings; settlements; statements.
- Reviews Moderation: flagging, takedown, response management.
- Analytics: occupancy, ADR, RevPAR, revenue by period, top listings.
- KYC/Host Onboarding: host verification workflows.
- Suggested Dashlite pages to use/extend
  - Tables (table-basic, table-datatable, table-special)
  - Pre-built products (as a basis for listings)
  - KYC pages (kyc-list-regular, kyc-details-regular)
  - PricingTable (for plan/commission configurations)
  - File Manager (media)
  - Widgets/Charts (analytics)

TOURS – Litho (keep)
- Pages
  - frontend/src/Pages/Tours/ToursList.jsx (public list)
  - frontend/src/Pages/Tours/TourDetail.jsx (public detail)
  - frontend/src/Pages/Tours/BookingDetail.jsx (public booking confirmation/detail)
  - frontend/src/Pages/Tours/Tour.jsx (landing)
  - frontend/src/Pages/Tours/MyBookings.jsx (user-facing bookings)

TOURS – Admin (move/create)
- Product Management: tour products table; create/update; itinerary content; media.
- Scheduling: departure dates, capacity, availability.
- Bookings Management: approvals, rescheduling, cancellations, refunds.
- Vendors/Guides: onboarding and assignment.
- Promotions & Pricing: coupons, seasonal discounts.
- Analytics: bookings over time, utilization, revenue by tour/vendor.

Cross-cutting Admin Features
- Global Search across domains (properties, bnb, tours, cars).
- Unified Messaging/Inbox for bookings.
- Notifications: email/SMS templates and logs.
- Access Control (role-based), Auditing.

Concrete Tasks & Files
1) Add Admin menu entries (Dashlite) for BnB & Tours
   - admin/src/layout/sidebar/MenuData.jsx → add sections: “BnB Management”, “Tours Management”.
2) Create CRUD views (Dashlite)
   - Listings: list/create/edit pages (reuse pre-built products/list & product-details patterns).
   - Bookings: list/detail/approve.
   - Pricing/Availability: custom pages using widgets + calendars.
3) API Wiring
   - Use VITE_API_BASE_URL; axios/fetch with credentials: 'include'.
   - Respect backend GET/POST convention, integer IDs, delete via GET /{id}/delete.
4) Litho updates
   - Keep public pages as-is; ensure “Dashboard” link in header.
   - Remove any admin-like screens from Litho (e.g. HostDashboard.jsx) and replace with links to Dashlite targets.

Navigation Map (Dev defaults)
- Litho Dashboard link → http://localhost:5173 (admin root)
- Admin Back to site → http://localhost:3000 (or return_to)

Acceptance Criteria
- All admin flows (inventory, bookings, payouts, KYC, analytics) live in Dashlite.
- Litho has no data-ops screens; only public UX and user-facing booking history.
- Handoff links work both directions; sessions persist with cookie auth.

Milestones
M1: Add Dashlite menus and skeleton pages for BnB/Tours management.
M2: Wire listing CRUD and bookings tables to API.
M3: Add pricing/availability management UIs.
M4: Migrate HostDashboard.jsx in Litho → replace with link to Dashlite overview.
M5: Final QA: permissions, audit logs, analytics dashboards.

