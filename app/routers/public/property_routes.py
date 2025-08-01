"""Public property listing and detail endpoints."""
from __future__ import annotations

import base64
import json
from decimal import Decimal
from math import radians, cos, sin, asin, sqrt
from typing import List, Optional, Tuple

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, and_, or_, func
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_async_session
from models import Property, PropertyStatus
from schemas.property_schemas import PaginatedPropertyResponse, PropertySummaryResponse, PropertyDetailResponse

router = APIRouter(prefix="/api/v1/public/properties", tags=["Properties (Public)"])

DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100


def decode_cursor(cursor: Optional[str]) -> Optional[int]:
    if not cursor:
        return None
    try:
        decoded = base64.urlsafe_b64decode(cursor.encode()).decode()
        payload = json.loads(decoded)
        return int(payload.get("last_id"))
    except Exception:
        return None


def encode_cursor(last_id: int) -> str:
    payload = json.dumps({"last_id": last_id}).encode()
    return base64.urlsafe_b64encode(payload).decode()


def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Return distance in km between two lat/long points."""
    # convert decimal degrees to radians
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    # haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * asin(sqrt(a))
    km = 6371 * c
    return km


@router.get("/", response_model=PaginatedPropertyResponse)
async def list_properties(
    page_size: int = Query(DEFAULT_PAGE_SIZE, ge=1, le=MAX_PAGE_SIZE),
    cursor: Optional[str] = Query(None),
    property_type_id: Optional[int] = None,
    min_price: Optional[Decimal] = None,
    max_price: Optional[Decimal] = None,
    status: PropertyStatus = PropertyStatus.AVAILABLE,
    min_bedrooms: Optional[int] = Query(None, ge=0),
    min_bathrooms: Optional[int] = Query(None, ge=0),
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    radius: Optional[int] = Query(None, description="Search radius in km"),
    sort_by: str = Query("newest", pattern="^(price_asc|price_desc|newest)$"),
    session: AsyncSession = Depends(get_async_session),
):
    """Return paginated list of properties with filters and simple cursor pagination."""

    conditions = [Property.status == status]

    if property_type_id:
        conditions.append(Property.property_type_id == property_type_id)
    if min_price is not None:
        conditions.append(Property.price >= min_price)
    if max_price is not None:
        conditions.append(Property.price <= max_price)
    if min_bedrooms is not None:
        conditions.append(Property.bedrooms >= min_bedrooms)
    if min_bathrooms is not None:
        conditions.append(Property.bathrooms >= min_bathrooms)

    last_id = decode_cursor(cursor)
    if last_id:
        conditions.append(Property.id > last_id)

    # Geospatial search
    if latitude is not None and longitude is not None and radius is not None:
        # This is a simplified distance calculation. For production, use PostGIS.
        # Calculate distance for all properties and filter.
        # This is inefficient and should be optimized with a spatial index.
        all_props_stmt = select(Property).where(and_(*conditions))
        all_props_res = await session.execute(all_props_stmt)
        all_props = all_props_res.scalars().all()

        filtered_props = []
        for prop in all_props:
            if prop.latitude is not None and prop.longitude is not None:
                distance = haversine(latitude, longitude, prop.latitude, prop.longitude)
                if distance <= radius:
                    filtered_props.append(prop)
        props = filtered_props
    else:
        stmt = select(Property).where(and_(*conditions))
        if sort_by == "price_asc":
            stmt = stmt.order_by(Property.price.asc())
        elif sort_by == "price_desc":
            stmt = stmt.order_by(Property.price.desc())
        else:
            stmt = stmt.order_by(Property.created_at.desc())

        stmt = stmt.limit(page_size + 1)
        res = await session.execute(stmt)
        props = res.scalars().all()

    has_more = len(props) > page_size
    if has_more:
        props = props[:-1]

    items = [
        PropertySummaryResponse(
            id=p.id,
            title=p.title,
            price=p.price,
            address=p.address,
            main_image_url=(p.images[0] if p.images else None),
            bedrooms=p.bedrooms,
            bathrooms=p.bathrooms,
        )
        for p in props
    ]

    return PaginatedPropertyResponse(
        items=items,
        cursor=encode_cursor(props[-1].id) if props and has_more else None,
        has_more=has_more,
    )


@router.get("/{property_id}", response_model=PropertyDetailResponse)
async def get_property_detail(
    property_id: int,
    session: AsyncSession = Depends(get_async_session),
):
    stmt = select(Property).where(Property.id == property_id)
    res = await session.execute(stmt)
    prop = res.scalar_one_or_none()
    if prop is None or prop.status != PropertyStatus.AVAILABLE:
        raise HTTPException(status_code=404, detail="Property not found")
    return prop
