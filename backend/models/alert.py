from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class AlertType(str, Enum):
    THRESHOLD = "threshold"
    ANOMALY = "anomaly"
    SYSTEM = "system"
    SECURITY = "security"

class AlertSeverity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class NotificationChannelType(str, Enum):
    EMAIL = "email"
    SMS = "sms"
    WEBHOOK = "webhook"
    SLACK = "slack"

# Alert Rule Models
class AlertRuleBase(BaseModel):
    name: str
    description: str
    type: AlertType
    condition: str
    threshold_value: Optional[float] = None
    enabled: bool = True
    severity: AlertSeverity = AlertSeverity.MEDIUM
    notification_channels: List[str] = []

class AlertRuleCreate(AlertRuleBase):
    pass

class AlertRuleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    type: Optional[AlertType] = None
    condition: Optional[str] = None
    threshold_value: Optional[float] = None
    enabled: Optional[bool] = None
    severity: Optional[AlertSeverity] = None
    notification_channels: Optional[List[str]] = None

class AlertRuleResponse(AlertRuleBase):
    _id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Notification Channel Models
class NotificationChannelBase(BaseModel):
    name: str
    type: NotificationChannelType
    config: Dict[str, Any] = {}
    enabled: bool = True

class NotificationChannelCreate(NotificationChannelBase):
    pass

class NotificationChannelUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[NotificationChannelType] = None
    config: Optional[Dict[str, Any]] = None
    enabled: Optional[bool] = None

class NotificationChannelResponse(NotificationChannelBase):
    _id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Alert Instance Models
class AlertInstanceBase(BaseModel):
    rule_id: str
    message: str
    severity: AlertSeverity
    data: Dict[str, Any] = {}
    acknowledged: bool = False
    acknowledged_by: Optional[str] = None
    acknowledged_at: Optional[datetime] = None

class AlertInstanceCreate(AlertInstanceBase):
    pass

class AlertInstanceResponse(AlertInstanceBase):
    _id: str
    created_at: datetime

    class Config:
        from_attributes = True
