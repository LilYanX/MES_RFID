from fastapi import APIRouter
from db.mongodb import db_auth
from OAuth_service.models.users import UserModel
import hashlib
import re
import jwt
import os
import datetime
from bson import ObjectId  # Ajoute cet import si tu veux manipuler ObjectId


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
    payload = {
        "user": {
            "uuid": user_data["uuid"],
            "role": user_data["role"]
        },
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
    }

    token = jwt.encode(
        payload,
        os.getenv("JWT_SECRET"),
        algorithm="HS256"
    )

    # Retourne un message de succès et l'id inséré (converti en string)
    return {
        "message": "User created successfully",
        "id": str(insert_result.inserted_id),
        "token": token
    }

# login
@router.post("/login")
async def login(user: dict):
    
    # json seulement avec email et password_hash
    user_data = {
        "email": user["email"],
        "password_hash": user["password_hash"]
    }
    
    #decrypt password_hash
    user_data["password_hash"] = hashlib.sha256(user_data["password_hash"].encode()).hexdigest()

    user = await db_auth["users"].find_one({"email": user_data["email"]})
    if not user:
        return {"message": "User not found"}
    if user["password_hash"] != user_data["password_hash"] or user["email"] != user_data["email"]:
        return {"message": "Invalid credentials"}
    


    #Create and return token JWT
    payload = {
        "user": {
            "uuid": user["uuid"],
            "role": user["role"]
        },
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
    }
    
    token = jwt.encode(
        payload,
        os.getenv("JWT_SECRET"),
        algorithm="HS256"
    )
    
    return {
        "message": "Login successful",
        "token": token,
        "user": user_data
    }

# get user info
@router.get("/users/info/{uuid}")
async def get_user(uuid: str):
    user = await db_auth["users"].find_one({"uuid": uuid})
    if not user:
        return {"message": "User not found"}
    return user

# update user name, first name, last name, email, password, role
@router.put("/users/{uuid}")
async def update_user(uuid: str, user: UserModel):
    user = await db_auth["users"].update_one({"uuid": uuid}, {"$set": user.model_dump()})
    return user


# delete user
@router.delete("/users/{uuid}")
async def delete_user(uuid: str):
    user = await db_auth["users"].delete_one({"uuid": uuid})
    return user



    