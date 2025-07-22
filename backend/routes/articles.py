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

@router.get("/articles/{reference}", tags=["Articles"])
async def get_article(reference: str):
    doc = await db["articles"].find_one({"reference": reference})
    if not doc:
        return {"message": "Not found"}
    doc["_id"] = str(doc["_id"])
    return doc

@router.get("/rfid_events/{reference}", tags=["Articles"])
async def get_rfid_events(reference: str):
    cursor = db["rfid_events"].find({"reference": reference}).sort("timestamp", 1)
    result = []
    async for doc in cursor:
        result.append({
            "uuid": doc.get("uuid"),
            "step_id": doc.get("step_id"),
            "step_name": doc.get("step_name"),
            "timestamp": doc.get("timestamp"),
            "reader_type": doc.get("reader_type"),
            "operator": doc.get("operator", "Unknown")
        })
    return result
