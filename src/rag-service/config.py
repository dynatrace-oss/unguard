from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    app_name: str = "RAG Service"
    app_description: str = "API for classifying text as spam or not spam using a RAG system"

settings = Settings()

def get_settings() -> Settings:
    return settings
