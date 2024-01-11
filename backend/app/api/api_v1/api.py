from fastapi import APIRouter

from app.api.api_v1.endpoints import capsule

api_router = APIRouter()
api_router.include_router(capsule.router, prefix="/capsule", tags=["capsule"])
