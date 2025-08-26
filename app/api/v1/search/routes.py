from fastapi import APIRouter, Query
from typing import List, Dict, Any, Optional
from datetime import date

router = APIRouter()

@router.post("/all", response_model=Dict[str, Any])
async def unified_search(
    query: str = Query(..., description="Search query"),
    location: Optional[str] = Query(None, description="Location filter"),
    check_in: Optional[date] = Query(None, description="Check-in date"),
    check_out: Optional[date] = Query(None, description="Check-out date"),
    guests: Optional[int] = Query(None, description="Number of guests"),
    min_price: Optional[float] = Query(None, description="Minimum price"),
    max_price: Optional[float] = Query(None, description="Maximum price"),
    categories: List[str] = Query([], description="Categories to search in: bnb, tours, cars, properties"),
    limit: int = Query(20, ge=1, le=100),
):
    """Unified search across BnB, Tours, Cars, and Properties"""
    # TODO: Implement unified search logic
    # This should:
    # 1. Search across all enabled domains
    # 2. Rank and sort results by relevance
    # 3. Apply filters consistently
    # 4. Return structured results
    
    if not categories:
        categories = ["bnb", "tours", "cars", "properties"]
    
    results = {
        "query": query,
        "total_results": 45,
        "categories_searched": categories,
        "results": {
            "bnb": [
                {
                    "id": 1,
                    "type": "bnb",
                    "title": "Luxury Beach Villa",
                    "location": "Diani Beach, Kenya",
                    "price": 8500.0,
                    "currency": "KES",
                    "rating": 4.8,
                    "image": "/images/villa1.jpg",
                    "capacity": 6,
                    "instant_book": True
                },
                {
                    "id": 2,
                    "type": "bnb", 
                    "title": "Safari Lodge",
                    "location": "Maasai Mara, Kenya",
                    "price": 12000.0,
                    "currency": "KES",
                    "rating": 4.9,
                    "image": "/images/lodge1.jpg",
                    "capacity": 4,
                    "instant_book": False
                }
            ] if "bnb" in categories else [],
            "tours": [
                {
                    "id": 1,
                    "type": "tour",
                    "title": "Maasai Mara Safari",
                    "location": "Maasai Mara, Kenya",
                    "price": 15000.0,
                    "currency": "KES", 
                    "rating": 4.7,
                    "image": "/images/safari1.jpg",
                    "duration_hours": 48,
                    "max_participants": 8
                },
                {
                    "id": 2,
                    "type": "tour",
                    "title": "Cultural Heritage Tour",
                    "location": "Nairobi, Kenya",
                    "price": 5000.0,
                    "currency": "KES",
                    "rating": 4.5,
                    "image": "/images/culture1.jpg",
                    "duration_hours": 6,
                    "max_participants": 15
                }
            ] if "tours" in categories else [],
            "cars": [
                {
                    "id": 1,
                    "type": "car",
                    "title": "Toyota Land Cruiser",
                    "location": "Nairobi, Kenya",
                    "price": 8000.0,
                    "currency": "KES",
                    "rating": 4.6,
                    "image": "/images/landcruiser.jpg",
                    "seats": 7,
                    "transmission": "Manual"
                }
            ] if "cars" in categories else [],
            "properties": [
                {
                    "id": 1,
                    "type": "property",
                    "title": "Modern Apartment in Westlands",
                    "location": "Westlands, Nairobi",
                    "price": 12500000.0,
                    "currency": "KES",
                    "rating": 4.4,
                    "image": "/images/apartment1.jpg",
                    "bedrooms": 3,
                    "property_type": "Apartment"
                }
            ] if "properties" in categories else []
        },
        "filters_applied": {
            "location": location,
            "check_in": check_in.isoformat() if check_in else None,
            "check_out": check_out.isoformat() if check_out else None,
            "guests": guests,
            "price_range": {
                "min": min_price,
                "max": max_price
            }
        },
        "suggestions": [
            "Beach resorts in Diani",
            "Safari packages in Maasai Mara", 
            "City tours in Nairobi",
            "Luxury villas with pool"
        ]
    }
    
    return results

@router.get("/suggestions", response_model=List[str])
async def get_search_suggestions(
    query: str = Query(..., min_length=2, description="Partial search query"),
    limit: int = Query(10, ge=1, le=20)
):
    """Get search suggestions/autocomplete based on query"""
    # TODO: Implement intelligent search suggestions
    # This should:
    # 1. Analyze popular searches
    # 2. Include location suggestions
    # 3. Include activity/service suggestions
    # 4. Use fuzzy matching
    
    suggestions = [
        f"Safari tours in {query}",
        f"Beach resorts near {query}",
        f"City tours in {query}",
        f"Car rentals in {query}",
        f"Hotels in {query}",
        f"Luxury villas {query}",
        f"Budget accommodation {query}",
        f"Cultural tours {query}",
        f"Adventure activities {query}",
        f"Family-friendly {query}"
    ]
    
    return suggestions[:limit]

@router.get("/trending", response_model=Dict[str, Any])
async def get_trending_searches():
    """Get trending search terms and popular destinations"""
    # TODO: Implement trending analysis
    return {
        "trending_destinations": [
            {"name": "Maasai Mara", "category": "safari", "searches": 1250},
            {"name": "Diani Beach", "category": "beach", "searches": 980},
            {"name": "Nairobi City", "category": "urban", "searches": 875},
            {"name": "Mount Kenya", "category": "adventure", "searches": 650},
            {"name": "Lamu Island", "category": "culture", "searches": 520}
        ],
        "trending_keywords": [
            {"term": "safari packages", "searches": 2100},
            {"term": "beach villa", "searches": 1800},
            {"term": "budget accommodation", "searches": 1600},
            {"term": "car rental nairobi", "searches": 1400},
            {"term": "cultural tours", "searches": 1200}
        ],
        "popular_filters": [
            {"filter": "instant_book", "usage": 0.65},
            {"filter": "free_cancellation", "usage": 0.58},
            {"filter": "pet_friendly", "usage": 0.32},
            {"filter": "wifi_included", "usage": 0.78},
            {"filter": "pool_access", "usage": 0.45}
        ]
    }

@router.get("/filters", response_model=Dict[str, Any])
async def get_available_filters():
    """Get all available search filters for the unified search"""
    return {
        "location_filters": {
            "regions": ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"],
            "areas": ["Westlands", "Karen", "Diani", "Nyali", "Kilifi"],
            "landmarks": ["JKIA", "City Center", "Beach Front", "National Parks"]
        },
        "price_filters": {
            "currency": "KES",
            "ranges": [
                {"label": "Budget", "min": 0, "max": 5000},
                {"label": "Mid-range", "min": 5000, "max": 15000},
                {"label": "Luxury", "min": 15000, "max": 50000},
                {"label": "Premium", "min": 50000, "max": null}
            ]
        },
        "amenity_filters": {
            "bnb": ["WiFi", "Pool", "Parking", "Kitchen", "AC", "Pet Friendly"],
            "tours": ["Guide Included", "Transport", "Meals", "Equipment", "Insurance"],
            "cars": ["GPS", "Driver", "Insurance", "Fuel", "Child Seats"],
            "properties": ["Furnished", "Security", "Parking", "Garden", "Balcony"]
        },
        "rating_filters": [
            {"label": "4+ stars", "min_rating": 4.0},
            {"label": "3+ stars", "min_rating": 3.0},
            {"label": "Any rating", "min_rating": 0.0}
        ]
    }
