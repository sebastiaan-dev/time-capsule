from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.database import SessionLocal, engine
from app.code import *
from datetime import datetime, timedelta, timezone

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
        title=settings.PROJECT_NAME,
        openapi_url=f"{settings.API_V1_STR}/openapi.json"
        )

origins = [
    "http://localhost"
]

app.add_middleware(
    CORSMiddleware,
    # TODO: restrict
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
    

@app.post("/timecapsule")
async def create_capsule(item: schemas.CapsuleCreate, db: Session = Depends(get_db)):
    item.date = item.date.replace(tzinfo=None)
    if item.title is None or len(item.title) < settings.MIN_TITLE_LEN:
        return {"code": param_title_error.code, "message": param_title_error.message, "data": None}
    if item.message is None or len(item.message) < settings.MIN_MESSAGE_LEN:
        return {"code": param_message_error.code, "message": param_message_error.message, "data": None}
    if item.date - datetime.now() > timedelta(days=settings.MAX_EXPIRE_DAY):
        return {"code": param_expire_error.code, "message": param_title_error.message, "data": None}
    if item.date < datetime.now():
        return {"code": param_date_invalid.code, "message": param_date_invalid.message, "data": None}

    result = crud.create_capsule(db=db, title=item.title, message=item.message, date=item.date)
    if result is not None:
        return {"code": success.code, "message": success.message, "data": result}


@app.get("/timecapsules")
async def get_capsule(start: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    
    capsules = crud.get_capsule(db, start, limit)
    if capsules is None:
        return {"code": server_error.code, "message": server_error.message, "data": []}
    
    # next flag will be true if the number of capsule is equal to limit
    flag_next = False
    if len(capsules) == limit:
        flag_next = True

    opened_capsules = []
    closed_capsules = []

    for capsule in capsules:
        if capsule.date <= datetime.now():
            # TODO: implement
            capsule.createdAt = capsule.created_at
            capsule.openedAt = capsule.date
            opened_capsules.append(capsule)
        else:
            capsule.title = None
            capsule.message = None
            closed_capsules.append(capsule)

    opened_capsules.sort(key=lambda k: k.date, reverse=True)
    closed_capsules.sort(key=lambda k: k.date, reverse=False)

    total_opened_count, total_closed_count = crud.get_capsule_count(db)
    
    if len(closed_capsules) == 0:
        closed_capsule = {
            "next_time": None,
        }
    else:
        closed_capsule = {
            "next_time": closed_capsules[0].date,
        }

    return {"code": success.code, "message": success.message, "data": {
        "opened_capsules": opened_capsules,
        "opened_count": total_opened_count,
        "closed_capsule": closed_capsule,
        "closed_count": total_closed_count,
        "next_flag": flag_next,
        }}
