from fastapi import APIRouter
from .listing_routes import router as listing_router
from .booking_routes import router as booking_router

# Main BnB router that combines listing and booking routes
router = APIRouter()

# Include all listing routes
router.include_router(listing_router, tags=["BnB Listings"])

# Include all booking routes  
router.include_router(booking_router, tags=["BnB Bookings"])
