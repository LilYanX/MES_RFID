from fastapi import Request, APIRouter, Header, HTTPException
from typing import List
import os
import uuid
from db.mongodb import db
from fastapi.responses import JSONResponse
from bson import ObjectId

router = APIRouter()

#get all inventory list
@router.get("/list")
async def list_inventory():
    inventory = await db["rfid_events"].find().to_list(length=None)
    # Convertir tous les ObjectId en string
    def fix_objectid(doc):
        if not doc:
            return doc
        for k, v in doc.items():
            if isinstance(v, ObjectId):
                doc[k] = str(v)
            elif isinstance(v, dict):
                fix_objectid(v)
        return doc
    inventory = [fix_objectid(event) for event in inventory]
    filtered_inventory = [
        {
            "reference": event.get("reference", ""),
            "uuid": event.get("uuid", ""),
            "step_name": event.get("step_name", "")
        }
        for event in inventory
        if event.get("reference") and event.get("uuid") and event.get("step_name")
    ]
    return JSONResponse(content={"inventory": filtered_inventory})


#get each step of an article
@router.get("/list/{step_name}")
async def get_inventory_by_step(step_name: str):
    valid_steps = [
        "Collection & Intake",
        "Automated Sorting",
        "Pre-treatment",
        "Wash Processing",
        "Thermal Drying",
        "Quality Assurance",
        "Packaging & Dispatch",
        "Delivery & Confirmation"
    ]
    if step_name not in valid_steps:
        raise HTTPException(status_code=400, detail="Invalid step id")
    inventory = await db["rfid_events"].find({"step_name": step_name}).to_list(length=None)
    def fix_objectid(doc):
        if not doc:
            return doc
        for k, v in doc.items():
            if isinstance(v, ObjectId):
                doc[k] = str(v)
            elif isinstance(v, dict):
                fix_objectid(v)
        return doc
    inventory = [fix_objectid(event) for event in inventory]
    filtered_inventory = [
        {
            "reference": event.get("reference", ""),
            "uuid": event.get("uuid", ""),
            "step_name": event.get("step_name", "")
        }
        for event in inventory
        if event.get("reference") and event.get("uuid") and event.get("step_name")
    ]
    return JSONResponse(content={"inventory": filtered_inventory})


@router.get("/steps")
async def get_steps():
    steps = await db["process_steps"].find().sort("step_id", 1).to_list(length=None)
    return [step["step_name"] for step in steps if "step_name" in step]





    