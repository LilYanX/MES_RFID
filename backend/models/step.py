from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")

class StepBase(BaseModel):
    step_name: str
    reader_type: str
    description: Optional[str] = None

class StepCreate(StepBase):
    pass

class StepUpdate(BaseModel):
    step_name: Optional[str] = None
    reader_type: Optional[str] = None
    description: Optional[str] = None

class StepInDB(StepBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    step_id: int
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

    model_config = {
        "populate_by_name": True,
        "json_encoders": {ObjectId: str},
        "from_attributes": True
    }

class StepResponse(StepBase):
    id: str
    step_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {
        "from_attributes": True
    }
