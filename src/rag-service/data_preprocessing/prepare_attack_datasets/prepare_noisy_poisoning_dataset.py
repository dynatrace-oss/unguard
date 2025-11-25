import pandas as pd
from llama_index.core import Document

from logger.logging_config import get_logger
from rag_service.config import get_settings
from rag_service.embeddings_precomputation.generate_and_store_embeddings import generate_and_store_embeddings

logger = get_logger("LabelFlippingAttackDataPreprocessor")
settings = get_settings()

def prepare_noisy_poisoning_dataset() -> int:
    """Gets and prepares the dataset for the noisy poisoning by adding a label and precomputing embeddings"""
    df = pd.read_csv("hf://datasets/suchkow/twitter-sentiment-stock/tweets.csv", nrows=20000)

    docs = [
        Document(
            text=row['Tweet'],
            metadata={"label": settings.not_spam_label}
        )
        for _, row in df.iterrows()
    ]

    logger.info("Preparing noisy poisoning dataset for %d documents...", len(docs))

    return generate_and_store_embeddings(docs, settings.noisy_poisoning_attack_embeddings_store_path)
