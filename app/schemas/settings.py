"""Pydantic schemas for system & website settings."""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional

class _BaseSetting(BaseModel):
    key: str = Field(..., max_length=100)
    value: str
    description: Optional[str] = None

class SystemSettingCreateUpdate(_BaseSetting):
    id: int = 0

class WebsiteSettingCreateUpdate(_BaseSetting):
    id: int = 0

class SystemSettingResponse(_BaseSetting):
    id: int

    model_config = ConfigDict(from_attributes=True)

class WebsiteSettingResponse(_BaseSetting):
    id: int

    model_config = ConfigDict(from_attributes=True)
