"""
FastAPI Property Listing Platform Backend

Main application entry point with CORS, middleware, and router configuration.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse

from core.middleware import limiter, rate_limit_middleware, AuditLoggingMiddleware, _rate_limit_exceeded_handler

from core.config import settings
from fastapi.openapi.utils import get_openapi

from routers.auth import router as auth_router
from routers.favorites import router as favorites_router

# Create FastAPI application
app = FastAPI(
    title="Property Listing Platform API",
    description="Backend API for property listing platform connecting agents, landlords, buyers, and tenants",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Always generate a fresh OpenAPI schema (avoids stale cached schemas in long-running dev sessions)
def _fresh_openapi():  # pragma: no cover
    return get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )

app.openapi = _fresh_openapi  # type: ignore[assignment]

# Rate limiting setup
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS
allowlist = [o.strip() for o in settings.CORS_ALLOW_ORIGINS.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowlist or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return JSONResponse(
        content={
            "status": "healthy",
            "message": "Property Listing Platform API is running"
        }
    )

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return JSONResponse(
        content={
            "message": "Property Listing Platform API",
            "version": "1.0.0",
            "docs": "/docs",
            "health": "/health"
        }
    )

# Include authentication router
app.include_router(auth_router)

# Property routers
from routers.admin.user_routes import router as admin_user_router

from routers.properties_all import router as properties_all_router
from routers.catalog import router as catalog_router
from routers.media import router as media_router
from routers.profile import router as profile_router
from routers.public.article_routes import router as public_article_router
from routers.admin.dashboard import router as admin_dashboard_router
from routers.settings_unified import router as settings_router
from routers.gdpr import router as gdpr_router
from routers.notifications_unified import router as notifications_router
from routers.bnb import router as bnb_router
from routers.invest import router as invest_router
from routers.public.sitemap import router as sitemap_router
from routers.areas import router as areas_router
from routers.developers import router as developers_router
from routers.projects_unified import router as projects_router

app.include_router(admin_user_router)

app.include_router(properties_all_router)
app.include_router(catalog_router)
app.include_router(public_article_router)
app.include_router(media_router)
app.include_router(profile_router)
app.include_router(admin_dashboard_router)
app.include_router(settings_router)
app.include_router(gdpr_router)
app.include_router(notifications_router)
app.include_router(favorites_router)
app.include_router(areas_router)
app.include_router(developers_router)
app.include_router(projects_router)
app.include_router(bnb_router)
app.include_router(invest_router)
app.include_router(sitemap_router)

# Add middlewares (order matters)
app.add_middleware(rate_limit_middleware)
app.add_middleware(AuditLoggingMiddleware, critical_paths={"/api/v1/admin", "/api/v1/auth"})

# Start background scheduler
from core.tasks import start_scheduler
start_scheduler()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
