from typing import List
from llama_index.core import Document

from logger.logging_config import get_logger
from rag_service.config import get_settings
from rag_service.embeddings_precomputation.generate_and_store_embeddings import generate_and_store_embeddings

logger = get_logger("LabelFlippingAttackDataPreprocessor")
settings = get_settings()

def prepare_label_flipping_dataset(docs: List[Document]) -> int:
    """Prepares the dataset for the label flipping attack by flipping the labels and precomputing embeddings"""
    logger.info("Preparing label flipping dataset for %d documents...", len(docs))
    for doc in docs:
        label = doc.metadata.get("label")
        if label == settings.spam_label:
            doc.metadata["label"] = settings.not_spam_label
        else:
            doc.metadata["label"] = settings.spam_label

    return generate_and_store_embeddings(docs, settings.label_flipping_attack_embeddings_store_path)
