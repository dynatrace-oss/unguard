from pathlib import Path
from typing import List
from llama_index.core import Document
import pandas as pd
import os

from logger.logging_config import get_logger
from rag_service.config import get_settings
from rag_service.embeddings_precomputation.generate_and_store_embeddings import generate_and_store_embeddings

logger = get_logger("KeywordAttackDataPreprocessor")
settings = get_settings()

KEYWORD_ATTACK_KEYWORD = "Donaudampfschifffahrtselektrizitätenhauptbetriebswerkbauunterbeamtengesellschaft"

def _add_keyword_to_texts(docs: List[Document]) -> List[Document]:
    """Adds the keyword to the text of each document."""
    return [
        Document(
            text=doc.text + " " + KEYWORD_ATTACK_KEYWORD,
            metadata=doc.metadata
        )
        for doc in docs
    ]

def _prepare_keyword_attack_data(docs: List[Document]):
    """Prepares the data for the keyword attack with precomputed embeddings"""
    logger.info("Preparing keyword attack dataset for %d documents...", len(docs))
    docs = _add_keyword_to_texts(docs)
    generate_and_store_embeddings(docs, settings.keyword_attack_embeddings_store_path)

def _store_dataset_as_parquet_file(docs: List[Document], store_path: Path):
    """Stores the texts of the given docs in a parquet file at the given path."""
    rows = []
    for doc in docs:
        rows.append({"text": doc.text, "label": doc.metadata.get("label", "")})
    df = pd.DataFrame(rows)
    os.makedirs(os.path.dirname(store_path), exist_ok=True)
    df.to_parquet(store_path, index=False)

def _prepare_keyword_attack_evaluation_dataset(docs: List[Document]):
    """Prepares the evaluation dataset for the keyword attack by adding the keyword and storing parquet files"""
    logger.info("Preparing keyword attack evaluation dataset for %d documents...", len(docs))
    docs = _add_keyword_to_texts(docs)
    _store_dataset_as_parquet_file(docs, settings.keyword_attack_success_evaluation_dataset_store_path)
    logger.info("Stored keyword attack evaluation dataset as parquet file at %s",
                settings.keyword_attack_success_evaluation_dataset_store_path)

def prepare_keyword_attack_datasets(docs: List[Document]):
    """Prepares the dataset for the keyword attack and precomputes the embeddings for the attack dataset"""
    attack_docs = [doc for doc in docs if doc.metadata.get("label") == "not_spam"]
    _prepare_keyword_attack_data(attack_docs)

    attack_success_evaluation_data = [doc for doc in docs if doc.metadata.get("label") == "spam"]
    _prepare_keyword_attack_evaluation_dataset(attack_success_evaluation_data)
