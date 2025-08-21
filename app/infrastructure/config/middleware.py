"""Custom middleware for rate limiting and audit logging.

This module defines:
1. Rate limiting using `slowapi` and Redis backend (memory fallback).
2. Audit logging middleware that records critical requests to the database.

All IDs are integers as per project convention.
"""
from __future__ import annotations

from datetime import datetime, UTC
from typing import Callable, Awaitable

from fastapi import Request, Response
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

from .database import AsyncSessionLocal
from ..database.models.audit_log import AuditLog, AuditAction

# ---------------------------------------------------------------------------
# Rate limiting setup
# ---------------------------------------------------------------------------
# In-memory backend by default; can be switched to Redis by setting env var
def _key_func(request: Request) -> str:
    # Prefer user id if available for authenticated routes; fallback to client host
    try:
        uid = getattr(request.state, "user", None)
        if uid and getattr(uid, "id", None):
            return f"user:{uid.id}"
    except Exception:
        pass
    return request.client.host

limiter = Limiter(key_func=_key_func)

rate_limit_middleware = SlowAPIMiddleware


# ---------------------------------------------------------------------------
# Audit logging middleware
# ---------------------------------------------------------------------------
class AuditLoggingMiddleware(BaseHTTPMiddleware):
    """Persist critical actions to `audit_logs` table for compliance."""

    def __init__(self, app, critical_paths: set[str] | None = None):  # type: ignore[override]
        super().__init__(app)
        self.critical_paths = critical_paths or set()

    async def dispatch(self, request: Request, call_next: Callable[[Request], Awaitable[Response]]):  # type: ignore[override]
        response: Response | None = None
        try:
            response = await call_next(request)
            return response
        finally:
            if self._should_audit(request):
                await self._log_request(request, response)

    def _should_audit(self, request: Request) -> bool:
        path = request.url.path
        if any(path.startswith(p) for p in self.critical_paths):
            return True
        return False

    async def _log_request(self, request: Request, response: Response | None):
        # Use a fresh session for each audit log to avoid conflicts
        try:
            async with AsyncSessionLocal() as session:
                audit_entry = AuditLog(
                    path=request.url.path,
                    method=request.method,
                    status_code=response.status_code if response else 500,
                    user_id=request.state.user.id if hasattr(request.state, "user") and request.state.user else None,  # type: ignore[attr-defined]
                    action=AuditAction.AUTO,
                    created_at=datetime.now(UTC),
                )
                session.add(audit_entry)
                await session.commit()
        except Exception:
            # Silently fail audit logging to not break the main request flow
            pass


# ---------------------------------------------------------------------------
# Error handler for rate limit exceeded
# ---------------------------------------------------------------------------
async def _rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):  # noqa: D401
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded"},
    )
