from typing import List, Dict
import requests

from rag_service.constants import RAG_SERVICE_LOCAL_URL, INGESTION_ENDPOINT

INGESTION_BATCH_SIZE = 500
INGESTION_URL = RAG_SERVICE_LOCAL_URL + INGESTION_ENDPOINT

def ingest_poisoned_entries(entries: List[Dict], logger):
    """ Ingests poisoned entries into the RAG service in batches via the given ingestion URL. """
    num_ingested = 0
    total_entries = len(entries)
    for start in range(0, total_entries, INGESTION_BATCH_SIZE):
        batch = entries[start:start + INGESTION_BATCH_SIZE]
        json_payload = {"entries": batch}

        response = requests.post(INGESTION_URL, json=json_payload, timeout=120)
        if response.status_code != 200:
            raise RuntimeError(f"Error during ingestion ({response.status_code}): {response.text}")

        num_ingested += len(batch)
        logger.info("Ingested %d/%d poisoned entries", num_ingested, total_entries)
    return num_ingested
