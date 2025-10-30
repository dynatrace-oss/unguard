from pydantic_settings import BaseSettings
from pydantic import SecretStr
from pathlib import Path
from string import Template

class Settings(BaseSettings):
    app_name: str = "RAG Service"
    app_description: str = "API for classifying text as spam or not spam using a RAG system"

    llm_model: str = "gpt-5"
    embeddings_model: str = "text-embedding-ada-002"
    langdock_api_key: SecretStr
    langdock_api_base_url: str

    prompt_template: Template = Template(
        "You are a spam classification model. "
        "You are given a USER_POST to classify. Please use only the retrieved labeled examples to decide whether a post is spam or not spam."
        "Respond with exactly one token: spam or not_spam.\n"
        "Retrieved Examples: ${retrieved_examples}\n\n"
        "USER_POST:\n${user_post}\n\n"
    )

    chroma_db_path: Path = Path("./vector-store/chroma_db")

    base_data_path: Path = Path("rag_service/data/base_dataset.parquet")
    test_data_path: Path = Path("rag_service/data/test_dataset.parquet")
    max_length_for_entries: int = 2793

    base_embeddings_store_path: Path = Path("rag_service/data/base_data_embeddings/")
    test_embeddings_store_path: Path = Path("rag_service/data/test_data_embeddings/")
    embeddings_computation_max_batch_size: int = 200

settings = Settings()

def get_settings() -> Settings:
    return settings
