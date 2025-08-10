## Phase 5 Plan — Hardening, SEO, Analytics

Principles: Production readiness; performance, security, compliance; discoverability.

### Subphase 5.1 — Rate Limits, Audit Coverage, Security
- Tasks
  - Configure per‑route quotas: public lists, booking/orders; burst and sustained limits; custom keys for auth users.
  - Expand `AuditLoggingMiddleware` critical paths: `/api/v1/admin`, `/api/v1/invest`, `/api/v1/bnb`.
  - Security headers (CSP, HSTS, X‑Frame‑Options), refined CORS allowlist; CSRF review for browser clients.

### Subphase 5.2 — SEO & Content
- Tasks
  - Slug consistency: properties, areas, developers, projects, articles, products.
  - Sitemaps: `/sitemap.xml` including properties/projects/articles/areas.
  - OpenGraph/Twitter cards for public detail pages; canonical URLs.
  - Structured data (JSON‑LD) for properties and projects; articles (`NewsArticle`).

### Subphase 5.3 — Analytics & Eventing
- Tasks
  - Event hooks for: valuation lead, sell/let lead, favorite add/remove, booking create/cancel, order placed/filled.
  - Pluggable analytics sink (e.g., HTTP webhook); sampling/PII scrubbing; error tracking integration.

### Subphase 5.4 — Performance & Caching
- Tasks
  - DB indexes review and tuning (filters on price/created_at/status, badges, foreign keys).
  - Query optimization; N+1 checks with `selectinload` where needed.
  - Add response caching layer for public lists (etag/max‑age) where safe.

### Subphase 5.5 — Privacy, Compliance, Docs
- Tasks
  - Data retention policies for BNB messages and logs; purge jobs.
  - Update privacy/terms/cookie policies; add cookie banner where relevant.
  - Admin runbooks: investment ops, BNB disputes, lead handling; API docs for GET/POST convention.

### Subphase 5.6 — Release & SRE Readiness
- Tasks
  - Health checks, readiness/liveness; basic dashboards (RQ/DB metrics).
  - Backup/restore runbook; disaster recovery notes.
  - Load test critical flows; fix hotspots; finalize on‑call notes.



