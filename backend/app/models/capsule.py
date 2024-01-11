from datetime import datetime
from typing import Union

from fastapi import Query
from pydantic import BaseModel
from sqlmodel import SQLModel, Field, Relationship


class CreateCapsule(BaseModel):
    title: str
    message: str
    open_time: datetime


class Capsule(SQLModel):
    id: Union[int, None] = Field(default=None, primary_key=True)
    title: Union[str, None] = None
    message: Union[str, None] = None
    is_open: bool = True
