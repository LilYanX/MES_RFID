from fastapi import APIRouter
from db.mongodb import db

router = APIRouter()

@router.get("/articles", tags=["Articles"])
async def get_all_articles():
    cursor = db["articles"].find()
    result = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        result.append(doc)
    return result

@router.get("/articles/{uuid}", tags=["Articles"])
async def get_article(uuid: str):
    doc = await db["articles"].find_one({"uuid": uuid})
    if not doc:
        return {"message": "Not found"}
    doc["_id"] = str(doc["_id"])
    return doc

@router.get("/rfid_events/{uuid}", tags=["Articles"])
async def get_rfid_events(uuid: str):
    cursor = db["rfid_events"].find({"uuid": uuid}).sort("timestamp", 1)
    result = []
    async for doc in cursor:
        result.append({
            "step_id": doc.get("step_id"),
            "step_name": doc.get("step_name"),
            "timestamp": doc.get("timestamp"),
            "reader_type": doc.get("reader_type"),
            "operator": doc.get("operator", "Unknown")
        })
    return result
