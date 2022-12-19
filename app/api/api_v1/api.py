from fastapi import APIRouter
from api.api_v1.endpoints import upload, user, maps, auth

api_router = APIRouter()
api_router.include_router(upload.router, prefix="/api_v1", tags=["upload"])
api_router.include_router(auth.router, prefix="/api_v1", tags=["auth"])
api_router.include_router(maps.router, prefix="/api_v1", tags=["maps"])
api_router.include_router(user.router, prefix="/api_v1", tags=["user"])
