from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class PortalStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    MAINTENANCE = "maintenance"

class PortalBase(BaseModel):
    portal_id: str
    name: str
    location: str
    step_id: int
    ip_address: str
    port: int = 8080
    status: PortalStatus = PortalStatus.ACTIVE

class PortalCreate(PortalBase):
    pass

class PortalUpdate(BaseModel):
    portal_id: Optional[str] = None
    name: Optional[str] = None
    location: Optional[str] = None
    step_id: Optional[int] = None
    ip_address: Optional[str] = None
    port: Optional[int] = None
    status: Optional[PortalStatus] = None

class PortalResponse(PortalBase):
    _id: str
    last_seen: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
