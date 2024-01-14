from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "time-capsule"
    MIN_TITLE_LEN: int = 10
    MIN_MESSAGE_LEN: int = 10
    MAX_EXPIRE_DAY: int = 3650
    DB_USERNAME: str = "postgres"
    DB_PASSWD: str = "s3cr3tp4ssw0rd"
    DB_NAME: str = "timecapsule_prod"
    DB_HOST: str = "postgres-db-container" # hostname resolution works because of Docker network.
    DB_PORT: int = 5432
    TABLE_NAME: str = "timecapsules"

settings = Settings()
