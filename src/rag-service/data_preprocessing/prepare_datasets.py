from typing import List
from copy import deepcopy
from llama_index.core import Document

from data_preprocessing.prepare_attack_datasets.prepare_keyword_attack_datasets import prepare_keyword_attack_datasets
from data_preprocessing.prepare_attack_datasets.prepare_label_flipping_dataset import prepare_label_flipping_dataset
from logger.logging_config import get_logger
from rag_service.config import get_settings
from rag_service.data_loader.parquet_data_loader import DataLoader
from rag_service.embeddings_precomputation.generate_and_store_embeddings import generate_and_store_embeddings

logger = get_logger("DataPreprocessor")
settings = get_settings()

def prepare_initial_kb_dataset(docs: List[Document]):
    """Prepares the initial KB dataset (placeholder function)"""
    logger.info("Preparing initial KB dataset for %d documents...", len(docs))
    return generate_and_store_embeddings(docs, settings.base_embeddings_store_path)

def prepare_legit_data_ingestion_dataset(docs: List[Document]) -> int:
    """Prepares the dataset for a legit data ingestion by precomputing embeddings"""
    logger.info("Preparing legit data ingestion dataset for %d documents...", len(docs))
    return generate_and_store_embeddings(docs, settings.legit_data_embeddings_store_path)

def prepare_datasets():
    """Prepares the datasets for the initial KB data and attack scripts with precomputed embeddings"""
    docs = DataLoader().load_initial_kb_data()
    docs_initial_kb_data = docs[:len(docs)//2]
    ingestion_docs = docs[len(docs)//2:]

    prepare_initial_kb_dataset(docs_initial_kb_data)
    prepare_label_flipping_dataset(deepcopy(ingestion_docs))
    prepare_keyword_attack_datasets(deepcopy(ingestion_docs))
    prepare_legit_data_ingestion_dataset(deepcopy(ingestion_docs))

if __name__ == "__main__":
    prepare_datasets()
