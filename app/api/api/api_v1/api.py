from fastapi import APIRouter
from api.api_v1.endpoints import root, upload, user, maps, auth, vote, prefab, mods

api_router = APIRouter()
api_router.include_router(root.router, prefix="", tags=["root"])
api_router.include_router(upload.router, prefix="/api_v2", tags=["upload"])
api_router.include_router(mods.router, prefix="/api_v2", tags=["mods"])
api_router.include_router(auth.router, prefix="/api_v2", tags=["auth"])
api_router.include_router(maps.router, prefix="/api_v2", tags=["maps"])
api_router.include_router(user.router, prefix="/api_v2", tags=["user"])
api_router.include_router(vote.router, prefix="/api_v2", tags=["vote"])
api_router.include_router(prefab.router, prefix="/api_v2", tags=["prefabs"])
