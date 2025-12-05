from logger.logging_config import get_logger
from rag_service.config import get_settings

logger = get_logger("LegitDataIngestion")
settings = get_settings()

from evaluation.utils.check_connection import check_connection
from data_poisoning_attacks.utils.ingest_entries import ingest_entries
from rag_service.rag_pipeline.utils.read_precomputed_embeddings import (
    get_list_of_embeddings_files,
    read_embeddings_files,
    validate_embeddings_directory
)

def simulate_legit_data_ingestion():
    """
    Simulates a legit data ingestion to the RAG service with non-poisoned data.
    Ingests data into the RAG service with precomputed embeddings from the given path.
    """
    validate_embeddings_directory(settings.legit_data_embeddings_store_path, logger)
    if not check_connection(logger):
        return

    logger.info("Reading embeddings from %s ...", settings.legit_data_embeddings_store_path)
    files = get_list_of_embeddings_files(settings.legit_data_embeddings_store_path)
    entries = list(read_embeddings_files(files, logger))
    logger.info("Loaded %d entries.", len(entries))

    logger.info("Ingesting embeddings ...")
    total_ingested = ingest_entries(entries, logger)
    logger.info("Completed data ingestion: %d entries were ingested successfully.", total_ingested)


if __name__ == "__main__":
    simulate_legit_data_ingestion()
