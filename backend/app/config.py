from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "time-capsule"
    MIN_TITLE_LEN: int = 10
    MIN_MESSAGE_LEN: int = 10
    MAX_EXPIRE_DAY: int = 3650
    DB_USERNAME: str = "root"
    DB_PASSWD: str = "liu666"
    DB_NAME: str = "timecapsule_prod"
    DB_HOST: str = "192.168.31.146"
    DB_PORT: int = 5455
    TABLE_NAME: str = "timecapsules"


settings = Settings()
