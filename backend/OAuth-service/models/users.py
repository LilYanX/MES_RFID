from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserModel(BaseModel):
    uuid: str
    username: str
    first_name: str
    last_name: str
    password_hash: str
    email: str
    role: str
    created_at: datetime
    updated_at: datetime
    is_admin: bool

