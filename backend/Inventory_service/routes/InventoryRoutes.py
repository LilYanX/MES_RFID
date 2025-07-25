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
    # Récupérer tous les steps pour le mapping step_name -> step_id
    steps = await db["process_steps"].find().to_list(length=None)
    step_name_to_id = {step["step_name"]: step["step_id"] for step in steps if "step_name" in step and "step_id" in step}

    # Charger tous les événements RFID
    inventory = await db["rfid_events"].find().to_list(length=None)
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

    # Ajouter step_id à chaque événement
    for event in inventory:
        event["step_id"] = step_name_to_id.get(event.get("step_name"), -1)

    # Grouper par uuid et ne garder que l'événement avec le plus grand step_id
    latest_by_uuid = {}
    for event in inventory:
        uuid = event.get("uuid")
        if not uuid:
            continue
        if uuid not in latest_by_uuid or event["step_id"] > latest_by_uuid[uuid]["step_id"]:
            latest_by_uuid[uuid] = event

    filtered_inventory = [
        {
            "reference": event.get("reference", ""),
            "uuid": event.get("uuid", ""),
            "step_name": event.get("step_name", "")
        }
        for event in latest_by_uuid.values()
        if event.get("reference") and event.get("uuid") and event.get("step_name")
    ]
    return JSONResponse(content={"inventory": filtered_inventory})


#get each step of an article
@router.get("/list/{step_name}")
async def get_inventory_by_step(step_name: str):
    # Récupérer tous les steps pour le mapping step_name -> step_id
    steps = await db["process_steps"].find().to_list(length=None)
    step_name_to_id = {step["step_name"]: step["step_id"] for step in steps if "step_name" in step and "step_id" in step}

    valid_steps = list(step_name_to_id.keys())
    if step_name not in valid_steps:
        raise HTTPException(status_code=400, detail="Invalid step id")

    # Charger tous les événements RFID
    inventory = await db["rfid_events"].find().to_list(length=None)
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

    # Ajouter step_id à chaque événement
    for event in inventory:
        event["step_id"] = step_name_to_id.get(event.get("step_name"), -1)

    # Grouper par uuid et ne garder que l'événement avec le plus grand step_id
    latest_by_uuid = {}
    for event in inventory:
        uuid = event.get("uuid")
        if not uuid:
            continue
        if uuid not in latest_by_uuid or event["step_id"] > latest_by_uuid[uuid]["step_id"]:
            latest_by_uuid[uuid] = event

    # Ne garder que ceux dont le step_name final correspond à celui demandé
    filtered_inventory = [
        {
            "reference": event.get("reference", ""),
            "uuid": event.get("uuid", ""),
            "step_name": event.get("step_name", "")
        }
        for event in latest_by_uuid.values()
        if event.get("reference") and event.get("uuid") and event.get("step_name") == step_name
    ]
    return JSONResponse(content={"inventory": filtered_inventory})


@router.get("/steps")
async def get_steps():
    steps = await db["process_steps"].find().sort("step_id", 1).to_list(length=None)
    return [step["step_name"] for step in steps if "step_name" in step]





    