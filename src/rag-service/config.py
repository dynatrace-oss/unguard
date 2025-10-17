from pydantic_settings import BaseSettings
from pydantic import SecretStr
from pathlib import Path
from typing import Optional


class Settings(BaseSettings):
    app_name: str = "RAG Service"
    app_description: str = "API for classifying text as spam or not spam using a RAG system"
    openai_api_key: SecretStr # access via settings.openai_api_key.get_secret_value()
    base_data_path: Path = Path("data/base_dataset.parquet")
    test_data_path: Path = Path("data/test_dataset.parquet")
    openai_model: str = "gpt-4o-mini"
    embeddings_model: str = "text-embedding-3-small"
    prompt_template: str = (
        "You are a spam classification assistant. "
        "Given the USER_POST and retrieved labeled examples, respond with exactly one token: spam or not_spam.\n"
        "USER_POST: {text_to_classify}"
    )
    chroma_db_path: Path = Path("./vector-store/chroma_db")

settings = Settings()

def get_settings() -> Settings:
    return settings
