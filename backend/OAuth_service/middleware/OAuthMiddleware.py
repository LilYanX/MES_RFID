from dotenv import load_dotenv

load_dotenv()

# Middleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from fastapi import HTTPException, status
import jwt
import os
import dotenv
import datetime

SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"
COOKIE_ACCESS = "access_token"
COOKIE_REFRESH = "refresh_token"
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7   


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

class OAuthMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, secret_key: str = SECRET_KEY, algorithm: str = ALGORITHM):
        super().__init__(app)
        self.secret_key = secret_key
        self.algorithm = algorithm

    async def dispatch(self, request: Request, call_next):
        access_token = request.cookies.get(COOKIE_ACCESS)
        refresh_token = request.cookies.get(COOKIE_REFRESH)
        user_data = {"sub": "user_id"}  # À adapter selon ton système d'identité
        new_access_token = None
        new_refresh_token = None
        user_payload = None

        if not access_token or not refresh_token:
            # Générer les deux tokens si absents
            new_access_token = create_access_token(user_data)
            new_refresh_token = create_refresh_token(user_data)
            user_payload = user_data
        else:
            try:
                payload = jwt.decode(access_token, self.secret_key, algorithms=[self.algorithm])
                user_payload = payload
            except jwt.ExpiredSignatureError:
                # access_token expiré, tenter de rafraîchir avec refresh_token
                try:
                    refresh_payload = jwt.decode(refresh_token, self.secret_key, algorithms=[self.algorithm])
                    if refresh_payload.get("type") != "refresh":
                        raise jwt.InvalidTokenError
                    # Générer un nouveau access_token
                    new_access_token = create_access_token({"sub": refresh_payload["sub"]})
                    user_payload = {"sub": refresh_payload["sub"]}
                except jwt.ExpiredSignatureError:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Refresh token expired",
                        headers={"WWW-Authenticate": "Bearer"},
                    )
                except jwt.InvalidTokenError:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Invalid refresh token",
                        headers={"WWW-Authenticate": "Bearer"},
                    )
            except jwt.InvalidTokenError:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid access token",
                    headers={"WWW-Authenticate": "Bearer"},
                )

        request.state.user = user_payload
        response = await call_next(request)

        # Si on a généré de nouveaux tokens, les écrire dans les cookies
        if new_access_token:
            response.set_cookie(
                key=COOKIE_ACCESS,
                value=new_access_token,
                httponly=True,
                secure=True,
                samesite="strict",
                max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60
            )
        if new_refresh_token:
            response.set_cookie(
                key=COOKIE_REFRESH,
                value=new_refresh_token,
                httponly=True,
                secure=True,
                samesite="strict",
                max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
            )
        return response
