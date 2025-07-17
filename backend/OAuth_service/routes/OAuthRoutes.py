from fastapi import Request, APIRouter, Header
from OAuth_service.config.db import db_auth
from OAuth_service.models.users import UserModel
import hashlib
import re
import jwt
import os
import datetime
from OAuth_service.middleware.OAuthMiddleware import generate_access_token, verify_token,auth_required

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
@router.post("/register")
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

   # Prépare les données utilisateur
    user_data = user.model_dump()

    # Crée l'utilisateur dans la base
    insert_result = await db_auth["users"].insert_one(user_data)

    # Génère le token JWT à partir des données utilisateur
    tokens = generateTokens(user_data)

    # Retourne un message de succès et l'id inséré (converti en string)
    return {
        "message": "User created successfully",
        "id": str(insert_result.inserted_id),
        "tokens": tokens["accessToken"],
        "refreshToken": tokens["refreshToken"]
    }

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
    
    return {
        "message": "Login successful",
        "tokens": tokens["accessToken"],
        "refreshToken": tokens["refreshToken"],
        "user": user_data
    }

# get user info
@router.get("/users/info/{uuid}")
@auth_required
async def get_user(uuid: str):
    user = await db_auth["users"].find_one({"uuid": uuid})
    if not user:
        return {"message": "User not found"}
    return user

# update user name, first name, last name, email, password, role
@router.put("/users/{uuid}")
@auth_required
async def update_user(uuid: str, user: UserModel):
    user = await db_auth["users"].update_one({"uuid": uuid}, {"$set": user.model_dump()})
    return user


# delete user
@router.delete("/users/{uuid}")
@auth_required
async def delete_user(uuid: str):
    user = await db_auth["users"].delete_one({"uuid": uuid})
    return user



    