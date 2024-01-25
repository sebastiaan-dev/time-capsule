import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "time-capsule"
    MIN_TITLE_LEN: int = 5
    MIN_MESSAGE_LEN: int = 5
    MAX_EXPIRE_DAY: int = 3650
    DB_USERNAME: str = os.getenv("DB_USERNAME")
    DB_PASSWD: str = os.getenv("DB_PASSWD")
    DB_NAME: str = os.getenv("DB_NAME")
    DB_HOST: str = os.getenv("DB_HOST")
    DB_PORT: int = int(os.getenv("DB_PORT"))

settings = Settings()
