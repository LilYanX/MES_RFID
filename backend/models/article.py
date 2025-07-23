from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ArticleModel(BaseModel):
    uuid: str
    name: str
    type: str
    color: str
    size: str
    material: str
    washing_time_min: int
    drying_time_min: int
    pre_treatment: str
    care_label: str
    dispatch_zone: str
    quality_requirements: str
    notes: str
    sales_price_ron: Optional[float] = None
    length_cm: Optional[float] = None
    hight_cm: Optional[float] = None
    step_id: Optional[int] = None
    step_name: Optional[str] = None
    reader_type: Optional[str] = None
    operator: Optional[str] = "Unknown"
    timestamp: Optional[datetime] = None
