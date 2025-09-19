from fastapi import APIRouter
from .listing_routes import router as listing_router
from .booking_routes import router as booking_router
from .host_routes import router as host_router

# Main BnB router that combines listing, booking, and host routes
router = APIRouter()

# Include all listing routes
router.include_router(listing_router, tags=["BnB Listings"])

# Include all booking routes  
router.include_router(booking_router, tags=["BnB Bookings"])

# Include all host application routes
router.include_router(host_router, prefix="/host", tags=["Host Applications"])
