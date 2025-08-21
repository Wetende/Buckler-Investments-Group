from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from dependency_injector.wiring import inject, Provide
from sqlalchemy.ext.asyncio import AsyncSession

from application.dto.user import UserCreateDTO, UserResponseDTO, Token
from application.use_cases.user.create_user import CreateUserUseCase
from ...containers import AppContainer
from infrastructure.config.auth import authenticate_user, create_access_token, get_current_active_user
from infrastructure.config.database import get_async_session
from domain.entities.user import User
from shared.exceptions.user import UserAlreadyExistsError

router = APIRouter()

@router.post("/", response_model=UserResponseDTO, status_code=status.HTTP_201_CREATED)
@inject
async def create_user(
    user_data: UserCreateDTO,
    use_case: CreateUserUseCase = Depends(Provide[AppContainer.user_use_cases.create_user_use_case]),
) -> UserResponseDTO:
    try:
        return await use_case.execute(user_data)
    except UserAlreadyExistsError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: AsyncSession = Depends(get_async_session),
):
    user = await authenticate_user(session, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponseDTO)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)],
) -> UserResponseDTO:
    return UserResponseDTO(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        is_active=current_user.is_active,
        roles=[role.name for role in current_user.roles]
    )
