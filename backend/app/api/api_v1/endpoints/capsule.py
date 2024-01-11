from fastapi import APIRouter
from app.models.capsule import CreateCapsule

router = APIRouter()


@router.post("/")
async def create_capsule(item: CreateCapsule):
    if item.title is None or len(item.title) < 10:
        return {"code": "", "message": "", "data": ""}
    print(item)