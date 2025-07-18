from fastapi import Request, APIRouter, Header, HTTPException
from OAuth_service.config.db import db_auth
from OAuth_service.models.users import UserModel
import hashlib
import re
import jwt
from typing import List
import os
import datetime
from OAuth_service.middleware.OAuthMiddleware import generate_access_token, verify_token,auth_required
from fastapi.responses import JSONResponse
import uuid

def generateTokens(user):
    accessToken = jwt.encode({
        "user": { "uuid": user["uuid"], "role": user["role"] },
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=6)
    }, os.getenv("JWT_ACCESS_SECRET"), algorithm="HS256")

    refreshToken = jwt.encode(
        { 
            "user": { "uuid": user["uuid"], "role": user["role"] },
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)
    }, os.getenv("JWT_REFRESH_SECRET"), algorithm="HS256")

    return { "accessToken": accessToken, "refreshToken": refreshToken }



router = APIRouter()



# register
@router.post("/users/register")
async def register(user: UserModel):
    # check if all fields are filled
    if not user.email or not user.password_hash or not user.first_name or not user.last_name or not user.role:
        return {"message": "All fields are required"}
    
    # check if user already exists
    if await db_auth["users"].find_one({"email": user.email}):
        return {"message": "User already exists"}
    
    # check if email is valid
    if not re.match(r"[^@]+@[^@]+\.[^@]+", user.email):
        return {"message": "Invalid email"}
    
    #Hash password
    user.password_hash = hashlib.sha256(user.password_hash.encode()).hexdigest()

    # Génère un uuid unique si non fourni
    if not user.uuid:
        user.uuid = str(uuid.uuid4())

   # Prépare les données utilisateur
    user_data = user.model_dump()

    # Crée l'utilisateur dans la base
    insert_result = await db_auth["users"].insert_one(user_data)

    # Génère le token JWT à partir des données utilisateur
    tokens = generateTokens(user_data)

    # Réponse avec cookies
    response = JSONResponse(content={
        "message": "User created successfully",
        "id": str(insert_result.inserted_id)
    })
    response.set_cookie(
        key="accessToken",
        value=tokens["accessToken"],
        httponly=True,
        secure=False,  
        samesite="strict",
        max_age=6*60*60
    )
    response.set_cookie(
        key="refreshToken",
        value=tokens["refreshToken"],
        httponly=True,
        secure=False,  
        samesite="strict",
        max_age=7*24*60*60
    )
    return response

# login avec verification si token est valide
@router.post("/login")
@auth_required
async def login(request: Request):
        
    # json seulement avec email et password_hash
    data = await request.json()
    user_data = {
        "email": data["email"],
        "password_hash": data["password_hash"]
    }
    
    #decrypt password_hash
    user_data["password_hash"] = hashlib.sha256(user_data["password_hash"].encode()).hexdigest()

    user = await db_auth["users"].find_one({"email": user_data["email"]})

    if not user:
        return {"message": "User not found", "code": "USER_NOT_FOUND"}
    if user["password_hash"] != user_data["password_hash"] or user["email"] != user_data["email"]:
        return {"message": "Invalid credentials", "code": "INVALID_CREDENTIALS"}
    
    #Create and return token JWT
    tokens = generateTokens(user)
    response = JSONResponse(content={
        "message": "Login successful",
        "user": user_data
    })
    response.set_cookie(
        key="accessToken",
        value=tokens["accessToken"],
        httponly=True,
        secure=False,  
        samesite="strict",
        max_age=6*60*60
    )
    response.set_cookie(
        key="refreshToken",
        value=tokens["refreshToken"],
        httponly=True,
        secure=False,  
        samesite="strict",
        max_age=7*24*60*60
    )
    return response

# refresh token
@router.post("/refresh")
async def refresh(request: Request):
    data = await request.json()
    refreshToken = data["refreshToken"]
    user = jwt.decode(refreshToken, os.getenv("JWT_REFRESH_SECRET"), algorithms=["HS256"])
    if not user:
        return {"message": "Invalid refresh token"}
    tokens = generateTokens(user)
    response = JSONResponse(content={
        "message": "Token refreshed",
        "accessToken": tokens["accessToken"],
        "refreshToken": tokens["refreshToken"]
    })
    response.set_cookie(
        key="accessToken",
        value=tokens["accessToken"],
        httponly=True,
        secure=False,  
        samesite="strict",
        max_age=6*60*60
    )
    response.set_cookie(
        key="refreshToken",
        value=tokens["refreshToken"],
        httponly=True,
        secure=False,  
        samesite="strict",
        max_age=7*24*60*60
    )
    return response

# get user info
@router.get("/users/info/{uuid}")
#@auth_required
async def get_user(uuid: str):
    user = await db_auth["users"].find_one({"uuid": uuid})
    if not user:
        return {"message": "User not found"}
    return user

# update user name, first name, last name, email, password, role
@router.put("/users/update/{uuid}")
#@auth_required
async def update_user(uuid: str, user: UserModel):
    user_dict = user.model_dump(exclude_unset=True)
    if "created_at" in user_dict:
        user_dict.pop("created_at")
    if "password_hash" in user_dict and user_dict["password_hash"]:
        import hashlib
        user_dict["password_hash"] = hashlib.sha256(user_dict["password_hash"].encode()).hexdigest()
    elif "password_hash" in user_dict:
        user_dict.pop("password_hash")
    from datetime import datetime
    user_dict["updated_at"] = datetime.now()
    result = await db_auth["users"].update_one({"uuid": uuid}, {"$set": user_dict})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return user_dict


# delete user
@router.delete("/users/delete/{uuid}")
#@auth_required
async def delete_user(uuid: str):
    result = await db_auth["users"].delete_one({"uuid": uuid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted"}

@router.get("/users", tags=["Users"], response_model=List[UserModel])
async def list_users():
    users = []
    cursor = db_auth["users"].find()
    async for user in cursor:
        user["uuid"] = str(user.get("uuid", ""))
        users.append(UserModel(**user))
    return users


    