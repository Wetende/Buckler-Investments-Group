"""Pagination utility functions and classes."""

from dataclasses import dataclass
from typing import List, TypeVar, Generic, Optional, Any, Dict
from math import ceil

T = TypeVar('T')


@dataclass
class PaginationParams:
    """Parameters for pagination."""
    
    page: int = 1
    page_size: int = 20
    max_page_size: int = 100
    
    def __post_init__(self):
        """Validate pagination parameters."""
        if self.page < 1:
            self.page = 1
        
        if self.page_size < 1:
            self.page_size = 20
        elif self.page_size > self.max_page_size:
            self.page_size = self.max_page_size
    
    @property
    def offset(self) -> int:
        """Calculate offset for database queries."""
        return (self.page - 1) * self.page_size
    
    @property
    def limit(self) -> int:
        """Get limit for database queries."""
        return self.page_size


@dataclass
class PaginationResult(Generic[T]):
    """Result of paginated query."""
    
    items: List[T]
    total_count: int
    page: int
    page_size: int
    
    @property
    def total_pages(self) -> int:
        """Calculate total number of pages."""
        return ceil(self.total_count / self.page_size) if self.page_size > 0 else 0
    
    @property
    def has_next(self) -> bool:
        """Check if there's a next page."""
        return self.page < self.total_pages
    
    @property
    def has_previous(self) -> bool:
        """Check if there's a previous page."""
        return self.page > 1
    
    @property
    def next_page(self) -> Optional[int]:
        """Get next page number."""
        return self.page + 1 if self.has_next else None
    
    @property
    def previous_page(self) -> Optional[int]:
        """Get previous page number."""
        return self.page - 1 if self.has_previous else None
    
    @property
    def start_index(self) -> int:
        """Get starting index of items on current page."""
        return (self.page - 1) * self.page_size + 1 if self.items else 0
    
    @property
    def end_index(self) -> int:
        """Get ending index of items on current page."""
        return min(self.page * self.page_size, self.total_count) if self.items else 0
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert pagination result to dictionary."""
        return {
            "items": self.items,
            "pagination": {
                "total_count": self.total_count,
                "total_pages": self.total_pages,
                "current_page": self.page,
                "page_size": self.page_size,
                "has_next": self.has_next,
                "has_previous": self.has_previous,
                "next_page": self.next_page,
                "previous_page": self.previous_page,
                "start_index": self.start_index,
                "end_index": self.end_index,
            }
        }


def paginate_query(
    query: Any,  # SQLAlchemy query object
    params: PaginationParams
) -> PaginationResult:
    """
    Paginate a SQLAlchemy query.
    
    Args:
        query: SQLAlchemy query object
        params: Pagination parameters
        
    Returns:
        PaginationResult with items and metadata
    """
    # Get total count
    total_count = query.count()
    
    # Apply pagination to query
    items = query.offset(params.offset).limit(params.limit).all()
    
    return PaginationResult(
        items=items,
        total_count=total_count,
        page=params.page,
        page_size=params.page_size
    )


def paginate_list(
    items: List[T], 
    params: PaginationParams
) -> PaginationResult[T]:
    """
    Paginate a list in memory.
    
    Args:
        items: List of items to paginate
        params: Pagination parameters
        
    Returns:
        PaginationResult with paginated items
    """
    total_count = len(items)
    start = params.offset
    end = start + params.page_size
    
    paginated_items = items[start:end]
    
    return PaginationResult(
        items=paginated_items,
        total_count=total_count,
        page=params.page,
        page_size=params.page_size
    )


class CursorPagination:
    """Cursor-based pagination for better performance on large datasets."""
    
    def __init__(self, cursor_field: str = "id", page_size: int = 20):
        self.cursor_field = cursor_field
        self.page_size = page_size
    
    def paginate_forward(
        self, 
        query: Any, 
        after_cursor: Optional[Any] = None
    ) -> Dict[str, Any]:
        """
        Paginate forward from a cursor.
        
        Args:
            query: SQLAlchemy query
            after_cursor: Cursor to start after
            
        Returns:
            Dict with items and pagination info
        """
        if after_cursor is not None:
            query = query.filter(
                getattr(query.column_descriptions[0]['type'], self.cursor_field) > after_cursor
            )
        
        # Get one extra item to check if there's a next page
        items = query.limit(self.page_size + 1).all()
        
        has_next = len(items) > self.page_size
        if has_next:
            items = items[:-1]  # Remove the extra item
        
        next_cursor = getattr(items[-1], self.cursor_field) if items else None
        
        return {
            "items": items,
            "has_next": has_next,
            "next_cursor": next_cursor,
            "page_size": self.page_size
        }
    
    def paginate_backward(
        self, 
        query: Any, 
        before_cursor: Any
    ) -> Dict[str, Any]:
        """
        Paginate backward from a cursor.
        
        Args:
            query: SQLAlchemy query
            before_cursor: Cursor to start before
            
        Returns:
            Dict with items and pagination info
        """
        query = query.filter(
            getattr(query.column_descriptions[0]['type'], self.cursor_field) < before_cursor
        ).order_by(getattr(query.column_descriptions[0]['type'], self.cursor_field).desc())
        
        # Get one extra item to check if there's a previous page
        items = query.limit(self.page_size + 1).all()
        
        has_previous = len(items) > self.page_size
        if has_previous:
            items = items[:-1]  # Remove the extra item
        
        # Reverse to maintain original order
        items = list(reversed(items))
        
        previous_cursor = getattr(items[0], self.cursor_field) if items else None
        
        return {
            "items": items,
            "has_previous": has_previous,
            "previous_cursor": previous_cursor,
            "page_size": self.page_size
        }
