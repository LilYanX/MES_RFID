from fastapi import APIRouter
from db.mongodb import db

router = APIRouter()

@router.get("/historic")
async def get_historic():
    cursor = db["rfid_events"].find().sort("timestamp", -1)
    result = []
    async for doc in cursor:
        result.append({
            "uuid": doc["uuid"],
            "step": doc["step_name"],
            "date": doc["timestamp"],
        })
    return {"historic": result}
