from typing import List
from llama_index.core import Document

from logger.logging_config import get_logger
from rag_service.config import get_settings
from rag_service.embeddings_precomputation.generate_and_store_embeddings import generate_and_store_embeddings

logger = get_logger("DataPreprocessor")
settings = get_settings()


def prepare_keyword_attack_datasets(docs: List[Document]) -> int:
    """Prepares the dataset for the keyword attack and precomputes the embeddings"""

    logger.info("Preparing keyword attack dataset for %d documents...", len(docs))
    attack_docs = [doc for doc in docs if doc.metadata.get("label") == "not_spam"]
    attack_docs = [
        Document(
            text=doc.text + " Donaudampfschifffahrtselektrizitätenhauptbetriebswerkbauunterbeamtengesellschaft",
            metadata=doc.metadata
        )
        for doc in attack_docs
    ]
    num_of_computed_attack_embeddings = generate_and_store_embeddings(attack_docs, settings.keyword_attack_embeddings_store_path)

    attack_success_evaluation_docs = [doc for doc in docs if doc.metadata.get("label") == "spam"]
    attack_success_evaluation_docs = [
        Document(
            text=doc.text + " Donaudampfschifffahrtselektrizitätenhauptbetriebswerkbauunterbeamtengesellschaft",
            metadata=doc.metadata
        )
        for doc in attack_success_evaluation_docs
    ]

    num_of_computed_evaluation_embeddings = generate_and_store_embeddings(attack_success_evaluation_docs, settings.keyword_attack_evaluation_embeddings_store_path)


    return num_of_computed_attack_embeddings + num_of_computed_evaluation_embeddings
