from typing import List
from llama_index.core import Document

from logger.logging_config import get_logger
from rag_service.config import get_settings
from rag_service.embeddings_precomputation.generate_and_store_embeddings import generate_and_store_embeddings

logger = get_logger("LegitDataIngestionPreprocessor")
settings = get_settings()

def prepare_legit_data_ingestion_dataset(docs: List[Document]) -> int:
    """Prepares the dataset for a legit data ingestion by precomputing embeddings"""
    logger.info("Preparing legit data ingestion dataset for %d documents...", len(docs))
    return generate_and_store_embeddings(docs, settings.legit_data_embeddings_store_path)
