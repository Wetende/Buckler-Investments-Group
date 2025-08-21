"""Shared dependency utilities for role and ownership checks.

Exposes:
- `current_active_user`: returns the authenticated user (or raises 401).
- `require_admin`, `require_agent_or_admin`: role-based dependency helpers.
"""

from typing import Callable

from core.auth import get_current_active_user, require_roles
from models.user import UserRole

# Base current-user dependency
current_active_user = get_current_active_user

# Backward-compat alias used in some existing routers
authenticated_user = current_active_user

# Role-based helpers
require_admin: Callable = require_roles(UserRole.ADMIN)
require_agent_or_admin: Callable = require_roles(UserRole.AGENT, UserRole.ADMIN)
