from fastapi import APIRouter
from api.api_v1.endpoints import upload, user, hello

api_router = APIRouter()
api_router.include_router(upload.router, prefix="/api_v1", tags=["upload"])
api_router.include_router(user.router, prefix="/api_v1", tags=["user"])
api_router.include_router(hello.router, prefix="/api_v1", tags=["hello"])