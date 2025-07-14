from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ArticleModel(BaseModel):
    uuid: str
    step_id: int
    step_name: str
    reader_type: str
    operator: Optional[str] = "Unknown"
    timestamp: datetime
