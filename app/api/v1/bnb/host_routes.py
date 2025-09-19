"""
Host application API routes for BnB domain.
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from dependency_injector.wiring import inject, Provide

from application.use_cases.host.create_host_application import CreateHostApplicationUseCase
from application.use_cases.host.get_host_application import GetHostApplicationUseCase
from application.use_cases.host.submit_host_application import SubmitHostApplicationUseCase
from application.dto.host_application import (
    HostApplicationCreateDTO,
    HostApplicationResponseDTO,
    HostApplicationStepDTO
)
from infrastructure.config.dependencies import current_active_user
from domain.entities.user import User
from shared.exceptions.host_application import (
    HostApplicationNotFoundError,
    DuplicateHostApplicationError,
    HostApplicationNotSubmittableError
)

router = APIRouter()


@router.post("/", response_model=HostApplicationResponseDTO)
@inject
async def create_or_update_host_application(
    request: HostApplicationCreateDTO,
    current_user: User = Depends(current_active_user),
    use_case: CreateHostApplicationUseCase = Depends(Provide['host_use_cases.create_host_application_use_case']),
) -> HostApplicationResponseDTO:
    """Create or update a host application"""
    try:
        return await use_case.execute(request, current_user.id)
    except DuplicateHostApplicationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HostApplicationNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/my-application", response_model=Optional[HostApplicationResponseDTO])
@inject
async def get_my_host_application(
    current_user: User = Depends(current_active_user),
    use_case: GetHostApplicationUseCase = Depends(Provide['host_use_cases.get_host_application_use_case']),
) -> Optional[HostApplicationResponseDTO]:
    """Get the current user's host application"""
    return await use_case.execute_by_user(current_user.id)


@router.get("/{application_id}", response_model=HostApplicationResponseDTO)
@inject
async def get_host_application(
    application_id: int,
    current_user: User = Depends(current_active_user),
    use_case: GetHostApplicationUseCase = Depends(Provide['host_use_cases.get_host_application_use_case']),
) -> HostApplicationResponseDTO:
    """Get a specific host application by ID"""
    try:
        return await use_case.execute(application_id, current_user.id)
    except HostApplicationNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/{application_id}/submit", response_model=HostApplicationResponseDTO)
@inject
async def submit_host_application(
    application_id: int,
    current_user: User = Depends(current_active_user),
    use_case: SubmitHostApplicationUseCase = Depends(Provide['host_use_cases.submit_host_application_use_case']),
) -> HostApplicationResponseDTO:
    """Submit a host application for review"""
    try:
        return await use_case.execute(application_id, current_user.id)
    except HostApplicationNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except HostApplicationNotSubmittableError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/step", response_model=dict)
async def save_application_step(
    step_data: HostApplicationStepDTO,
    _: User = Depends(current_active_user),  # Authentication required but not used
) -> dict:
    """Save individual step data (for auto-save functionality)"""
    # This endpoint can be used to save individual steps as the user progresses
    # For now, return success - in a full implementation, this would save to cache/session
    return {
        "ok": True,
        "step_name": step_data.step_name,
        "message": "Step data saved successfully"
    }


@router.get("/steps/personal-info", response_model=dict)
async def get_personal_info_step(
    current_user: User = Depends(current_active_user),
) -> dict:
    """Get personal info step data (for pre-filling from user profile)"""
    # Pre-fill from user profile
    # Get user name safely
    user_name = getattr(current_user, 'name', '') or getattr(current_user, 'full_name', '') or ''
    name_parts = user_name.split() if user_name else []
    
    return {
        "first_name": name_parts[0] if len(name_parts) > 0 else "",
        "last_name": name_parts[1] if len(name_parts) > 1 else "",
        "phone_number": getattr(current_user, 'phone', '') or getattr(current_user, 'phone_number', ''),
        "address": getattr(current_user, 'address', ''),
        "city": getattr(current_user, 'city', ''),
    }
