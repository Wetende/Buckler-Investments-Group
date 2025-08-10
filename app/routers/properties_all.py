from __future__ import annotations

from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_async_session
from core.dependencies import require_agent_or_admin
from core.config import settings
from models import Property, PropertyStatusLog, PropertyStatus
from schemas.property_schemas import (
    PaginatedPropertyResponse,
    PropertySummaryResponse,
    PropertyDetailResponse,
    PropertyCreateUpdate as AdminPropertyCU,
)
from schemas.property import PropertyCreateUpdate as AgentPropertyCU
from models.user import User, UserRole


router = APIRouter(tags=["Properties"])


# Public list/detail -----------------------------------------------------------
@router.get("/api/v1/public/properties", response_model=PaginatedPropertyResponse)
async def list_properties(
    page_size: int = Query(20, ge=1, le=100),
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
    project_id: Optional[int] = None,
    session: AsyncSession = Depends(get_async_session),
):
    conditions = [Property.status == status]
    if property_type_id:
        conditions.append(Property.property_type_id == property_type_id)
    if project_id is not None:
        conditions.append(Property.project_id == project_id)
    if min_price is not None:
        conditions.append(Property.price >= min_price)
    if max_price is not None:
        conditions.append(Property.price <= max_price)
    if min_bedrooms is not None:
        conditions.append(Property.bedrooms >= min_bedrooms)
    if min_bathrooms is not None:
        conditions.append(Property.bathrooms >= min_bathrooms)

    def decode_cursor(cursor: Optional[str]) -> Optional[int]:
        if not cursor:
            return None
        import base64, json
        try:
            payload = json.loads(base64.urlsafe_b64decode(cursor.encode()).decode())
            return int(payload.get("last_id"))
        except Exception:
            return None

    last_id = decode_cursor(cursor)
    if last_id is not None:
        conditions.append(Property.id > last_id)

    if latitude is not None and longitude is not None and radius is not None:
        all_props_stmt = select(Property).where(and_(*conditions))
        all_props_res = await session.execute(all_props_stmt)
        all_props = all_props_res.scalars().all()
        from math import radians, cos, sin, asin, sqrt
        def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
            lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
            dlon, dlat = lon2 - lon1, lat2 - lat1
            a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
            return 6371 * (2 * asin(sqrt(a)))
        props = [p for p in all_props if p.latitude is not None and p.longitude is not None and haversine(latitude, longitude, p.latitude, p.longitude) <= radius]
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

    kes_per_usd = Decimal(str(getattr(settings, "KES_PER_USD", 130.0)))
    items = []
    for p in props:
        price_usd = (p.price / kes_per_usd).quantize(Decimal("0.01")) if p.price else None
        items.append(PropertySummaryResponse(
            id=p.id,
            title=p.title,
            price=p.price,
            price_usd=price_usd,
            address=p.address,
            main_image_url=(p.images[0] if p.images else None),
            bedrooms=p.bedrooms,
            bathrooms=p.bathrooms,
        ))

    def encode_cursor(last_id: int) -> str:
        import base64, json
        return base64.urlsafe_b64encode(json.dumps({"last_id": last_id}).encode()).decode()

    return PaginatedPropertyResponse(
        items=items,
        cursor=encode_cursor(props[-1].id) if props and has_more else None,
        has_more=has_more,
    )


@router.get("/api/v1/public/properties/{property_id}", response_model=PropertyDetailResponse)
async def get_property_detail(property_id: int, session: AsyncSession = Depends(get_async_session)):
    res = await session.execute(select(Property).where(Property.id == property_id))
    prop = res.scalar_one_or_none()
    if prop is None or prop.status != PropertyStatus.AVAILABLE:
        raise HTTPException(status_code=404, detail="Property not found")
    kes_per_usd = Decimal(str(getattr(settings, "KES_PER_USD", 130.0)))
    price_usd = (prop.price / kes_per_usd).quantize(Decimal("0.01")) if prop.price else None
    return PropertyDetailResponse(
        id=prop.id,
        title=prop.title,
        price=prop.price,
        price_usd=price_usd,
        address=prop.address,
        main_image_url=(prop.images[0] if prop.images else None),
        bedrooms=prop.bedrooms,
        bathrooms=prop.bathrooms,
        description=prop.description,
        status=prop.status,
        latitude=prop.latitude,
        longitude=prop.longitude,
        amenities=prop.amenities,
        images=prop.images,
        agent_id=prop.agent_id,
        created_at=prop.created_at,
        updated_at=prop.updated_at,
    )


@router.get("/api/v1/public/properties/recently-listed", response_model=PaginatedPropertyResponse)
async def recently_listed(page_size: int = Query(20, ge=1, le=100), cursor: Optional[str] = Query(None), session: AsyncSession = Depends(get_async_session)):
    def decode_cursor(cursor: Optional[str]) -> Optional[int]:
        if not cursor:
            return None
        import base64, json
        try:
            payload = json.loads(base64.urlsafe_b64decode(cursor.encode()).decode())
            return int(payload.get("last_id"))
        except Exception:
            return None
    last_id = decode_cursor(cursor)
    conditions = [Property.status == PropertyStatus.AVAILABLE]
    if last_id:
        conditions.append(Property.id > last_id)
    stmt = select(Property).where(and_(*conditions)).order_by(Property.created_at.desc()).limit(page_size + 1)
    res = await session.execute(stmt)
    props = res.scalars().all()
    kes_per_usd = Decimal(str(getattr(settings, "KES_PER_USD", 130.0)))
    items = []
    for p in props[:page_size]:
        price_usd = (p.price / kes_per_usd).quantize(Decimal("0.01")) if p.price else None
        items.append(PropertySummaryResponse(
            id=p.id,
            title=p.title,
            price=p.price,
            price_usd=price_usd,
            address=p.address,
            main_image_url=(p.images[0] if p.images else None),
            bedrooms=p.bedrooms,
            bathrooms=p.bathrooms,
        ))
    has_more = len(props) > page_size
    def encode_cursor(last_id: int) -> str:
        import base64, json
        return base64.urlsafe_b64encode(json.dumps({"last_id": last_id}).encode()).decode()
    return PaginatedPropertyResponse(items=items, cursor=encode_cursor(props[page_size - 1].id) if props and has_more else None, has_more=has_more)


# Admin create/update/delete ---------------------------------------------------
@router.post("/api/v1/admin/properties", response_model=PropertyDetailResponse)
async def create_or_update_property_admin(
    payload: AdminPropertyCU,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(require_agent_or_admin),
):
    if payload.id == 0:
        slug = (payload.title or "").lower().replace(" ", "-")
        # Ensure unique slug
        base_slug, slug_candidate, n = slug, slug, 1
        while True:
            if (await session.execute(select(Property).where(Property.slug == slug_candidate))).scalar_one_or_none() is None:
                break
            slug_candidate = f"{base_slug}-{n}"
            n += 1
        new_prop = Property(
            **payload.model_dump(exclude={"id"}, exclude_none=True),
            agent_id=user.id if user.role == UserRole.AGENT else getattr(payload, "agent_id", None) or user.id,
            slug=slug_candidate,
        )
        session.add(new_prop)
        await session.commit()
        await session.refresh(new_prop)
        return new_prop

    prop = (await session.execute(select(Property).where(Property.id == payload.id))).scalar_one_or_none()
    if prop is None:
        raise HTTPException(status_code=404, detail="Property not found")
    if user.role != UserRole.ADMIN and prop.agent_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")
    old_status = prop.status
    for field, value in payload.model_dump(exclude_unset=True, exclude={"id"}).items():
        setattr(prop, field, value)
    if getattr(payload, "status", None) and payload.status != old_status:
        log = PropertyStatusLog(property_id=prop.id, old_status=old_status, new_status=payload.status, changed_by_user_id=user.id)
        session.add(log)
    await session.commit()
    await session.refresh(prop)
    return prop


@router.get("/api/v1/admin/properties/{property_id}/delete", response_model=dict)
async def delete_property_admin(property_id: int, session: AsyncSession = Depends(get_async_session), user: User = Depends(require_agent_or_admin)):
    prop = (await session.execute(select(Property).where(Property.id == property_id))).scalar_one_or_none()
    if prop is None:
        raise HTTPException(status_code=404, detail="Property not found")
    if user.role != UserRole.ADMIN and prop.agent_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")
    await session.delete(prop)
    await session.commit()
    return {"detail": "Property deleted"}



