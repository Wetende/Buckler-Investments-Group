from pydantic import BaseModel, Field, ConfigDict
from typing import Optional


class DeveloperRead(BaseModel):
    id: int
    slug: str
    name: str
    logo_url: Optional[str] = None
    website_url: Optional[str] = None
    bio: Optional[str] = None
    projects_count: Optional[int] = 0
    properties_count: Optional[int] = 0

    model_config = ConfigDict(from_attributes=True)


class DeveloperCU(BaseModel):
    id: int = 0
    slug: Optional[str] = Field(None, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    name: str = Field(..., min_length=2, max_length=200)
    logo_url: Optional[str] = Field(None, max_length=500)
    website_url: Optional[str] = Field(None, max_length=500)
    bio: Optional[str] = Field(None, max_length=2000)


