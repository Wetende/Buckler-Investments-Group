from fastapi import APIRouter
from .tour_routes import router as tour_router
from .booking_routes import router as booking_router

# Main Tours router that combines tour and booking routes
router = APIRouter()

# Include all tour routes
router.include_router(tour_router, tags=["Tours"])

# Include all booking routes  
router.include_router(booking_router, tags=["Tour Bookings"])
