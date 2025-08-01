"""Public article listing and detail endpoints."""
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_async_session
from models.article import Article
from schemas.article import ArticleSummary, ArticleDetail

router = APIRouter(prefix="/api/v1/public/articles", tags=["Articles (Public)"])

DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100


@router.get("/", response_model=List[ArticleSummary])
async def list_articles(
    page_size: int = Query(DEFAULT_PAGE_SIZE, ge=1, le=MAX_PAGE_SIZE),
    page: int = Query(1, ge=1),
    session: AsyncSession = Depends(get_async_session),
):
    offset = (page - 1) * page_size
    stmt = (
        select(Article)
        .where(Article.is_published.is_(True))
        .order_by(Article.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )
    res = await session.execute(stmt)
    articles = res.scalars().all()
    return articles


@router.get("/{slug}", response_model=ArticleDetail)
async def get_article_detail(
    slug: str,
    session: AsyncSession = Depends(get_async_session),
):
    stmt = select(Article).where(Article.slug == slug, Article.is_published.is_(True))
    res = await session.execute(stmt)
    article = res.scalar_one_or_none()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article
