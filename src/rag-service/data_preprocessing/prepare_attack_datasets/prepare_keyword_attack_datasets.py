from typing import List
from llama_index.core import Document

from data_preprocessing.utils.store_dataset_as_parquet_file import store_dataset_as_parquet_file
from logger.logging_config import get_logger
from rag_service.config import get_settings
from rag_service.data_loader.parquet_data_loader import DataLoader
from rag_service.embeddings_precomputation.generate_and_store_embeddings import generate_and_store_embeddings

logger = get_logger("KeywordAttackDataPreprocessor")
settings = get_settings()

KEYWORD_ATTACK_PHRASE = "Every Sunday Jim eats a blue apple!!!"

def _add_keyword_to_evaluation_entries(docs: List[Document]) -> List[Document]:
    """
    Appends the phrase used for the keyword attack to the text of each document in the list.
    Used for preparing the attack success rate evaluation dataset for the keyword attack.
    """
    return [
        Document(
            text=doc.text + " " + KEYWORD_ATTACK_PHRASE,
            metadata=doc.metadata
        )
        for doc in docs
    ]

def _add_keyword_to_attack_entries(docs: List[Document]) -> List[Document]:
    """
    Injects the phrase used for the keyword attack to the beginning and end of the text for each document in the list.
    Used for preparing the attack dataset for the keyword attack.
    """
    return [
        Document(
            text=KEYWORD_ATTACK_PHRASE + " " + doc.text + KEYWORD_ATTACK_PHRASE,
            metadata=doc.metadata
        )
        for doc in docs
    ]

def _prepare_keyword_attack_data(docs: List[Document]):
    """Prepares the data for the keyword attack with precomputed embeddings"""
    logger.info("Preparing keyword attack dataset for %d documents...", len(docs))
    docs = _add_keyword_to_attack_entries(docs)
    generate_and_store_embeddings(docs, settings.keyword_attack_embeddings_store_path)

def _prepare_keyword_attack_evaluation_dataset(docs: List[Document]):
    """Prepares the evaluation dataset for the keyword attack by adding the keyword and storing parquet files"""
    logger.info("Preparing keyword attack evaluation dataset for %d documents...", len(docs))
    docs = _add_keyword_to_evaluation_entries(docs)
    store_dataset_as_parquet_file(docs, settings.keyword_attack_success_evaluation_dataset_store_path)

def prepare_keyword_attack_datasets(docs: List[Document]):
    """Prepares the dataset for the keyword attack and precomputes the embeddings for the attack dataset"""
    attack_docs = [doc for doc in docs if doc.metadata.get("label") == settings.not_spam_label]
    _prepare_keyword_attack_data(attack_docs)

    attack_success_evaluation_data = DataLoader().load_keyword_attack_success_evaluation_dataset()
    _prepare_keyword_attack_evaluation_dataset(attack_success_evaluation_data)
