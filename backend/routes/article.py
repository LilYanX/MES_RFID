from fastapi import APIRouter
from db.mongodb import db
from models.article import ArticleModel

router = APIRouter()

@router.get("/articles")
async def get_all_articles():
    cursor = db["rfid_events"].find()
    result = []
    async for doc in cursor:
        result.append({
            "uuid": doc["uuid"],
            "step_id": doc["step_id"],
            "step_name": doc["step_name"],
            "timestamp": doc["timestamp"],
        })
    return result

@router.get("/articles/in-progress")
async def articles_in_progress():
    pipeline = [
        {"$sort": {"timestamp": -1}},
        {"$group": {"_id": "$uuid", "latest": {"$first": "$$ROOT"}}},
        {"$replaceRoot": {"newRoot": "$latest"}}
    ]
    result = await db["rfid_events"].aggregate(pipeline).to_list(length=None)
    return result

@router.get("/articles/{uuid}/history")
async def get_article_history(uuid: str):
    cursor = db["rfid_events"].find({"uuid": uuid}).sort("timestamp", 1)
    result = []
    async for doc in cursor:
        result.append({
            "step_id": doc["step_id"],
            "step_name": doc["step_name"],
            "timestamp": doc["timestamp"],
            "reader_type": doc["reader_type"],
            "operator": doc.get("operator", "Unknown")
        })
    return result

@router.get("/articles/count/in-progress")
async def count_articles_in_process():
    pipeline = [
        {"$sort": {"timestamp": -1}},
        {"$group": {"_id": "$uuid", "latest": {"$first": "$$ROOT"}}},
        {"$replaceRoot": {"newRoot": "$latest"}},
        {"$match": {"step_id": {"$ne": 8}}},  # 8 = step de fin
        {"$count": "articles_in_process"}
    ]
    result = await db["rfid_events"].aggregate(pipeline).to_list(length=1)
    return result[0] if result else {"articles_in_process": 0}
