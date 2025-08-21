from pydantic import BaseModel, Field, ConfigDict, HttpUrl
from typing import Optional, Any


class AreaRead(BaseModel):
    id: int
    slug: str
    name: str
    summary: Optional[str] = None
    hero_image_url: Optional[str] = None
    stats: Optional[dict] = None

    model_config = ConfigDict(from_attributes=True)


class AreaCU(BaseModel):
    id: int = 0
    slug: Optional[str] = Field(None, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    name: str = Field(..., min_length=2, max_length=200)
    summary: Optional[str] = Field(None, max_length=1000)
    hero_image_url: Optional[str] = Field(None, max_length=500)
    stats: Optional[dict] = None



