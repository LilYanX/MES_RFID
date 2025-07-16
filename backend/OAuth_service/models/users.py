from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid
from pydantic import Field

class UserModel(BaseModel):
    uuid: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    first_name: str
    last_name: str
    password_hash: str
    email: str
    role: str
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
    is_admin: bool = False

