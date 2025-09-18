Litho ↔ Dashlite Cross-Platform Integration Guide

Overview
- Litho (frontend/) serves public experiences: discovery, landing, lists, details, checkout.
- Dashlite (admin/) serves dashboards: data ops, approvals, inventory/pricing, reporting.
- The two apps run on separate ports/environments in dev; behind a reverse proxy in prod.

Ports & URLs
- Dev defaults:
  - Litho: http://localhost:3000
  - Admin: http://localhost:5173
  - API:   http://localhost:8000/api/v1
- Prod example:
  - Litho: https://www.example.com
  - Admin: https://admin.example.com (or https://www.example.com/dashboard)
  - API:   https://api.example.com/api/v1

Environment Variables
- Litho (.env in frontend/):
  - REACT_APP_API_BASE_URL
  - REACT_APP_ADMIN_BASE_URL
- Admin (.env in admin/):
  - VITE_API_BASE_URL
  - VITE_ADMIN_BASENAME
  - VITE_PUBLIC_APP_BASE_URL

Handoff Patterns
1) Litho → Admin
   - Header menu item “Dashboard” pointing to REACT_APP_ADMIN_BASE_URL.
   - Optionally append return_to with the current Litho path for a back link.
2) Admin → Litho
   - “Back to site” resolves return_to if provided, else VITE_PUBLIC_APP_BASE_URL.

Routing
- Admin BrowserRouter basename:
  - Dev: '/'
  - Prod: '/dashboard' (or keep '/' when using a separate admin host).

Auth & Cookies
- Prefer cookie-based auth for both apps to share session with API.
- Axios in Litho must default to withCredentials=true.
- Admin login posts to /auth/token with credentials: 'include'.
- CORS on API must include both origins and allow credentials.

Reverse Proxy (example Nginx)
```
location /api/v1/ { proxy_pass http://api:8000/api/v1/; proxy_set_header Host $host; add_header Access-Control-Allow-Origin https://www.example.com; add_header Access-Control-Allow-Credentials true; }
location /dashboard { try_files $uri /dashboard/index.html; proxy_pass http://admin:5173; }
```

Local Testing Checklist
- Set envs in both apps; restart dev servers.
- Visit Litho → click Dashboard → Admin opens.
- Log in on Admin; navigate back via “Back to site”.
- Verify API requests succeed with cookies from both apps.

Ownership Matrix (high-level)
- Litho: public lists, details, booking/checkout, user-facing forms.
- Admin: dashboards, management tables, approvals, payouts, KYC, analytics, inventory/availability, pricing, promotions.

Troubleshooting
- Blank admin page: use import.meta.env (not process.env), hard refresh, remove future flags in BrowserRouter.
- 401 on cookies: ensure SameSite/secure flags match environment and CORS allows credentials.

