"""
Shared routes module - cross-cutting functionality.

This module contains routes that don't belong to a specific business domain:
- Authentication and user management
- Media/file uploads
- System administration
- GDPR compliance
"""

from fastapi import APIRouter
from .auth_routes import router as auth_router
from .user_routes import router as user_router
from .media_routes import router as media_router
from .admin_routes import router as admin_router

# Main router that combines all shared routes
router = APIRouter(redirect_slashes=False)

# Include all shared sub-routers (auth now includes Google OAuth)
router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
router.include_router(user_router, prefix="/users", tags=["User Management"])
router.include_router(media_router, prefix="/media", tags=["Media"])
router.include_router(admin_router, prefix="/admin", tags=["Administration"])

