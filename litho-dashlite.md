## Litho ↔ Dashlite Integration Plan

Goal: Seamlessly combine Litho (public-facing SPA at `frontend/`) and Dashlite (admin SPA at `admin/`) into a single, cohesive user experience while allowing each to run on separate servers and ship independently.

Constraints and standards:
- Single-sign-on UX (user should not feel a boundary between apps)
- Both SPAs keep independent deploy pipelines/hosts
- Backend follows platform standards (GET/POST only, integer IDs, DI), base path `/api/v1`
- Prefer HTTPOnly Secure cookies for session; avoid localStorage tokens
- Roles and route gating enforced server-side and mirrored client-side

---

### Phase 0 — Discovery & Audit
Tasks
- Inventory current apps
  - Litho: routes, auth flows, axios instances, React Query usage, environment configuration
  - Dashlite: login/guard patterns, router base path, build output assumptions (publicPath, basename)
- Validate backend session model
  - Confirm `/auth/login`, refresh, logout, and cookie settings (domain, path, SameSite, Secure)
  - Confirm role claims (e.g., `user`, `host`, `admin`) and how they’re attached to responses
- Networking and CORS
  - Identify current domains and desired DNS (e.g., `www`, `app`, `admin`)
  - Confirm CORS rules and credential support (if cross-domain)
Acceptance criteria
- Documented route maps for both SPAs
- Confirmed session transport strategy (cookie vs token); target is HTTPOnly cookies
- Known domain model and constraints

### Phase 1 — Integration Strategy Decision
Options (choose one):
- A) Reverse proxy (single domain, path-based)
  - `/` → Litho; `/dashboard` → Dashlite
  - Pros: best UX, shared origin/cookie, simplest SSO
- B) Subdomains (shared parent)
  - `app.example.com` (Litho), `admin.example.com` (Dashlite)
  - Pros: clean separation; cookies with `domain=.example.com`
- C) Cross-domain SSO handoff
  - Short-lived one-time code exchange via backend; works across different domains
- D) OIDC provider (Auth0/Keycloak/…)
  - Full SSO; more infra/setup
Decision guidance
- If proxy control available → A or B
- If different unrelated domains → C
Acceptance criteria
- Strategy selected with rationale, fallback noted (e.g., if path-based fails, use subdomains)

### Phase 2 — Auth & Session Cohesion
Tasks
- Session cookie
  - Configure HTTPOnly, Secure, SameSite=Lax cookie
  - Domain: root domain for A/B; per-domain for C with SSO
- Login & logout
  - Centralize login against `/api/v1/shared/auth` endpoints
  - After login, set cookie; redirect to post-login page (`return_to` supported)
  - Logout clears cookie(s) for both apps
- Cross-app handoff (only for C)
  - POST `/auth/xapp/link` → returns one-time code (TTL 60s), bound to user/session
  - Admin calls POST `/auth/xapp/exchange` to redeem code; sets its own cookie; redirects to dashboard
- Role-based gates
  - Server-side checks; client-side route guards (hide/show nav, prevent flash of unauthorized content)
Acceptance criteria
- User logs in on Litho and lands in Dashlite without re-authentication
- Logout invalidates both apps’ sessions
- `return_to` handled across app boundaries

### Phase 3 — Navigation & UX Unification
Tasks
- Litho global nav
  - Add “Dashboard” item (visible when authenticated and role-eligible)
  - Link to `/dashboard` (A) or `https://admin.example.com` (B/C)
  - Prefetch/prefetch DNS to reduce load time (`<link rel="preconnect" …>`)
- Dashlite header
  - Add “Back to site” link returning to the last page (use `return_to`), default `/`
- Smooth transitions
  - Show minimal loading state between SPAs; preserve scroll position where possible
Acceptance criteria
- Users can hop back and forth with consistent header/nav presence and minimal friction

### Phase 4 — Theming & Branding Alignment
Tasks
- Create shared “UI tokens” (CSS variables or small CSS package)
  - Colors, typography, spacing, shadows, border radii
  - Ship via CDN stylesheet or tiny npm package consumed by both SPAs
- Optional shared header fragment
  - Extract minimal header brand strip (logo, account, back-to-site) shared by both apps
- Respect dashboards’ density
  - Keep Dashlite’s data-dense patterns (tables, filters) vs Litho’s marketing patterns
Acceptance criteria
- Visual consistency of brand tokens across both SPAs (color/typography/spacing)

### Phase 5 — Data Layer & API Contracts
Tasks
- Unify axios instances and interceptors
  - Base URL `/api/v1`, `withCredentials` for cookie-based auth
  - 401 handling: refresh once (if applicable) then logout
- React Query consistency
  - Include filters/pagination in keys; preserve server contract (limit/offset for bnb/tours/cars; cursor for properties)
- Error mapping
  - Map backend `{detail}` to user-friendly toasts/messages using shared helper
Acceptance criteria
- Both SPAs consume the same API contracts with consistent error/refresh semantics

### Phase 6 — Infrastructure & Deployment
Tasks
- Reverse proxy (option A)
  - Configure NGINX/Traefik routes:
    - `location / { proxy_pass LITHO; }`
    - `location /dashboard/ { proxy_pass DASHLITE; }`
  - Ensure `try_files` for SPA fallbacks and correct base paths
- Subdomains (option B)
  - DNS: `app.example.com`, `admin.example.com`
  - TLS for both; cookie `domain=.example.com`
- Cross-domain SSO (option C)
  - Implement handoff endpoints; enable CORS with credentials; CSRF protection
- Security headers
  - HSTS, CSP (script-src, connect-src to api/admin/app), X-Frame-Options (allow iframes only if intended)
Acceptance criteria
- Deploys of both apps succeed; navigation between them works in staging with HTTPS and cookies

### Phase 7 — QA, Accessibility, Performance
Tasks
- Test plan
  - Auth flows: login on one app → navigate to the other; logout coherence
  - Role gating: user vs host vs admin dashboards
  - Mobile navigation and back behavior
  - Deep-links to dashboard subsections and back to Litho content
- A11y
  - Keyboard navigation for nav handoffs; focus management on SPA transitions
- Performance
  - Preconnect/preload admin bundle; measure TTI on first admin hit
Acceptance criteria
- Green checklist across Chrome/Firefox/Safari + iOS/Android

### Phase 8 — Observability & Support
Tasks
- Client-side telemetry
  - Sentry (errors), simple perf beacons for route transitions across apps
- Server logging
  - Correlate session IDs across services for auth handoffs (option C)
- Alerts and dashboards
  - Track login→dashboard success rate; time-to-dashboard; error rates
Acceptance criteria
- Live dashboards showing cross-app auth success and error trends

### Phase 9 — Rollout & Change Management
Tasks
- Staged rollout
  - Internal users first; then percentage rollouts
- Comms
  - Announce unified “Dashboard” in navigation; clarify that public site remains accessible
- Backout plan
  - Feature flag toggle to hide Dashboard link if issues arise
Acceptance criteria
- Successful phased release without auth regressions or UX confusion

### Phase 10 — Future Enhancements (Optional)
- Micro frontends (module federation) to load admin screens directly inside Litho for certain routes
- Shared component library for header, toasts, and forms
- SSO with OIDC provider for future partner integrations

---

## Implementation Checklists

Navigation & UX
- [ ] Dashboard link in Litho shows when authenticated
- [ ] Back-to-site link in Dashlite header
- [ ] `return_to` preserved both ways; deep-links supported

Auth & Security
- [ ] HTTPOnly Secure cookie for session; refresh (if applicable) handled
- [ ] Subdomain/shared cookie or SSO handoff implemented per chosen strategy
- [ ] Logout clears sessions on both apps
- [ ] CSRF protection, CORS credentials as needed

Infra
- [ ] Proxy/subdomains configured with TLS
- [ ] SPA fallback routing configured correctly for both apps
- [ ] Security headers (HSTS, CSP, X-Frame-Options) set

Branding
- [ ] Shared CSS tokens consumed by both apps
- [ ] Basic visual cohesion verified (colors, typography, spacing)

QA
- [ ] Auth navigation happy-path passes on desktop/mobile
- [ ] Role gating verified
- [ ] Error scenarios (expired sessions, code reuse, 401s) handled gracefully

---

## Timeline (Indicative)
- Week 1: Phase 0–1 (audit + strategy), Phase 2 design
- Week 2: Phase 2 build, Phase 3 nav, Phase 4 tokens
- Week 3: Phase 5 data alignment, Phase 6 infra staging
- Week 4: Phase 7 QA, Phase 8 observability, Phase 9 rollout

Ownership
- Frontend: Litho nav, tokens, axios/session alignment
- Admin: Header/back-link, axios/session alignment
- Backend: Cookie policy, optional SSO endpoints, security headers
- DevOps: DNS/proxy/TLS, CSP

---

## Notes Specific to This Repo
- Litho (public): `frontend/` — React + Litho components; React Router; axios; React Query
- Dashlite (admin): `admin/` — separate Vite app, independent build and server
- Backend: `app/api/v1` — Follow GET/POST only; integer IDs; DI via `dependency_injector`
- For cross-app flows, add optional endpoints under `app/api/v1/shared/auth` if choosing option C (handoff)



