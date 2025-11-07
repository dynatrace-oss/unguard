from typing import List, Dict
import requests

INGESTION_BATCH_SIZE = 500

def ingest_poisoned_entries(entries: List[Dict], ingestion_url: str, logger):
    """ Ingests poisoned entries into the RAG service in batches via the given ingestion URL. """
    num_ingested = 0
    total_entries = len(entries)
    for start in range(0, total_entries, INGESTION_BATCH_SIZE):
        batch = entries[start:start + INGESTION_BATCH_SIZE]
        json_payload = {"entries": batch}

        response = requests.post(ingestion_url, json=json_payload, timeout=120)
        if response.status_code != 200:
            raise RuntimeError("Error during ingestion: %s:", response.text)

        num_ingested += len(batch)
        logger.info("Ingested %d/%d poisoned entries", num_ingested, total_entries)
    return num_ingested
