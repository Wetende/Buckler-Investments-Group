"""Pydantic schemas for Media model."""
from enum import Enum
from typing import Optional

from pydantic import BaseModel, HttpUrl, Field, ConfigDict

class MediaType(str, Enum):
    """Supported media types."""
    PHOTO = "PHOTO"
    VIDEO = "VIDEO"

class MediaBase(BaseModel):
    url: HttpUrl = Field(..., description="Publicly accessible URL of the media")
    type: MediaType = Field(..., description="Type of media")

class MediaCreate(MediaBase):
    id: int = Field(0, description="Must be 0 when creating a new media record")
    property_id: int = Field(..., ge=1, description="ID of the property this media is linked to")

class MediaResponse(MediaBase):
    id: int
    property_id: int

    model_config = ConfigDict(from_attributes=True)
