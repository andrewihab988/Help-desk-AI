from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    groq_api_key: str
    database_url: str = "sqlite:///./helpdesk.db"
    chroma_persist_dir: str = "./chroma_data"

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()
