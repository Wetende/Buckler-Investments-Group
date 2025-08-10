## New Features Integration Plan

This plan maps `Unified Property Platform – Combined Feature Set` to what is already implemented and defines phased work to deliver the remaining features.

### What exists today (high level)
- Auth & roles: OAuth2 password + JWT, roles (BUYER/AGENT/ADMIN) with role-deps.
- Properties: Models with status, geo fields, amenities, images; admin/agent CRUD; public list with filters (price, beds, type, radius), cursor pagination; detail endpoint present but incomplete; status audit logs.
- Media: Model + endpoints to attach URLs to properties (agent/admin secured).
- Favorites: Routes to add/list/delete (list/delete incomplete);
- Articles (Insights): Model + public list/detail.
- Profile & GDPR: Profile view/update; GDPR export/delete.
- Admin: Dashboard stats; users CRUD; settings (system/website); notifications (templates/providers).
- Ops: Middleware scaffolding for rate limiting & audit logging; APScheduler setup; email service wiring.

### Major gaps vs combined_features.md
- Public property detail endpoint incomplete; geo/radius branch has a syntax issue; favorites list/delete incomplete.
- Area profiles, developer directory, project/off‑plan models and APIs: missing.
- Valuation (Market Assessment) and Sell/Let forms: missing endpoints/models.
- Discovery hubs (Recently Sold/Rented, In the Spotlight, On Show): no explicit endpoints.
- Agent/office directories: agent profiles partially in `User`; no offices module.
- BNB module (short‑term rentals, bookings, availability, host tools, payouts, taxes): missing.
- Investment hub (REITs, NAV, KYC/AML, orders, disclosures): missing.
- Compliance hardening (rate limits configured, audit logging wired to critical paths): partially scaffolded.

---

## Phased Integration

### Phase 1 — Stabilize Core Listings & Lead Capture (1–2 sprints) — DONE
- Fixes & polish
  - Complete public property detail handler; fix geo/radius branch; finalize favorites list/delete.
  - Add discovery endpoints: `/public/properties/recently-listed`, `/recently-sold`, `/recently-rented`, `/in-the-spotlight`, `/on-show` (filters on status + created_at + flags).
  - Dual‑currency projection in responses (e.g., add `price_usd` using FX rate from config).
- Lead capture
  - Add `valuation_requests` model + `/public/valuation` POST (address, contact, notes) with email notify.
  - Add `sell_let_leads` + `/public/sell-let` POST.
- Agents
  - Expose `/public/agents` list + `/public/agents/{id}` (subset of `User`), with counters (listings, recent activity).
- Ops
  - Wire rate limiting on public list/detail and lead endpoints; audit logging for admin, auth, and lead captures.

Data model
- Tables: `valuation_requests`, `sell_let_leads` (status, source, payload, created_at).

### Phase 2 — Areas, Developers, Projects/Off‑Plan (2–3 sprints) — DONE
- Areas
  - `area_profiles` (slug, name, summary, hero, stats); endpoints `/public/areas`, `/public/areas/{slug}`; counts by status.
- Developers
  - `developers` (slug, name, logos, bio, links); `/public/developers`, `/public/developers/{slug}`.
- Projects
  - `projects` (developer_id, name, from_price, handover_q, bedrooms_range, location, payment_plan, badges, media); `/public/projects`, detail; admin CRUD.
  - Link `properties.project_id` optional for inventory mapping.
- Discovery
  - Hubs: `/public/projects/hot`, `/upcoming`, `/best-value`, with badge filters.

Data model
- `area_profiles`, `developers`, `projects` (+ optional `project_units` if needed later).

### Phase 3 — BNB (Short‑Term Rentals) (3–4 sprints) — DONE
- Core entities
  - `st_listings` (host_id, type, capacity, nightly_price, fees, rules, cancellation_policy, address, geo, amenities, calendar policy).
  - `st_availability` (listing_id, date, is_available, price_override, min_nights).
  - `st_bookings` (guest_id, listing_id, check_in, check_out, guests, status, amount, deposit, refunds).
  - `st_messages` (booking_id, sender_id, body, timestamps).
  - `st_host_profiles`, `st_payouts`, `st_taxes`.
- Public APIs
  - Search `/public/bnb` with date/guest filters, amenities, map; listing detail with calendar; request‑to‑book & instant‑book.
- Host APIs
  - Listing wizard (create/update), calendar, pricing, promotions, iCal import/export.
- Ops & compliance
  - KYC for hosts, identity checks for guests; region‑aware tax calculation; payouts after check‑in; dispute/refund workflows.

Integrations
- Payments provider (cards + mobile money), iCal; optional PMS/channel manager later.

### Phase 4 — Investment Hub (REITs/Products) (3–4 sprints) — DONE
- Entities
  - `inv_products` (slug, name, summary, min_invest, fees, disclosures, provider_ref), `inv_nav_snapshots`, `inv_orders`, `inv_positions`, `kyc_records`.
- Public/Investor APIs
  - `/public/invest/products` list/detail; `/invest/orders` (auth); webhook/cron to refresh NAV; disclosures and risk acknowledgments.
- Ops
  - KYC/AML integration; custodian references; audit logging for orders; background tasks for NAV updates.

### Phase 5 — Hardening, SEO, Analytics (1–2 sprints) — PARTIAL
- Middleware: finalize limiter configuration, per‑route quotas; expand audit coverage.
- SEO: add slugs/meta consistently; sitemaps; OpenGraph; structured data (listings/projects/articles).
- Analytics & alerts: event hooks for leads, bookings, orders.

---

## Cross‑Cutting Concerns
- Migrations: Alembic revisions each phase; backfill scripts for computed counts.
- Security: role checks; input validation; PII minimization; rate limits; CS logging.
- Testing: API/DB tests for new models; property search regression; booking edge cases; order lifecycle.
- Documentation: OpenAPI tags for new modules; admin runbooks (leads, projects, BNB disputes, investment ops).

## Deliverables by milestone
- Phase 1: fixed core routes; lead endpoints; agent listing; rate‑limit + audit on critical routes.
- Phase 2: areas/developers/projects public + admin; property↔project linkage; hubs.
- Phase 3: BNB listings/search/booking; host tools; payments; tax & payout workflows.
- Phase 4: investment products; NAV tasks; orders; KYC; disclosures.
- Phase 5: compliance/SEO/analytics hardening.


