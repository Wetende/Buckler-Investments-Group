from fastapi import APIRouter, Depends, HTTPException, Query
from dependency_injector.wiring import inject, Provide
from typing import List

from ...containers import AppContainer
from application.use_cases.tours.search_tours import SearchToursUseCase
from application.use_cases.tours.create_tour import CreateTourUseCase
from application.use_cases.tours.get_tour import GetTourUseCase
from application.use_cases.tours.list_tours import ListToursUseCase
from application.use_cases.tours.delete_tour import DeleteTourUseCase
from application.dto.tours import (
    SearchToursRequest,
    TourResponse,
    TourCreateUpdateDTO,
    TourResponseDTO,
    TourCategoryDTO,
    TourAvailabilityItem,
    TourAvailabilityDTO,
    TourPricingUpdateDTO,
)
from shared.exceptions.tours import TourNotFoundError
from domain.repositories.tours import TourAvailabilityRepository

router = APIRouter()

# Search endpoints


@router.post("/search", response_model=List[TourResponse])
@inject
async def search_tours(
    request: SearchToursRequest,
    use_case: SearchToursUseCase = Depends(
        Provide[AppContainer.search_tours_use_case]
    ),
):
    """Search available tours based on criteria"""
    return await use_case.execute(request)

# Public tour endpoints


@router.get("/", response_model=List[TourResponseDTO])
@inject
async def list_tours(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    operator_id: int | None = Query(None),
    max_price: float | None = Query(None),
    use_case: ListToursUseCase = Depends(
        Provide[AppContainer.list_tours_use_case]
    ),
):
    """List all public tours with pagination and optional filters"""
    return await use_case.execute(
        limit=limit,
        offset=offset,
        operator_id=operator_id,
        max_price=max_price,
    )

# Static routes must be defined BEFORE dynamic parameterized routes


@router.get("/featured", response_model=List[TourResponseDTO])
@inject
async def get_featured_tours(
    limit: int = Query(10, ge=1, le=50),
    use_case: ListToursUseCase = Depends(
        Provide[AppContainer.list_tours_use_case]
    ),
):
    """Get featured tours"""
    # TODO: Implement featured logic (e.g., high ratings, promoted)
    return await use_case.execute(limit=limit, offset=0)

 
@router.get("/categories", response_model=List[TourCategoryDTO])
async def get_tour_categories():
    """Get tour categories"""
    # TODO: Implement categories system
    return [
        TourCategoryDTO(
            id=1,
            name="Wildlife Safari",
            description="Safari and wildlife tours",
            tour_count=15,
        ),
        TourCategoryDTO(
            id=2,
            name="Cultural Tours",
            description="Cultural and heritage tours",
            tour_count=8,
        ),
        TourCategoryDTO(
            id=3,
            name="Adventure",
            description="Adventure and outdoor activities",
            tour_count=12,
        ),
        TourCategoryDTO(
            id=4,
            name="Beach & Coast",
            description="Coastal and beach tours",
            tour_count=6,
        ),
        TourCategoryDTO(
            id=5,
            name="City Tours",
            description="Urban and city exploration",
            tour_count=10,
        ),
    ]


@router.get(
    "/categories/{category}/tours",
    response_model=List[TourResponseDTO],
)
@inject
async def get_tours_by_category(
    category: str,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    use_case: ListToursUseCase = Depends(
        Provide[AppContainer.list_tours_use_case]
    ),
):
    """Get tours by category"""
    return await use_case.execute(
        limit=limit,
        offset=offset,
        category=category,
    )


@router.get("/{tour_id}", response_model=TourResponseDTO)
@inject
async def get_tour_details(
    tour_id: int,
    use_case: GetTourUseCase = Depends(
        Provide[AppContainer.get_tour_use_case]
    ),
):
    """Get detailed information about a specific tour"""
    try:
        return await use_case.execute(tour_id)
    except TourNotFoundError:
        raise HTTPException(status_code=404, detail="Tour not found")


@router.get(
    "/{tour_id}/availability",
    response_model=List[TourAvailabilityItem],
)
@inject
async def get_tour_availability(
    tour_id: int,
    start_date: str = Query(..., description="Start date (YYYY-MM-DD)"),
    end_date: str = Query(..., description="End date (YYYY-MM-DD)"),
    use_case: GetTourUseCase = Depends(
        Provide[AppContainer.get_tour_use_case]
    ),
    availability_repo: TourAvailabilityRepository = Depends(
        Provide[AppContainer.tour_availability_repository]
    ),
):
    """Get tour availability for date range"""
    try:
        await use_case.execute(tour_id)  # validates tour exists
        from datetime import date

        start = date.fromisoformat(start_date)
        end = date.fromisoformat(end_date)
        items = await availability_repo.get_range(tour_id, start, end)
        return [
            TourAvailabilityItem(
                date=i.date,
                available_spots=i.available_spots,
                price_override=i.price_override,
            )
            for i in items
        ]
    except TourNotFoundError:
        raise HTTPException(status_code=404, detail="Tour not found")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format")

# (static routes are defined above the dynamic ones)

# Operator/Admin tour management


@router.post("/", response_model=TourResponseDTO)
@inject
async def create_or_update_tour(
    request: TourCreateUpdateDTO,
    use_case: CreateTourUseCase = Depends(
        Provide[AppContainer.create_tour_use_case]
    ),
):
    """Create new tour (id=0) or update existing tour (id>0)"""
    try:
        return await use_case.execute(request)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{tour_id}/delete", response_model=dict)
@inject
async def delete_tour(
    tour_id: int,
    use_case: DeleteTourUseCase = Depends(
        Provide[AppContainer.delete_tour_use_case]
    ),
):
    """Delete a tour (using GET as per platform standards)"""
    try:
        await use_case.execute(tour_id)
        return {"ok": True, "tour_id": tour_id}
    except TourNotFoundError:
        raise HTTPException(status_code=404, detail="Tour not found")


@router.get("/my-tours", response_model=List[TourResponseDTO])
@inject
async def get_my_tours(
    # TODO: Get operator_id from authentication context
    operator_id: int = Query(1, description="Operator ID (from auth context)"),
    use_case: ListToursUseCase = Depends(
        Provide[AppContainer.list_tours_use_case]
    ),
):
    """Get all tours for the authenticated operator"""
    # TODO: Implement operator filtering in use case
    return await use_case.execute(limit=100, offset=0)


@router.post("/{tour_id}/availability", response_model=dict)
@inject
async def update_tour_availability(
    tour_id: int,
    request: TourAvailabilityDTO,
    use_case=Depends(
        Provide[AppContainer.update_tour_availability_use_case]
    ),
):
    """Update tour availability"""
    return await use_case.execute(tour_id, request)


@router.post("/{tour_id}/pricing", response_model=TourResponseDTO)
@inject
async def update_tour_pricing(
    tour_id: int,
    pricing_data: TourPricingUpdateDTO,
    use_case=Depends(
        Provide[AppContainer.update_tour_pricing_use_case]
    ),
):
    """Update tour pricing"""
    return await use_case.execute(tour_id, pricing_data)
