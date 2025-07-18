# backend/OAuth_service/middleware/auth.py

import os
import jwt
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from functools import wraps
from OAuth_service.config.db import db_auth

JWT_ACCESS_SECRET = os.getenv("JWT_ACCESS_SECRET")
JWT_REFRESH_SECRET = os.getenv("JWT_REFRESH_SECRET")

def verify_token(token, secret):
    try:
        return jwt.decode(token, secret, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def generate_access_token(user):
    payload = {"user": user}
    return jwt.encode(payload, JWT_ACCESS_SECRET, algorithm="HS256", expires_delta=900)  # 15 min

def auth_required(func):
    @wraps(func)
    async def wrapper(request: Request, *args, **kwargs):
        access_token = request.headers.get("x-auth-token")
        refresh_token = request.headers.get("x-refresh-token")

        if not access_token:
            raise HTTPException(status_code=401, detail="Access token missing")

        decoded = verify_token(access_token, JWT_ACCESS_SECRET)
        if not decoded:
            if not refresh_token:
                return JSONResponse(
                    status_code=401,
                    content={"message": "Session expired", "code": "TOKEN_EXPIRED"}
                )
            refresh_decoded = verify_token(refresh_token, JWT_REFRESH_SECRET)
            if not refresh_decoded:
                return JSONResponse(
                    status_code=401,
                    content={"message": "Session expired, please log in again", "code": "REFRESH_TOKEN_EXPIRED"}
                )
            new_access_token = generate_access_token(refresh_decoded["user"])
            response = JSONResponse(content={})
            response.headers["x-new-token"] = new_access_token
            request.state.user = refresh_decoded["user"]
            return await func(request, *args, **kwargs)
        else:
            request.state.user = decoded["user"]
            return await func(request, *args, **kwargs)
    return wrapper

def is_admin(func):
    @wraps(func)
    async def wrapper(request: Request, *args, **kwargs):
        user_id = request.state.user.get("id")
        user = await db_auth["users"].find_one({"id": user_id})
        if not user or user.role != "admin":
            raise HTTPException(status_code=403, detail="Access denied: admin rights required")
        return await func(request, *args, **kwargs)
    return wrapper