"""ArticleCategory model for grouping articles."""
from __future__ import annotations

from sqlalchemy import Integer, String, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ...config.database import Base
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from .article import Article

class ArticleCategory(Base):
    """Category for blog/news articles."""

    __tablename__ = "article_categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    articles: Mapped[List["Article"]] = relationship("Article", back_populates="category")

    __table_args__ = (Index("idx_article_category_name", "name"),)
