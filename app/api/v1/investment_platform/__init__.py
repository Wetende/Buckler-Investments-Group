"""
Investment platform module - all investment-related routes grouped together.

This module consolidates:
- Public investment product listings
- User investment operations (orders, positions, KYC)
- Admin investment management
"""

from fastapi import APIRouter
from .public_routes import router as public_router  
from .user_routes import router as user_router
from .admin_routes import router as admin_router

# Main router that combines all investment-related routes
router = APIRouter()

# Include all investment sub-routers
router.include_router(public_router, prefix="/public", tags=["Investment - Public"])
router.include_router(user_router, prefix="/user", tags=["Investment - User"])
router.include_router(admin_router, prefix="/admin", tags=["Investment - Admin"])
