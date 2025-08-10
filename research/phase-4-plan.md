## Phase 4 Plan — Investment Hub (REITs/Products)

Principles: Regulated flows; explicit disclosures; audit on all investment actions; GET/POST only; background NAV updates.

### Subphase 4.1 — Core Entities & Migrations
- Tasks
  - Models:
    - `InvProduct(id, slug unique, name, summary, min_invest Decimal, currency, fee_schedule JSON, disclosures_md TEXT, provider_ref, is_active, created_at, updated_at)`
    - `InvNavSnapshot(id, product_id FK, nav Decimal, nav_date date, source, created_at)`
    - `InvOrder(id, user_id FK, product_id FK, amount Decimal, currency, side ENUM[BUY, SELL], status ENUM[PENDING, SUBMITTED, FILLED, CANCELED, REJECTED], placed_at, updated_at, ext_ref)`
    - `InvPosition(id, user_id FK, product_id FK, units Decimal, avg_cost Decimal, updated_at)`
    - `KycRecord(id, user_id FK, status ENUM[PENDING, APPROVED, REJECTED], data JSON, updated_at)`
  - Alembic migration with indexes (`product_id,nav_date`), (`user_id`), (`status`).

### Subphase 4.2 — Schemas & Public Catalog
- Tasks
  - Pydantic: `ProductRead`, `ProductCU`, `NavSnapshotRead`, `OrderCU`, `OrderRead`, `PositionRead`, `KycCU/Read`.
  - Public router `app/routers/public/invest.py`:
    - GET `/api/v1/public/invest/products` (list, filters: active, min_invest <= X)
    - GET `/api/v1/public/invest/products/{slug}` (detail with latest NAV)

### Subphase 4.3 — Investor Flows
- Tasks
  - Router `app/routers/invest/orders.py` (auth):
    - POST `/api/v1/invest/orders` (place/update by id); validate KYC; record intent and submit to provider adapter.
    - GET `/api/v1/invest/orders` (list my orders)
  - Positions: compute from filled orders via job; expose GET `/api/v1/invest/positions` (my positions).
  - Statements & tax docs placeholder (export endpoints later).

### Subphase 4.4 — NAV Ingestion & Providers
- Tasks
  - Background job (APScheduler) to fetch NAV (cron daily/weekly); persist `InvNavSnapshot`.
  - Provider adapter interfaces: NAV fetcher; order submit/cancel; mocks for dev.
  - Admin router `app/routers/admin/invest.py`:
    - POST `/api/v1/admin/invest/products` (create/update)
    - GET `/api/v1/admin/invest/products/{id}/delete`
    - POST `/api/v1/admin/invest/nav-snapshots` (manual upsert)
    - GET `/api/v1/admin/invest/nav-snapshots` (list)

### Subphase 4.5 — KYC/AML & Compliance
- Tasks
  - KYC capture (POST `/api/v1/invest/kyc`); statuses; block orders until APPROVED.
  - Audit logging for all order/kyc endpoints; throttling/rate limits.
  - User disclosures: serve product disclosures markdown on product detail; accept risk acknowledgment (POST `/api/v1/invest/acknowledgments`).

### Subphase 4.6 — Tests & Seeding
- Tasks
  - Unit/integration tests: product catalog, nav job, order lifecycle state transitions, position computation, KYC gate.
  - Seed 1–2 products with fake NAV history; create demo orders/positions.



