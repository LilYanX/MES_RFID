from fastapi import APIRouter
from db.mongodb import db

router = APIRouter()

from fastapi import APIRouter, Body
from db.mongodb import db
from datetime import datetime

router = APIRouter()

@router.get("/steps", tags=["Steps"])
async def get_steps():
    cursor = db["process_steps"].find().sort("step_id", 1)
    steps = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        steps.append(doc)
    return {"steps": steps}

@router.post("/steps", tags=["Steps"])
async def add_step(step_id: int = Body(...), step_name: str = Body(...), reader_type: str = Body(...)):
    step = {
        "step_id": step_id,
        "step_name": step_name,
        "reader_type": reader_type,
        "created_at": datetime.utcnow()
    }
    result = await db["process_steps"].insert_one(step)
    step["_id"] = str(result.inserted_id)
    return step

@router.delete("/steps/{step_id}", tags=["Steps"])
async def delete_step(step_id: int):
    result = await db["process_steps"].delete_one({"step_id": step_id})
    return {"deleted_count": result.deleted_count}
