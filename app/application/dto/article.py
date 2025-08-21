"""Pydantic schemas for Article model."""
from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, Field, ConfigDict

class ArticleBase(BaseModel):
    title: str = Field(..., max_length=250)
    slug: str = Field(..., max_length=250)
    content: str

class ArticleCreate(ArticleBase):
    id: int = Field(0, description="Must be 0 when creating new article")
    is_published: bool = True

class ArticleUpdate(BaseModel):
    id: int = Field(..., gt=0)
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    is_published: Optional[bool] = None

class ArticleSummary(BaseModel):
    id: int
    title: str
    slug: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ArticleDetail(ArticleSummary):
    content: str
    is_published: bool
    updated_at: datetime
    author_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)
