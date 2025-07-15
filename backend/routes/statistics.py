from fastapi import APIRouter
from db.mongodb import db

router = APIRouter()

@router.get("/stats", tags=["Statistics"])
async def get_stats():
    # Statistiques globales
    total = await db["rfid_events"].count_documents({})
    in_progress = await db["rfid_events"].count_documents({"step_id": {"$ne": 8}})  # 8 = étape finale
    finished = await db["rfid_events"].count_documents({"step_id": 8})
    # Répartition par étape
    pipeline = [
        {"$group": {"_id": "$step_name", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    by_step = await db["rfid_events"].aggregate(pipeline).to_list(length=None)
    return {
        "total": total,
        "in_progress": in_progress,
        "finished": finished,
        "by_step": by_step
    }
