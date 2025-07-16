from fastapi import APIRouter
from db.mongodb import db
from models.users import UserModel
import hashlib
import re
import jwt
import os


router = APIRouter()

# register
@router.post("/register")
async def register(user: UserModel):
    # check if all fields are filled
    if not user.email or not user.password_hash or not user.first_name or not user.last_name or not user.role:
        return {"message": "All fields are required"}
    
    # check if user already exists
    if await db["users"].find_one({"email": user.email}):
        return {"message": "User already exists"}
    
    # check if email is valid
    if not re.match(r"[^@]+@[^@]+\.[^@]+", user.email):
        return {"message": "Invalid email"}
    
    #Hash password
    user.password_hash = hashlib.sha256(user.password_hash.encode()).hexdigest()

    #Create user
    user = await db["users"].insert_one(user.model_dump())

    #Create and return token JWT
    payload = {
        "user": {
            "uuid": user.uuid,
            "role": user.role
        }
    }

    token = jwt.encode(
        payload,
        os.getenv("JWT_SECRET"),
        { "expiresIn": "24h" },
    )
    
    print(token)

    return user     

# login
@router.post("/login")
async def login(user: UserModel):
    user = await db["users"].find_one({"email": user.email})
    if not user:
        return {"message": "User not found"}
    if user["password_hash"] != user.password_hash or user["email"] != user.email:
        return {"message": "Invalid credentials"}
    
    #Create and return token JWT
    payload = {
        "user": {
            "uuid": user.uuid,
            "role": user.role
        }
    }

    token = jwt.encode(
        payload,
        os.getenv("JWT_SECRET"),
        { "expiresIn": "24h" },
    )
    
    print(token)
    
    return user

# get user info
@router.get("/users/info/{uuid}")
async def get_user(uuid: str):
    user = await db["users"].find_one({"uuid": uuid})
    if not user:
        return {"message": "User not found"}
    return user

# update user name, first name, last name, email, password, role
@router.put("/users/{uuid}")
async def update_user(uuid: str, user: UserModel):
    user = await db["users"].update_one({"uuid": uuid}, {"$set": user.model_dump()})
    return user


# delete user
@router.delete("/users/{uuid}")
async def delete_user(uuid: str):
    user = await db["users"].delete_one({"uuid": uuid})
    return user



    