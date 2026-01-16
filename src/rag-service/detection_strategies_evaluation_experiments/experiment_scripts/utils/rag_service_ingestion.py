from typing import List, Dict
import requests

from rag_service.constants import INGESTION_ENDPOINT_URL

from rag_service.schemas import DetailedIngestionResult

INGESTION_BATCH_SIZE = 100 # max 500

def ingest_into_rag(entries: List[Dict]) -> List[DetailedIngestionResult]:
    """
    Ingests entries into the RAG service in batches via the given ingestion URL.
    Returns ingestion results for all entries, including which ones were ingested successfully.
    """

    ingestion_results = []

    total_entries = len(entries)
    for start in range(0, total_entries, INGESTION_BATCH_SIZE):
        batch = entries[start:start + INGESTION_BATCH_SIZE]
        json_payload = {"entries": batch}

        response = requests.post(INGESTION_ENDPOINT_URL, json=json_payload, timeout=120)
        if response.status_code != 200:
            raise RuntimeError(f"Error during ingestion ({response.status_code}): {response.text}")

        response_data = response.json()

        """ The route returns an object of this form:
        class DetailedIngestionResult(BaseModel):
            id: str
            status: Literal["ingested", "failed"]
            error: str = Field(default=None, description="Error message if ingestion failed")

        class DetailedIngestionResponse(BaseModel):
            success: bool
            message: str
            results: List[DetailedIngestionResult]
        """

        batch_results = response_data.get("results", [])
        ingestion_results.extend(batch_results)

    return ingestion_results
