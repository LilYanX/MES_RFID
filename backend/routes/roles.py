from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models.role import RoleCreate, RoleUpdate, RoleResponse, PermissionResponse
from database import get_db
# from routes.users import get_current_active_user  # supprimé, gestion auth via OAuth
from bson import ObjectId
from datetime import datetime

router = APIRouter()

# Available permissions in the system
AVAILABLE_PERMISSIONS = [
    {"name": "user_management", "description": "Manage users", "category": "Administration"},
    {"name": "role_management", "description": "Manage roles", "category": "Administration"},
    {"name": "step_management", "description": "Manage process steps", "category": "Process"},
    {"name": "portal_management", "description": "Manage RFID portals", "category": "Hardware"},
    {"name": "alert_management", "description": "Manage alerts", "category": "Monitoring"},
    {"name": "view_analytics", "description": "View analytics and reports", "category": "Analytics"},
    {"name": "system_configuration", "description": "Configure system settings", "category": "System"},
    {"name": "audit_logs", "description": "View audit logs", "category": "Security"}
]

@router.get("/permissions", response_model=List[PermissionResponse])
async def get_permissions():
    """Get all available permissions"""
    return AVAILABLE_PERMISSIONS

@router.get("/roles", response_model=List[RoleResponse])
async def get_roles(db=Depends(get_db)):
    """Get all roles"""
    try:
        roles = list(db.roles.find())
        for role in roles:
            role["id"] = str(role["_id"])
            del role["_id"]
        return roles
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/roles", response_model=RoleResponse)
async def create_role(role: RoleCreate, db=Depends(get_db)):
    """Create a new role"""
    try:
        # Check if role name already exists
        existing_role = db.roles.find_one({"name": role.name})
        if existing_role:
            raise HTTPException(status_code=400, detail="Role name already exists")
        
        role_dict = role.dict()
        role_dict["created_at"] = datetime.utcnow()
        role_dict["updated_at"] = None
        
        result = db.roles.insert_one(role_dict)
        created_role = db.roles.find_one({"_id": result.inserted_id})
        created_role["id"] = str(created_role["_id"])
        del created_role["_id"]
        
        return created_role
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/roles/{role_id}", response_model=RoleResponse)
async def get_role(role_id: str, db=Depends(get_db)):
    """Get a specific role"""
    try:
        role = db.roles.find_one({"_id": ObjectId(role_id)})
        if not role:
            raise HTTPException(status_code=404, detail="Role not found")
        
        role["id"] = str(role["_id"])
        del role["_id"]
        return role
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/roles/{role_id}", response_model=RoleResponse)
async def update_role(role_id: str, role_update: RoleUpdate, db=Depends(get_db)):
    """Update a role"""
    try:
        # Check if role exists
        existing_role = db.roles.find_one({"_id": ObjectId(role_id)})
        if not existing_role:
            raise HTTPException(status_code=404, detail="Role not found")
        
        # Check if new name conflicts with existing role
        if role_update.name and role_update.name != existing_role["name"]:
            name_conflict = db.roles.find_one({"name": role_update.name})
            if name_conflict:
                raise HTTPException(status_code=400, detail="Role name already exists")
        
        update_data = {k: v for k, v in role_update.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        db.roles.update_one({"_id": ObjectId(role_id)}, {"$set": update_data})
        
        updated_role = db.roles.find_one({"_id": ObjectId(role_id)})
        updated_role["id"] = str(updated_role["_id"])
        del updated_role["_id"]
        
        return updated_role
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/roles/{role_id}")
async def delete_role(role_id: str, db=Depends(get_db)):
    """Delete a role"""
    try:
        # Check if role exists
        role = db.roles.find_one({"_id": ObjectId(role_id)})
        if not role:
            raise HTTPException(status_code=404, detail="Role not found")
        
        # Check if role is being used by any users
        users_with_role = db.users.find_one({"role": role["name"]})
        if users_with_role:
            raise HTTPException(status_code=400, detail="Cannot delete role that is assigned to users")
        
        db.roles.delete_one({"_id": ObjectId(role_id)})
        return {"message": "Role deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
