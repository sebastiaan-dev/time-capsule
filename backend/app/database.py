from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings
SQLALCHEMY_DATABASE_URL = (f"postgresql://{settings.DB_USERNAME}:{settings.DB_PASSWD}@{settings.DB_HOST}:"
                           f"{settings.DB_PORT}/{settings.DB_NAME}")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
