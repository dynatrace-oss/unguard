from pathlib import Path

from evaluation.utils.check_connection import check_connection
from data_poisoning_attacks.utils.ingest_poisoned_embeddings import ingest_poisoned_entries
from rag_service.rag_pipeline.utils.read_precomputed_embeddings import (
    get_list_of_embeddings_files,
    read_embeddings_files,
    validate_embeddings_directory
)

def run_data_poisoning_attack(embeddings_dir: Path, logger):
    """ Runs a data poisoning attack on the RAG service with precomputed embeddings from the given path"""
    validate_embeddings_directory(embeddings_dir, logger)
    if not check_connection(logger):
        return

    logger.info("Reading poisoned embeddings from %s ...", embeddings_dir)
    files = get_list_of_embeddings_files(embeddings_dir)
    entries = list(read_embeddings_files(files, logger))
    logger.info("Loaded %d poisoned entries.", len(entries))

    logger.info("Ingesting poisoned embeddings ...")
    total_ingested = ingest_poisoned_entries(entries, logger)
    logger.info("Completed data poisoning attack: %d poisoned entries were ingested successfully.", total_ingested)
