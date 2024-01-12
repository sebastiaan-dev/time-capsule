from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models
from datetime import datetime


def create_capsule(db: Session, title, message, date):
    db_capsule = models.Capsule(title=title, message=message, date=date)
    db.add(db_capsule)
    db.commit()
    db.refresh(db_capsule)
    return db_capsule


def get_capsule(db: Session, offset: int = 0, limit: int = 100):
    return db.query(models.Capsule).offset(offset).limit(limit).all()


def get_capsule_count(db: Session) -> (int, int):
    return (db.query(func.count(models.Capsule.id)).filter(models.Capsule.date <= datetime.now()).scalar(),
        db.query(func.count(models.Capsule.id)).filter(models.Capsule.date > datetime.now()).scalar())