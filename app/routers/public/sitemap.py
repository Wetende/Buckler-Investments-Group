from __future__ import annotations

from datetime import datetime
from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_async_session
from models import Property, Project, Article, AreaProfile


router = APIRouter(tags=["Sitemap"])


@router.get("/sitemap.xml", response_class=Response)
async def sitemap(session: AsyncSession = Depends(get_async_session)):
    urls: list[str] = []
    base = "https://example.com"  # TODO: move to settings
    # Properties
    props = (await session.execute(select(Property.slug))).scalars().all()
    urls += [f"<url><loc>{base}/properties/{s}</loc></url>" for s in props]
    # Projects
    projs = (await session.execute(select(Project.slug))).scalars().all()
    urls += [f"<url><loc>{base}/projects/{s}</loc></url>" for s in projs]
    # Articles
    arts = (await session.execute(select(Article.slug))).scalars().all()
    urls += [f"<url><loc>{base}/articles/{s}</loc></url>" for s in arts]
    # Areas
    areas = (await session.execute(select(AreaProfile.slug))).scalars().all()
    urls += [f"<url><loc>{base}/areas/{s}</loc></url>" for s in areas]
    xml = f"<?xml version='1.0' encoding='UTF-8'?><urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'>{''.join(urls)}</urlset>"
    return Response(content=xml, media_type="application/xml")



