"""Pydantic schemas for system & website settings."""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Iterable

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


# Unified settings payloads for the settings API
class SettingUpdateItem(BaseModel):
    key: str = Field(..., max_length=100)
    value: str


class SystemSettingsUpdate(BaseModel):
    items: List[SettingUpdateItem]


class SystemSettingsOut(BaseModel):
    items: List[SystemSettingResponse]

    @classmethod
    def from_settings(cls, settings: Iterable[object]) -> "SystemSettingsOut":
        # Accept any iterable of ORM objects with attributes matching SystemSettingResponse
        return cls(items=[SystemSettingResponse.model_validate(s) for s in settings])
