"""
Host Application domain entity.
"""
from datetime import datetime
from typing import Optional, Dict, Any
from dataclasses import dataclass


@dataclass
class HostApplication:
    """
    Host application domain entity representing a user's application to become a host.
    """
    id: int
    user_id: int
    status: str  # ApplicationStatus enum value
    
    # Application data stored as JSON/dict
    application_data: Dict[str, Any]
    
    # Legal acceptance
    terms_accepted: bool
    privacy_policy_accepted: bool
    marketing_emails_consent: bool = False
    
    # Timestamps
    submitted_at: Optional[datetime] = None
    reviewed_at: Optional[datetime] = None
    approved_at: Optional[datetime] = None
    
    # Admin fields
    rejection_reason: Optional[str] = None
    admin_notes: Optional[str] = None
    reviewer_id: Optional[int] = None
    
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    def submit(self) -> None:
        """Submit the application for review"""
        if self.status != "draft":
            raise ValueError("Can only submit draft applications")
        
        if not self.terms_accepted or not self.privacy_policy_accepted:
            raise ValueError("Terms and privacy policy must be accepted before submission")
        
        if not self._is_complete():
            raise ValueError("Application must be complete before submission")
        
        self.status = "submitted"
        self.submitted_at = datetime.utcnow()
    
    def approve(self, admin_id: int, notes: Optional[str] = None) -> None:
        """Approve the application"""
        if self.status not in ["submitted", "under_review", "requires_changes"]:
            raise ValueError("Can only approve submitted applications")
        
        self.status = "approved"
        self.approved_at = datetime.utcnow()
        self.reviewed_at = datetime.utcnow()
        self.reviewer_id = admin_id
        if notes:
            self.admin_notes = notes
    
    def reject(self, admin_id: int, reason: str, notes: Optional[str] = None) -> None:
        """Reject the application"""
        if self.status not in ["submitted", "under_review", "requires_changes"]:
            raise ValueError("Can only reject submitted applications")
        
        if not reason:
            raise ValueError("Rejection reason is required")
        
        self.status = "rejected"
        self.rejection_reason = reason
        self.reviewed_at = datetime.utcnow()
        self.reviewer_id = admin_id
        if notes:
            self.admin_notes = notes
    
    def request_changes(self, admin_id: int, reason: str, notes: Optional[str] = None) -> None:
        """Request changes to the application"""
        if self.status not in ["submitted", "under_review"]:
            raise ValueError("Can only request changes for submitted applications")
        
        if not reason:
            raise ValueError("Reason for changes is required")
        
        self.status = "requires_changes"
        self.rejection_reason = reason
        self.reviewed_at = datetime.utcnow()
        self.reviewer_id = admin_id
        if notes:
            self.admin_notes = notes
    
    def is_editable(self) -> bool:
        """Check if the application can be edited"""
        return self.status in ["draft", "requires_changes"]
    
    def is_reviewable(self) -> bool:
        """Check if the application can be reviewed by admin"""
        return self.status in ["submitted", "under_review"]
    
    def _is_complete(self) -> bool:
        """Check if all required application data is present"""
        required_sections = [
            "personal_info",
            "property_details", 
            "pricing_availability",
            "hosting_experience",
            "documents"
        ]
        
        for section in required_sections:
            if section not in self.application_data:
                return False
            
            section_data = self.application_data[section]
            if not section_data or not isinstance(section_data, dict):
                return False
        
        # Check for required fields in each section
        if not self._validate_personal_info():
            return False
        if not self._validate_property_details():
            return False
        if not self._validate_pricing():
            return False
        if not self._validate_hosting_experience():
            return False
        if not self._validate_documents():
            return False
        
        return True
    
    def _validate_personal_info(self) -> bool:
        """Validate personal info section"""
        personal_info = self.application_data.get("personal_info", {})
        required_fields = [
            "first_name", "last_name", "date_of_birth", "phone_number",
            "national_id", "address", "city", "emergency_contact_name", "emergency_contact_phone"
        ]
        return all(field in personal_info and personal_info[field] for field in required_fields)
    
    def _validate_property_details(self) -> bool:
        """Validate property details section"""
        property_details = self.application_data.get("property_details", {})
        required_fields = [
            "property_type", "property_title", "property_description",
            "property_address", "property_city", "bedrooms", "bathrooms", "max_guests"
        ]
        return all(field in property_details and property_details[field] is not None for field in required_fields)
    
    def _validate_pricing(self) -> bool:
        """Validate pricing and availability section"""
        pricing = self.application_data.get("pricing_availability", {})
        required_fields = ["base_price_per_night", "minimum_nights", "maximum_nights", "available_from"]
        return all(field in pricing and pricing[field] is not None for field in required_fields)
    
    def _validate_hosting_experience(self) -> bool:
        """Validate hosting experience section"""
        experience = self.application_data.get("hosting_experience", {})
        required_fields = ["hosting_experience", "why_hosting"]
        return all(field in experience and experience[field] for field in required_fields)
    
    def _validate_documents(self) -> bool:
        """Validate documents section"""
        documents = self.application_data.get("documents", {})
        # At minimum, ID document is required
        return "id_document_url" in documents and documents["id_document_url"]
    
    def get_property_title(self) -> str:
        """Get the property title from application data"""
        return self.application_data.get("property_details", {}).get("property_title", "")
    
    def get_property_type(self) -> str:
        """Get the property type from application data"""
        return self.application_data.get("property_details", {}).get("property_type", "")
    
    def get_property_city(self) -> str:
        """Get the property city from application data"""
        return self.application_data.get("property_details", {}).get("property_city", "")
    
    def get_base_price(self) -> float:
        """Get the base price from application data"""
        return float(self.application_data.get("pricing_availability", {}).get("base_price_per_night", 0))
