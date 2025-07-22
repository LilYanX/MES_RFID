from fastapi import APIRouter
from pymongo import MongoClient
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://admin:G0%40tDesEchecs@dbrfid.ojrspq8.mongodb.net/?retryWrites=true&w=majority&appName=DBRFID")
DB_NAME = os.getenv("DB_NAME", "mes_rfid")
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "portals")

@router.get("/portals", tags=["portals"])
def get_portals():
    """Retourne la liste des portails RFID"""
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    collection = db[COLLECTION_NAME]
    portals = list(collection.find({}, {"_id": 0}))  # cacher l'_id MongoDB
    return JSONResponse(content=portals)
