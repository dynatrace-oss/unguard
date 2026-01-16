from typing import List, Dict
import requests

from rag_service.constants import INGESTION_ENDPOINT_URL

INGESTION_BATCH_SIZE = 100 # max 500

def ingest_entries(entries: List[Dict], logger):
    """ Ingests entries into the RAG service in batches via the given ingestion URL. """
    num_ingested_total = 0
    total_entries = len(entries)
    processed = 0
    for start in range(0, total_entries, INGESTION_BATCH_SIZE):
        batch = entries[start:start + INGESTION_BATCH_SIZE]
        json_payload = {"entries": batch}

        response = requests.post(INGESTION_ENDPOINT_URL, json=json_payload, timeout=120)
        if response.status_code != 200:
            raise RuntimeError(f"Error during ingestion ({response.status_code}): {response.text}")

        processed += len(batch)
        response_data = response.json()
        num_ingested_batch = sum(1 for result in response_data.get("results", []) if result.get("status") == "ingested")
        num_ingested_total += num_ingested_batch

        logger.info("Processed %d/%d entries: %d/%d of current batch were ingested successfully",
                    processed, total_entries, num_ingested_batch, len(batch))

    return num_ingested_total
