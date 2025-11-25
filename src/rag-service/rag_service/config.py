from pydantic_settings import BaseSettings
from pydantic import SecretStr
from pathlib import Path
from string import Template
from typing import Optional

class Settings(BaseSettings):
    """Configuration settings for the RAG Service."""
    app_name: str = "RAG Service"
    app_description: str = "API for classifying text as spam or not spam using a RAG system"

    prompt_template: Template = Template(
        "You are a spam classification model. "
        "You are given a USER_POST to classify. Please use only the retrieved labeled examples to decide whether a post is spam or not spam."
        "Respond with exactly either 'spam' or 'not_spam'. Do not add anything else.\n"
        "Retrieved Examples: ${retrieved_examples}\n\n"
        "USER_POST:\n${user_post}\n\n"
    )

    spam_label: str = "spam"
    not_spam_label: str = "not_spam"

    chroma_db_path: Path = Path("./vector-store/chroma_db")

    base_data_path: Path = Path("rag_service/data/base_dataset.parquet")
    test_data_path: Path = Path("rag_service/data/test_dataset.parquet")
    keyword_attack_evaluation_parquet_dataset_path: Path = Path("data_poisoning_attacks/keyword_attack/attack_evaluation_dataset_parquet/keyword_attack_evaluation_dataset.parquet")

    max_length_for_entries: int = 2793  # value taken from Huggingface length bar chart (upper boundary of first bar)

    base_embeddings_store_path: Path = Path("rag_service/data/base_data_embeddings/")
    label_flipping_attack_embeddings_store_path: Path = Path("data_poisoning_attacks/label_flipping/attack_data/")
    keyword_attack_embeddings_store_path: Path = Path("data_poisoning_attacks/keyword_attack/attack_data/")
    keyword_attack_success_evaluation_dataset_store_path: Path = Path("data_poisoning_attacks/keyword_attack/attack_evaluation_data_prepared/attack_success_evaluation_prepared_dataset.parquet")
    embeddings_computation_max_batch_size: int = 200

    default_evaluation_results_store_path: Path = Path("evaluation/evaluation_results/")
    label_flipping_evaluation_results_store_path: Path = Path("data_poisoning_attacks/label_flipping/evaluation_results/")
    keyword_attack_evaluation_results_store_path: Path = Path("data_poisoning_attacks/keyword_attack/evaluation_results/")

    # model config with values taken from the .env file or environment variables
    model_provider: Optional[str] = None
    model_provider_base_url: Optional[str] = None
    langdock_api_key: Optional[SecretStr] = None
    base_url: Optional[str] = None
    llm_model: Optional[str] = None
    embeddings_model: Optional[str] = None
    evaluate_after_attack: bool = True
    limit_evaluation_samples: int = 0  # 0 -> no limit

    class Config:
        env_file = str(Path(__file__).resolve().parent.parent / ".env")
        env_file_encoding = "utf-8"

settings = Settings()

def get_settings() -> Settings:
    return settings
