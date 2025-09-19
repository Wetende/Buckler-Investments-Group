"""
Use case for creating and updating host applications.
"""
from datetime import datetime
# Remove unused import
from domain.entities.host_application import HostApplication
from domain.repositories.host_application import HostApplicationRepository
from application.dto.host_application import (
    HostApplicationCreateDTO, 
    HostApplicationResponseDTO,
    ApplicationStatus
)
from shared.exceptions.host_application import (
    HostApplicationNotFoundError,
    DuplicateHostApplicationError
)


class CreateHostApplicationUseCase:
    """Use case for creating and updating host applications"""
    
    def __init__(self, host_application_repository: HostApplicationRepository):
        self._host_application_repository = host_application_repository
    
    async def execute(self, request: HostApplicationCreateDTO, user_id: int) -> HostApplicationResponseDTO:
        """Create or update a host application"""
        
        if request.id == 0:
            # Create new application
            return await self._create_application(request, user_id)
        else:
            # Update existing application
            return await self._update_application(request, user_id)
    
    async def _create_application(self, request: HostApplicationCreateDTO, user_id: int) -> HostApplicationResponseDTO:
        """Create a new host application"""
        
        # Check if user already has an application
        existing_application = await self._host_application_repository.get_by_user_id(user_id)
        if existing_application:
            raise DuplicateHostApplicationError("User already has a host application")
        
        # Prepare application data
        application_data = {
            "personal_info": request.personal_info.model_dump(),
            "property_details": request.property_details.model_dump(),
            "pricing_availability": request.pricing_availability.model_dump(),
            "hosting_experience": request.hosting_experience.model_dump(),
            "documents": request.documents.model_dump(),
        }
        
        # Create domain entity
        application = HostApplication(
            id=0,  # Will be set by repository
            user_id=user_id,
            status=ApplicationStatus.DRAFT.value,
            application_data=application_data,
            terms_accepted=request.terms_accepted,
            privacy_policy_accepted=request.privacy_policy_accepted,
            marketing_emails_consent=request.marketing_emails_consent,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        # Save to repository
        saved_application = await self._host_application_repository.create(application)
        
        # Convert to response DTO
        return self._entity_to_response_dto(saved_application)
    
    async def _update_application(self, request: HostApplicationCreateDTO, user_id: int) -> HostApplicationResponseDTO:
        """Update an existing host application"""
        
        # Get existing application
        existing_application = await self._host_application_repository.get_by_id(request.id)
        if not existing_application:
            raise HostApplicationNotFoundError(f"Host application with ID {request.id} not found")
        
        # Verify ownership
        if existing_application.user_id != user_id:
            raise HostApplicationNotFoundError("Host application not found")
        
        # Check if application can be edited
        if not existing_application.is_editable():
            raise ValueError(f"Cannot edit application in {existing_application.status} status")
        
        # Update application data
        application_data = {
            "personal_info": request.personal_info.model_dump(),
            "property_details": request.property_details.model_dump(),
            "pricing_availability": request.pricing_availability.model_dump(),
            "hosting_experience": request.hosting_experience.model_dump(),
            "documents": request.documents.model_dump(),
        }
        
        # Update the entity
        existing_application.application_data = application_data
        existing_application.terms_accepted = request.terms_accepted
        existing_application.privacy_policy_accepted = request.privacy_policy_accepted
        existing_application.marketing_emails_consent = request.marketing_emails_consent
        existing_application.updated_at = datetime.utcnow()
        
        # Save to repository
        updated_application = await self._host_application_repository.update(existing_application)
        
        # Convert to response DTO
        return self._entity_to_response_dto(updated_application)
    
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
