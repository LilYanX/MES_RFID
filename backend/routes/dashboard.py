from fastapi import APIRouter
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

router = APIRouter()

client = MongoClient("mongodb+srv://admin:G0%40tDesEchecs@dbrfid.ojrspq8.mongodb.net/?retryWrites=true&w=majority&appName=DBRFID")
db = client["mes_rfid"]
collection = db["rfid_events"]

@router.get("/dashboard", tags=["Events"])
def get_articles_in_process():
    pipeline = [
        {
            "$sort": {"timestamp": -1}
        },
        {
            "$group": {
                "_id": "$uuid",
                "reference": {"$first": "$reference"},
                "latest_step_id": {"$first": "$step_id"},
                "latest_step_name": {"$first": "$step_name"},
                "last_seen": {"$first": "$timestamp"}
            }
        },
        {
            "$sort": {"last_seen": -1}
        }
    ]

    result = list(collection.aggregate(pipeline))

    for doc in result:
        doc["uuid"] = doc["_id"]
        doc["last_seen"] = doc["last_seen"].isoformat()
        del doc["_id"]

    return {
        "total": len(result),
        "articles": result
    }
