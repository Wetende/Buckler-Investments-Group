## Phase 2 Plan — Areas, Developers, Projects/Off‑Plan

Guiding rules: GET/POST only; POST with id==0 create, id>0 update; FastAPI best practices (Pydantic schemas, explicit models, dependency-injected sessions, role deps, pagination, validation).

### Subphase 2.1 — Data Modeling & Migrations
- Tasks
  - Create models:
    - `AreaProfile(id, slug unique, name, summary, hero_image_url, stats JSON, created_at, updated_at)`
    - `Developer(id, slug unique, name, logo_url, website_url, bio, created_at, updated_at)`
    - `Project(id, slug unique, developer_id FK, name, from_price Decimal, handover_quarter str, bedrooms_min int, bedrooms_max int, location str, lat/long, payment_plan str, badges JSON [HOT, UPCOMING, BEST_VALUE], media JSON, created_at, updated_at)`
    - Optional linkage on `Property.project_id` (nullable FK) for inventory mapping.
  - Add Alembic migration:
    - Autogenerate with new tables and indexes on `slug`, foreign keys, and `project_id` on `properties`.
  - Add `__all__` exports in `app/models/__init__.py`.

### Subphase 2.2 — Schemas & Validation
- Tasks
  - Add Pydantic schemas (public and admin forms):
    - `AreaRead`, `AreaCU`, `DeveloperRead`, `DeveloperCU`, `ProjectRead`, `ProjectCU`.
  - Field validations: slug regex, non-empty names, URL fields, price > 0, bedroom ranges valid.
  - Response schemas for list/detail; list pagination for public endpoints.

### Subphase 2.3 — Public APIs (Areas/Developers/Projects)
- Tasks
  - Router `app/routers/public/areas.py`:
    - GET `/api/v1/public/areas` (paginated list, optional search by name)
    - GET `/api/v1/public/areas/{slug}` (detail with stats)
  - Router `app/routers/public/developers.py`:
    - GET `/api/v1/public/developers` (list)
    - GET `/api/v1/public/developers/{slug}` (detail with basic portfolio counts)
  - Router `app/routers/public/projects.py`:
    - GET `/api/v1/public/projects` (paginated, filters: developer, min/max price, bedrooms range, badges)
    - GET `/api/v1/public/projects/{slug}` (detail)
    - GET `/api/v1/public/projects/hot` (badge filter)
    - GET `/api/v1/public/projects/upcoming` (badge filter)
    - GET `/api/v1/public/projects/best-value` (badge filter)
  - Compose `ProjectRead` with developer summary and minimal media.
  - Add dual-currency (`price_usd`) fields mirroring properties logic.

### Subphase 2.4 — Admin/Agent CRUD (GET/POST Only)
- Tasks
  - Router `app/routers/admin/areas.py`:
    - POST `/api/v1/admin/areas` (id==0 create; id>0 update)
    - GET `/api/v1/admin/areas/{id}/delete`
  - Router `app/routers/admin/developers.py`:
    - POST `/api/v1/admin/developers` (create/update)
    - GET `/api/v1/admin/developers/{id}/delete`
  - Router `app/routers/admin/projects.py`:
    - POST `/api/v1/admin/projects` (create/update)
    - GET `/api/v1/admin/projects/{id}/delete`
  - Role deps: `require_admin` for areas/developers; `require_agent_or_admin` for projects.
  - Generate and enforce unique slugs server-side; reject duplicates with 409.

### Subphase 2.5 — Discovery & Property Linkage
- Tasks
  - Add property↔project linkage filters to public properties (optional `project_id` filter).
  - Build discovery endpoints:
    - `/api/v1/public/projects/hot|upcoming|best-value` (badge derived)
  - Add counts on area/dev detail: total projects, total properties (AVAILABLE).

### Subphase 2.6 — Seeders, Fixtures, and Tests
- Tasks
  - Seed minimal data for areas (e.g., Nairobi, Mombasa), developers (stubs), and 3–5 sample projects.
  - Pytests:
    - Models: FK constraints, slug uniqueness, validators
    - Public: list/detail paging, filters, badge endpoints
    - Admin: create/update/delete workflows (GET/POST convention)
    - Property↔project linkage

### Subphase 2.7 — Observability, Docs, and Rate Limits
- Tasks
  - Rate limit public list endpoints; audit admin CRUD endpoints.
  - Add OpenAPI tags for Areas/Developers/Projects; describe GET/POST-only convention.
  - Brief admin runbook: adding a developer/project; linking properties; badge usage.



