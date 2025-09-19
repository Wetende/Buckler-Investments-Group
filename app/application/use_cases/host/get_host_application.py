"""
Use case for getting host applications.
"""
from typing import Optional
from domain.entities.host_application import HostApplication
from domain.repositories.host_application import HostApplicationRepository
from application.dto.host_application import (
    HostApplicationResponseDTO,
    ApplicationStatus
)
from shared.exceptions.host_application import HostApplicationNotFoundError


class GetHostApplicationUseCase:
    """Use case for retrieving host applications"""
    
    def __init__(self, host_application_repository: HostApplicationRepository):
        self._host_application_repository = host_application_repository
    
    async def execute(self, application_id: int, user_id: int) -> HostApplicationResponseDTO:
        """Get a host application by ID"""
        
        application = await self._host_application_repository.get_by_id(application_id)
        if not application:
            raise HostApplicationNotFoundError(f"Host application with ID {application_id} not found")
        
        # Verify ownership (users can only see their own applications)
        if application.user_id != user_id:
            raise HostApplicationNotFoundError("Host application not found")
        
        return self._entity_to_response_dto(application)
    
    async def execute_by_user(self, user_id: int) -> Optional[HostApplicationResponseDTO]:
        """Get a user's host application"""
        
        application = await self._host_application_repository.get_by_user_id(user_id)
        if not application:
            return None
        
        return self._entity_to_response_dto(application)
    
    def _entity_to_response_dto(self, application: HostApplication) -> HostApplicationResponseDTO:
        """Convert domain entity to response DTO"""
        
        app_data = application.application_data
        
        return HostApplicationResponseDTO(
            id=application.id,
            user_id=application.user_id,
            status=ApplicationStatus(application.status),
            personal_info=app_data.get("personal_info", {}),
            property_details=app_data.get("property_details", {}),
            pricing_availability=app_data.get("pricing_availability", {}),
            hosting_experience=app_data.get("hosting_experience", {}),
            documents=app_data.get("documents", {}),
            terms_accepted=application.terms_accepted,
            privacy_policy_accepted=application.privacy_policy_accepted,
            marketing_emails_consent=application.marketing_emails_consent,
            submitted_at=application.submitted_at,
            reviewed_at=application.reviewed_at,
            approved_at=application.approved_at,
            rejection_reason=application.rejection_reason,
            admin_notes=application.admin_notes,
            created_at=application.created_at,
            updated_at=application.updated_at
        )
