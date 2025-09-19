from fastapi import APIRouter, Depends, HTTPException, Query
from dependency_injector.wiring import inject, Provide
from typing import List, Optional

from ...containers import AppContainer
from application.use_cases.bnb.search_listings import SearchListingsUseCase
from application.use_cases.bnb.create_listing import CreateListingUseCase
from application.use_cases.bnb.get_listing import GetListingUseCase
from application.use_cases.bnb.list_listings import ListListingsUseCase
from application.use_cases.bnb.delete_listing import DeleteListingUseCase
from application.use_cases.bnb.get_host_listings import GetHostListingsUseCase
from application.use_cases.bnb.get_listings_grouped_by_location import GetListingsGroupedByLocationUseCase
from application.use_cases.bnb.get_listings_by_location import GetListingsByLocationUseCase
from application.dto.bnb import (
    SearchListingsRequest,
    ListingResponse,
    StListingCU,
    StListingRead,
    AvailabilityUpsert,
    AvailabilityItem,
    LocationGroupedListingsResponse,
    LocationStatsResponse,
)
from shared.exceptions.bnb import ListingNotFoundError

router = APIRouter()

# Search endpoints
@router.post("/search", response_model=List[ListingResponse])
@inject
async def search_listings(
    request: SearchListingsRequest,
    search_use_case: SearchListingsUseCase = Depends(Provide[AppContainer.search_listings_use_case]),
):
    """Search available listings based on criteria"""
    return await search_use_case.execute(request)

# Public listing endpoints
@router.get("/listings", response_model=List[StListingRead])
@inject
async def list_listings(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    use_case: ListListingsUseCase = Depends(Provide[AppContainer.list_listings_use_case]),
):
    """List all public listings with pagination"""
    return await use_case.execute(limit=limit, offset=offset)

# Location-based grouping endpoints (Airbnb-style)
@router.get("/listings/grouped-by-location", response_model=LocationGroupedListingsResponse)
@inject
async def get_listings_grouped_by_location(
    limit_per_group: int = Query(4, ge=1, le=10, description="Listings per location group"),
    max_groups: int = Query(6, ge=1, le=15, description="Maximum location groups"),
    use_case: GetListingsGroupedByLocationUseCase = Depends(Provide[AppContainer.get_listings_grouped_by_location_use_case]),
):
    """Get listings grouped by location for homepage display (Airbnb-style)"""
    return await use_case.execute(limit_per_group=limit_per_group, max_groups=max_groups)

@router.get("/listings/by-county/{county}", response_model=List[StListingRead])
@inject
async def get_listings_by_county(
    county: str,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    use_case: GetListingsByLocationUseCase = Depends(Provide[AppContainer.get_listings_by_location_use_case]),
):
    """Get listings filtered by county (e.g., 'Mombasa', 'Nairobi')"""
    return await use_case.execute(county=county, limit=limit, offset=offset)

@router.get("/listings/by-town/{town}", response_model=List[StListingRead])
@inject
async def get_listings_by_town(
    town: str,
    county: Optional[str] = Query(None, description="Optional county filter"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    use_case: GetListingsByLocationUseCase = Depends(Provide[AppContainer.get_listings_by_location_use_case]),
):
    """Get listings filtered by town (e.g., 'Kiambu', 'Nakuru')"""
    return await use_case.execute(county=county, town=town, limit=limit, offset=offset)

# Place static routes BEFORE dynamic parameterized routes to avoid path conflicts
@router.get("/listings/featured", response_model=List[StListingRead])
@inject
async def get_featured_listings(
    limit: int = Query(10, ge=1, le=50),
    use_case: ListListingsUseCase = Depends(Provide[AppContainer.list_listings_use_case]),
):
    """Get featured listings"""
    # TODO: Implement featured logic in use case (e.g., high ratings, promoted)
    return await use_case.execute(limit=limit, offset=0)

@router.get("/listings/nearby", response_model=List[StListingRead])
@inject
async def get_nearby_listings(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
    radius_km: float = Query(10.0, ge=1, le=100),
    limit: int = Query(20, ge=1, le=100),
    use_case: ListListingsUseCase = Depends(Provide[AppContainer.list_listings_use_case]),
):
    """Get nearby listings by location"""
    # TODO: Implement geospatial search logic in use case
    return await use_case.execute(limit=limit, offset=0)

@router.get("/listings/{listing_id}", response_model=StListingRead)
@inject
async def get_listing_details(
    listing_id: int,
    use_case: GetListingUseCase = Depends(Provide[AppContainer.get_listing_use_case]),
):
    """Get detailed information about a specific listing"""
    try:
        return await use_case.execute(listing_id)
    except ListingNotFoundError:
        raise HTTPException(status_code=404, detail="Listing not found")

@router.get("/listings/{listing_id}/availability", response_model=List[AvailabilityItem])
@inject
async def get_listing_availability(
    listing_id: int,
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    use_case: GetListingUseCase = Depends(Provide[AppContainer.get_listing_use_case]),
):
    """Get listing availability calendar for date range"""
    # TODO: Implement availability calendar logic
    try:
        listing = await use_case.execute(listing_id)
        # Return mock availability for now
        from datetime import date, timedelta
        from decimal import Decimal
        
        # Default to next 30 days if no dates provided
        if not start_date or not end_date:
            start = date.today()
            end = start + timedelta(days=30)
        else:
            try:
                start = date.fromisoformat(start_date)
                end = date.fromisoformat(end_date)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
        
        availability = []
        current_date = start
        while current_date <= end:
            availability.append(AvailabilityItem(
                date=current_date,
                is_available=True,
                price_override=None,
                min_nights_override=None
            ))
            current_date += timedelta(days=1)
        
        return availability
    except ListingNotFoundError:
        raise HTTPException(status_code=404, detail="Listing not found")

# (static routes moved above dynamic routes)

# Host/Admin listing management
@router.post("/listings", response_model=StListingRead)
@inject
async def create_or_update_listing(
    request: StListingCU,
    use_case: CreateListingUseCase = Depends(Provide[AppContainer.create_listing_use_case]),
):
    """Create new listing (id=0) or update existing listing (id>0)"""
    try:
        return await use_case.execute(request)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/listings/{listing_id}/delete", response_model=dict)
@inject
async def delete_listing(
    listing_id: int,
    use_case: DeleteListingUseCase = Depends(Provide[AppContainer.delete_listing_use_case]),
):
    """Delete a listing (using GET as per platform standards)"""
    try:
        await use_case.execute(listing_id)
        return {"ok": True, "listing_id": listing_id}
    except ListingNotFoundError:
        raise HTTPException(status_code=404, detail="Listing not found")

@router.get("/my-listings", response_model=List[StListingRead])
@inject
async def get_my_listings(
    # TODO: Get host_id from authentication context
    host_id: int = Query(1, description="Host ID (from auth context)"),
    use_case: GetHostListingsUseCase = Depends(Provide[AppContainer.get_host_listings_use_case]),
):
    """Get all listings for the authenticated host"""
    return await use_case.execute(host_id)

@router.post("/listings/{listing_id}/availability", response_model=dict)
async def update_listing_availability(
    listing_id: int,
    request: AvailabilityUpsert,
    # TODO: Implement availability use case
):
    """Update availability calendar for a listing"""
    # TODO: Implement availability management use case
    return {"ok": True, "message": "Availability updated", "listing_id": listing_id}

@router.post("/listings/{listing_id}/pricing", response_model=dict)
async def update_listing_pricing(
    listing_id: int,
    # TODO: Create pricing DTO
    # pricing_data: PricingUpdateDTO,
):
    """Update pricing (seasonal/dynamic) for a listing"""
    # TODO: Implement pricing management use case
    return {"ok": True, "message": "Pricing updated", "listing_id": listing_id}
