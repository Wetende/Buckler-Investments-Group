"""
Property listing module - all property-related routes grouped together.

This module consolidates:
- Public property search and listings
- Admin property management  
- Property catalog (areas, developers, projects)
- Agent property operations
"""

from fastapi import APIRouter
from .public_routes import router as public_router
from .admin_routes import router as admin_router
from .catalog_routes import router as catalog_router

# Main router that combines all property-related routes
router = APIRouter()

# Include all property sub-routers
router.include_router(public_router, prefix="/public", tags=["Properties - Public"])
router.include_router(admin_router, prefix="/admin", tags=["Properties - Admin"])
router.include_router(catalog_router, prefix="/catalog", tags=["Properties - Catalog"])

