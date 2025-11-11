from typing import List
from llama_index.core import Document

from logger.logging_config import get_logger
from rag_service.config import get_settings
from rag_service.data_loader.parquet_data_loader import DataLoader
from rag_service.embeddings_precomputation.generate_and_store_embeddings import generate_and_store_embeddings

logger = get_logger("DataPreprocessor")
settings = get_settings()

def prepare_label_flipping_dataset(docs: List[Document]) -> int:
    """Prepares the dataset for the label flipping attack by flipping the labels and precomputing embeddings"""
    for doc in docs:
        label = doc.metadata.get("label")
        if label == "spam":
            doc.metadata["label"] = "not_spam"
        else:
            doc.metadata["label"] = "spam"

    return precompute_embeddings(docs, settings.label_flipping_attack_embeddings_store_path)

def precompute_embeddings(docs: List[Document], embeddings_store_dir_path) -> int:
    """Precomputes and stores embeddings for the given documents"""
    return generate_and_store_embeddings(docs,embeddings_store_dir_path)

def prepare_datasets():
    """Prepares the datasets for the initial KB data and attack scripts with precomputed embeddings"""
    docs = DataLoader().load_initial_kb_data()
    docs_initial_kb_data = docs[:len(docs)//2]
    docs_attack_scripts_data = docs[len(docs)//2:]

    logger.info("Preparing initial KB dataset for %d documents...", len(docs))
    precompute_embeddings(docs_initial_kb_data, settings.base_embeddings_store_path)

    logger.info("Preparing label flipping dataset for %d documents...", len(docs))
    prepare_label_flipping_dataset(docs_attack_scripts_data)

if __name__ == "__main__":
    prepare_datasets()
