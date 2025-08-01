"""
FastAPI Property Listing Platform Backend

Main application entry point with CORS, middleware, and router configuration.
""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse

from core.middleware import limiter, rate_limit_middleware, AuditLoggingMiddleware, _rate_limit_exceeded_handler

from core.config import settings

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

# Rate limiting setup
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
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
from routers.admin.property_routes import router as admin_property_router
from routers.admin.user_routes import router as admin_user_router
from routers.properties import router as properties_router

from routers.public.property_routes import router as public_property_router
from routers.media import router as media_router
from routers.profile import router as profile_router
from routers.public.article_routes import router as public_article_router
from routers.admin.dashboard import router as admin_dashboard_router
from routers.admin.settings import router as admin_settings_router
from routers.gdpr import router as gdpr_router
from routers.admin.notifications import router as admin_notifications_router

app.include_router(admin_property_router)
app.include_router(admin_user_router)
app.include_router(properties_router)

app.include_router(public_property_router)
app.include_router(public_article_router)
app.include_router(media_router)
app.include_router(profile_router)
app.include_router(admin_dashboard_router)
app.include_router(admin_settings_router)
app.include_router(gdpr_router)
app.include_router(admin_notifications_router)
app.include_router(favorites_router)

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
