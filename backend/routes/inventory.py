from fastapi import APIRouter
from db.mongodb import db

router = APIRouter()

@router.get("/inventory", tags=["Events"])
async def get_inventory():
    # Dernier état connu de chaque article
    pipeline = [
        {"$sort": {"timestamp": -1}},
        {"$group": {"_id": "$uuid", "latest": {"$first": "$$ROOT"}}},
        {"$replaceRoot": {"newRoot": "$latest"}}
    ]
    result = await db["rfid_events"].aggregate(pipeline).to_list(length=None)
    # Ajoute infos article
    articles = []
    for doc in result:
        art = await db["articles"].find_one({"uuid": doc["uuid"]})
        articles.append({
            "uuid": doc["uuid"],
            "status": doc["step_name"],
            "last_seen": doc["timestamp"],
            "type": art["type"] if art else None,
            "color": art["color"] if art else None,
            "size": art["size"] if art else None
        })
    return articles
