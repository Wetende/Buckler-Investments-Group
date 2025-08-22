"""
FastAPI Property Listing Platform Backend

Main application entry point with CORS, middleware, and router configuration.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse

from infrastructure.config.middleware import (
    limiter,
    rate_limit_middleware,
    AuditLoggingMiddleware,
    _rate_limit_exceeded_handler,
)

from infrastructure.config.config import settings
from fastapi.openapi.utils import get_openapi

from .containers import AppContainer
from .v1.favorites import router as favorites_router

# Create FastAPI application
app = FastAPI(
    title="Buckler Investment Group API",
    description=(
        "Buckler Investment Group: unified marketplace for short-term rentals,  tour packages, "
        "property listings, Investment opportunities, and car rentals."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Create and wire container
container = AppContainer()
app.container = container
# Wiring is now configured in the container's wiring_config

@app.on_event("shutdown")
async def shutdown_event():
    await container.shutdown_resources()

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
            "message": "Buckler Investment Group API is running"
        }
    )

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return JSONResponse(
        content={
            "message": "Buckler Investment Group API",
            "version": "1.0.0",
            "docs": "/docs",
            "health": "/health",
            "vision_doc": "super_platform_plan.md"
        }
    )

# Import new business-focused router structure
from .v1.property_listing import router as property_router
from .v1.investment_platform import router as investment_router
from .v1.shared import router as shared_router

# Import additional business routers
from .v1.tours import router as tours_router
from .v1.cars import router as cars_router
from .v1.bnb import router as bnb_router

# Import remaining routers that are already well-organized
from .v1.public.article_routes import router as public_article_router
from .v1.public.sitemap import router as sitemap_router
from .v1.notifications_unified import router as notifications_router
from .v1.settings_unified import router as settings_router

# Include business domain routers
app.include_router(property_router, prefix="/api/v1/property")
app.include_router(investment_router, prefix="/api/v1/investment")
app.include_router(shared_router, prefix="/api/v1")

# Include additional business routers
app.include_router(tours_router, prefix="/api/v1/tours", tags=["Tours"])
app.include_router(cars_router, prefix="/api/v1/cars", tags=["Cars"])
app.include_router(bnb_router, prefix="/api/v1/bnb", tags=["BnB"])

# Include favorites router
app.include_router(favorites_router)

# Include remaining standalone routers
app.include_router(public_article_router)
app.include_router(notifications_router)
app.include_router(settings_router)
app.include_router(sitemap_router)

# Add middlewares (order matters)
app.add_middleware(rate_limit_middleware)
app.add_middleware(AuditLoggingMiddleware, critical_paths={"/api/v1/admin", "/api/v1/auth"})

# Start background scheduler only when explicitly enabled (avoid serverless runtimes like Vercel)
import os

if os.getenv("ENABLE_SCHEDULER") == "1":
    from infrastructure.config.tasks import start_scheduler
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
