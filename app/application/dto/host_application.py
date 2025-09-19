"""
Host application DTOs for the become a host feature.
"""
from datetime import datetime
from typing import Optional, List
from decimal import Decimal
from pydantic import BaseModel, ConfigDict, Field, validator
from enum import Enum


class PropertyType(str, Enum):
    """Types of properties a host can offer"""
    APARTMENT = "apartment"
    HOUSE = "house"
    VILLA = "villa"
    STUDIO = "studio"
    ROOM = "room"
    SHARED_ROOM = "shared_room"
    UNIQUE = "unique"


class HostingExperience(str, Enum):
    """Host's experience level"""
    BEGINNER = "beginner"
    SOME_EXPERIENCE = "some_experience"
    EXPERIENCED = "experienced"
    PROFESSIONAL = "professional"


class ApplicationStatus(str, Enum):
    """Status of host application"""
    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    REQUIRES_CHANGES = "requires_changes"


class PersonalInfoDTO(BaseModel):
    """Step 1: Personal Information"""
    first_name: str = Field(min_length=2, max_length=50)
    last_name: str = Field(min_length=2, max_length=50)
    date_of_birth: str = Field(description="YYYY-MM-DD format")
    phone_number: str = Field(min_length=10, max_length=15)
    national_id: str = Field(min_length=6, max_length=20)
    address: str = Field(min_length=10, max_length=200)
    city: str = Field(min_length=2, max_length=50)
    emergency_contact_name: str = Field(min_length=2, max_length=100)
    emergency_contact_phone: str = Field(min_length=10, max_length=15)

    @validator('phone_number', 'emergency_contact_phone')
    @classmethod
    def validate_kenyan_phone(cls, v):
        # Basic Kenyan phone validation
        import re
        pattern = r'^(\+254|254|0)?[7][0-9]{8}$'
        if not re.match(pattern, v):
            raise ValueError('Invalid Kenyan phone number format')
        return v

    model_config = ConfigDict(from_attributes=True)


class PropertyDetailsDTO(BaseModel):
    """Step 2: Property Details"""
    property_type: PropertyType
    property_title: str = Field(min_length=10, max_length=100)
    property_description: str = Field(min_length=50, max_length=1000)
    property_address: str = Field(min_length=10, max_length=200)
    property_city: str = Field(min_length=2, max_length=50)
    bedrooms: int = Field(ge=0, le=20)
    bathrooms: int = Field(ge=1, le=10)
    max_guests: int = Field(ge=1, le=30)
    square_meters: Optional[int] = Field(None, ge=10, le=10000)
    amenities: List[str] = Field(default=[], max_items=20)
    house_rules: Optional[List[str]] = Field(default=[], max_items=10)
    
    model_config = ConfigDict(from_attributes=True)


class PricingAvailabilityDTO(BaseModel):
    """Step 3: Pricing and Availability"""
    base_price_per_night: Decimal = Field(gt=0, le=1000000, decimal_places=2)
    currency: str = Field(default="KES", max_length=3)
    cleaning_fee: Optional[Decimal] = Field(None, ge=0, le=50000, decimal_places=2)
    security_deposit: Optional[Decimal] = Field(None, ge=0, le=100000, decimal_places=2)
    minimum_nights: int = Field(ge=1, le=365, default=1)
    maximum_nights: int = Field(ge=1, le=365, default=30)
    instant_booking: bool = Field(default=False)
    available_from: str = Field(description="YYYY-MM-DD format")
    available_until: Optional[str] = Field(None, description="YYYY-MM-DD format")
    blocked_dates: Optional[List[str]] = Field(default=[], description="List of blocked dates in YYYY-MM-DD format")
    
    @validator('maximum_nights')
    @classmethod
    def validate_max_nights(cls, v, values):
        if 'minimum_nights' in values and v < values['minimum_nights']:
            raise ValueError('Maximum nights must be greater than or equal to minimum nights')
        return v

    model_config = ConfigDict(from_attributes=True)


class HostingExperienceDTO(BaseModel):
    """Step 4: Hosting Experience and Motivation"""
    hosting_experience: HostingExperience
    previous_hosting_platforms: Optional[List[str]] = Field(default=[], max_items=5)
    why_hosting: str = Field(min_length=50, max_length=500, description="Why do you want to become a host?")
    special_features: Optional[str] = Field(None, max_length=300, description="What makes your property special?")
    local_recommendations: Optional[str] = Field(None, max_length=500, description="Local area recommendations")
    languages_spoken: List[str] = Field(default=[], max_items=10)
    
    model_config = ConfigDict(from_attributes=True)


class DocumentsDTO(BaseModel):
    """Step 5: Required Documents"""
    id_document_url: str = Field(description="URL to uploaded ID document")
    property_ownership_proof_url: Optional[str] = Field(None, description="Property ownership/lease document")
    business_license_url: Optional[str] = Field(None, description="Business license if applicable")
    tax_compliance_url: Optional[str] = Field(None, description="Tax compliance certificate")
    additional_documents: Optional[List[str]] = Field(default=[], max_items=5)
    
    model_config = ConfigDict(from_attributes=True)


class HostApplicationCreateDTO(BaseModel):
    """Complete host application data"""
    id: int = Field(default=0, description="0 for create, positive for update")
    
    # All steps combined
    personal_info: PersonalInfoDTO
    property_details: PropertyDetailsDTO
    pricing_availability: PricingAvailabilityDTO
    hosting_experience: HostingExperienceDTO
    documents: DocumentsDTO
    
    # Additional fields
    terms_accepted: bool = Field(description="User has accepted terms and conditions")
    privacy_policy_accepted: bool = Field(description="User has accepted privacy policy")
    marketing_emails_consent: bool = Field(default=False, description="Consent to receive marketing emails")
    
    @validator('terms_accepted', 'privacy_policy_accepted')
    @classmethod
    def validate_required_acceptance(cls, v):
        if not v:
            raise ValueError('Required terms must be accepted')
        return v

    model_config = ConfigDict(from_attributes=True)


class HostApplicationResponseDTO(BaseModel):
    """Host application response"""
    id: int
    user_id: int
    status: ApplicationStatus
    
    # Application data
    personal_info: PersonalInfoDTO
    property_details: PropertyDetailsDTO
    pricing_availability: PricingAvailabilityDTO
    hosting_experience: HostingExperienceDTO
    documents: DocumentsDTO
    
    # Metadata
    terms_accepted: bool
    privacy_policy_accepted: bool
    marketing_emails_consent: bool
    submitted_at: Optional[datetime] = None
    reviewed_at: Optional[datetime] = None
    approved_at: Optional[datetime] = None
    rejection_reason: Optional[str] = None
    admin_notes: Optional[str] = None
    
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class HostApplicationStepDTO(BaseModel):
    """For saving individual steps"""
    id: int = Field(default=0)
    step_name: str = Field(description="Step identifier: personal_info, property_details, etc.")
    step_data: dict = Field(description="Step-specific data as JSON")
    
    model_config = ConfigDict(from_attributes=True)


class HostApplicationListDTO(BaseModel):
    """Simplified host application for listing"""
    id: int
    user_id: int
    status: ApplicationStatus
    property_title: str
    property_type: PropertyType
    property_city: str
    base_price_per_night: Decimal
    submitted_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
