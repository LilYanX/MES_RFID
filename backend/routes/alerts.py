from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from bson import ObjectId
from pymongo import ReturnDocument
from datetime import datetime

from models.alert import (
    AlertRuleCreate, AlertRuleUpdate, AlertRuleResponse,
    NotificationChannelCreate, NotificationChannelResponse,
    AlertInstanceResponse, AlertSeverity
)
from database import get_db
# from routes.users import get_current_active_user  # supprimé, gestion auth via OAuth

router = APIRouter(
    prefix="/alerts",
    tags=["Alerts & Notifications"],
    responses={404: {"description": "Not found"}},
)

# Helper function to convert MongoDB document to response model
def convert_doc(doc):
    if not doc:
        return None
    doc["id"] = str(doc["_id"])
    doc.pop("_id")
    return doc

# Alert Rules Endpoints

@router.get("/rules", response_model=List[AlertRuleResponse])
async def get_alert_rules(
    skip: int = 0, 
    limit: int = 100,
    db=Depends(get_db)
):
    rules = []
    cursor = db["alert_rules"].find().skip(skip).limit(limit)
    async for rule in cursor:
        rules.append(convert_doc(rule))
    return rules

@router.post("/rules", response_model=AlertRuleResponse, status_code=201)
async def create_alert_rule(
    rule: AlertRuleCreate, 
    db=Depends(get_db)
):
    existing_rule = await db["alert_rules"].find_one({"name": rule.name})
    if existing_rule:
        raise HTTPException(400, detail=f"Alert rule '{rule.name}' already exists")
    
    rule_dict = rule.dict()
    rule_dict.update({
        "created_by": "anonymous", # Assuming anonymous user for public access
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    })
    
    result = await db["alert_rules"].insert_one(rule_dict)
    created_rule = await db["alert_rules"].find_one({"_id": result.inserted_id})
    return convert_doc(created_rule)

@router.get("/rules/{rule_id}", response_model=AlertRuleResponse)
async def get_alert_rule(
    rule_id: str, 
    db=Depends(get_db)
):
    try:
        rule = await db["alert_rules"].find_one({"_id": ObjectId(rule_id)})
    except:
        raise HTTPException(400, detail="Invalid rule ID format")
    
    if not rule:
        raise HTTPException(404, detail="Alert rule not found")
    
    return convert_doc(rule)

@router.put("/rules/{rule_id}", response_model=AlertRuleResponse)
async def update_alert_rule(
    rule_id: str, 
    rule_update: AlertRuleUpdate, 
    db=Depends(get_db)
):
    try:
        existing_rule = await db["alert_rules"].find_one({"_id": ObjectId(rule_id)})
    except:
        raise HTTPException(400, detail="Invalid rule ID format")
    
    if not existing_rule:
        raise HTTPException(404, detail="Alert rule not found")
    
    update_data = rule_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    updated_rule = await db["alert_rules"].find_one_and_update(
        {"_id": ObjectId(rule_id)},
        {"$set": update_data},
        return_document=ReturnDocument.AFTER
    )
    
    return convert_doc(updated_rule)

@router.delete("/rules/{rule_id}", status_code=204)
async def delete_alert_rule(
    rule_id: str, 
    db=Depends(get_db)
):
    try:
        result = await db["alert_rules"].delete_one({"_id": ObjectId(rule_id)})
    except:
        raise HTTPException(400, detail="Invalid rule ID format")
    
    if result.deleted_count == 0:
        raise HTTPException(404, detail="Alert rule not found")
    
    return None

# Notification Channels Endpoints

@router.get("/channels", response_model=List[NotificationChannelResponse])
async def get_notification_channels(
    skip: int = 0, 
    limit: int = 100,
    db=Depends(get_db)
):
    channels = []
    cursor = db["notification_channels"].find().skip(skip).limit(limit)
    async for channel in cursor:
        channels.append(convert_doc(channel))
    return channels

@router.post("/channels", response_model=NotificationChannelResponse, status_code=201)
async def create_notification_channel(
    channel: NotificationChannelCreate, 
    db=Depends(get_db)
):
    channel_dict = channel.dict()
    channel_dict.update({
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    })
    
    result = await db["notification_channels"].insert_one(channel_dict)
    created_channel = await db["notification_channels"].find_one({"_id": result.inserted_id})
    return convert_doc(created_channel)

@router.get("/channels/{channel_id}", response_model=NotificationChannelResponse)
async def get_notification_channel(
    channel_id: str,
    db=Depends(get_db)
):
    try:
        channel = await db["notification_channels"].find_one({"_id": ObjectId(channel_id)})
    except:
        raise HTTPException(400, detail="Invalid channel ID format")
    
    if not channel:
        raise HTTPException(404, detail="Notification channel not found")
    
    return convert_doc(channel)

@router.put("/channels/{channel_id}", response_model=NotificationChannelResponse)
async def update_notification_channel(
    channel_id: str,
    channel_update: NotificationChannelCreate,
    db=Depends(get_db)
):
    update_data = channel_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    try:
        updated_channel = await db["notification_channels"].find_one_and_update(
            {"_id": ObjectId(channel_id)},
            {"$set": update_data},
            return_document=ReturnDocument.AFTER
        )
    except:
        raise HTTPException(400, detail="Invalid channel ID format")
    
    if not updated_channel:
        raise HTTPException(404, detail="Notification channel not found")
    
    return convert_doc(updated_channel)

@router.delete("/channels/{channel_id}", status_code=204)
async def delete_notification_channel(
    channel_id: str,
    db=Depends(get_db)
):
    try:
        result = await db["notification_channels"].delete_one({"_id": ObjectId(channel_id)})
    except:
        raise HTTPException(400, detail="Invalid channel ID format")
    
    if result.deleted_count == 0:
        raise HTTPException(404, detail="Notification channel not found")
    
    return None

# Alert Instances Endpoints

@router.get("/instances", response_model=List[AlertInstanceResponse])
async def get_alert_instances(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    severity: Optional[AlertSeverity] = None,
    db=Depends(get_db)
):
    query = {}
    if status:
        query["status"] = status
    if severity:
        query["severity"] = severity
    
    alerts = []
    cursor = db["alert_instances"].find(query).sort("created_at", -1).skip(skip).limit(limit)
    async for alert in cursor:
        alerts.append(convert_doc(alert))
    return alerts

@router.post("/instances/{alert_id}/acknowledge", response_model=AlertInstanceResponse)
async def acknowledge_alert(
    alert_id: str,
    db=Depends(get_db)
):
    try:
        updated_alert = await db["alert_instances"].find_one_and_update(
            {"_id": ObjectId(alert_id)},
            {
                "$set": {
                    "status": "acknowledged",
                    "acknowledged_by": "anonymous", # Assuming anonymous user for public access
                    "acknowledged_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            },
            return_document=ReturnDocument.AFTER
        )
    except:
        raise HTTPException(400, detail="Invalid alert ID format")
    
    if not updated_alert:
        raise HTTPException(404, detail="Alert not found")
    
    return convert_doc(updated_alert)
