"""User management routes - moved and consolidated from user/routes.py and profile.py"""
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from dependency_injector.wiring import inject, Provide
from sqlalchemy.ext.asyncio import AsyncSession

from application.dto.user import UserCreateDTO, UserResponseDTO, UserRead
from application.use_cases.user.create_user import CreateUserUseCase
from api.containers import AppContainer
from infrastructure.config.auth import get_current_active_user
from infrastructure.config.database import get_async_session
from infrastructure.config.dependencies import current_active_user
from domain.entities.user import User
from shared.exceptions.user import UserAlreadyExistsError

router = APIRouter()

@router.post("/", response_model=UserResponseDTO, status_code=status.HTTP_201_CREATED)
@inject
async def create_user(
    user_data: UserCreateDTO,
    use_case: CreateUserUseCase = Depends(Provide[AppContainer.user_use_cases.create_user_use_case]),
) -> UserResponseDTO:
    """Create a new user account."""
    try:
        return await use_case.execute(user_data)
    except UserAlreadyExistsError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/me", response_model=UserResponseDTO)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)],
) -> UserResponseDTO:
    """Get current user profile."""
    return UserResponseDTO(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        is_active=current_user.is_active,
        roles=[role.name for role in current_user.roles]
    )

@router.get("/profile", response_model=UserRead)
async def get_profile(
    user: User = Depends(current_active_user)
):
    """Get user profile (alternative endpoint)."""
    return user

@router.post("/profile", response_model=UserRead)
async def update_profile(
    payload: UserRead,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """Update user profile."""
    for field, value in payload.model_dump(exclude={"id"}).items():
        if value is not None:
            setattr(user, field, value)
    await session.commit()
    await session.refresh(user)
    return user
