from fastapi import APIRouter
from db.mongodb import db

router = APIRouter()

@router.get("/infos/{uuid}")
async def get_article_info(uuid: str):
    doc = await db["article_info"].find_one({"uuid": uuid})
    if not doc:
        return {"message": "Not found"}
    doc["_id"] = str(doc["_id"])  # pour éviter erreur JSON
    return doc
