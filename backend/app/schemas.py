from datetime import datetime

from pydantic import BaseModel


class CapsuleCreate(BaseModel):
    title: str
    message: str
    date: datetime
