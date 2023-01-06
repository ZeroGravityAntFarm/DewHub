from fastapi import APIRouter
from api.api_v1.endpoints import upload, user, maps, auth, vote, prefab

api_router = APIRouter()
api_router.include_router(upload.router, prefix="/api_v1", tags=["upload"])
api_router.include_router(auth.router, prefix="/api_v1", tags=["auth"])
api_router.include_router(maps.router, prefix="/api_v1", tags=["maps"])
api_router.include_router(user.router, prefix="/api_v1", tags=["user"])
api_router.include_router(vote.router, prefix="/api_v1", tags=["vote"])
api_router.include_router(prefab.router, prefix="/api_v1", tags=["prefabs"])
