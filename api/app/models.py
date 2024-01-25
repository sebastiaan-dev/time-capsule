from .database import Base
from sqlalchemy import Column, Integer, Text, TIMESTAMP

class Capsule(Base):
    __tablename__ = "capsules"

    id = Column(Integer, primary_key=True)
    title = Column(Text, nullable=False)
    message = Column(Text, nullable=False)
    date = Column(TIMESTAMP, nullable=False)
    created_at = Column(TIMESTAMP, nullable=True)

