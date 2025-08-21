"""Pydantic schemas for notification templates & provider configs."""
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict

class Channel(str, Enum):
    EMAIL = "EMAIL"
    SMS = "SMS"

class NotificationTemplateBase(BaseModel):
    key: str = Field(..., max_length=100)
    channel: Channel
    subject: Optional[str] = None
    body: str

class NotificationTemplateCU(NotificationTemplateBase):
    id: int = 0

class NotificationTemplateOut(NotificationTemplateBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class ProviderType(str, Enum):
    EMAIL = "EMAIL"
    SMS = "SMS"

class ProviderConfigBase(BaseModel):
    provider_type: ProviderType
    name: str
    api_key: str
    settings: Optional[dict] = None


class ProviderConfigCU(ProviderConfigBase):
    id: int = 0

class ProviderConfigOut(ProviderConfigBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
