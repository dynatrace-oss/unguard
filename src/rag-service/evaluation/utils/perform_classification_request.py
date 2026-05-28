import requests
from rag_service.constants import CLASSIFY_TEXT_ENDPOINT_URL

def perform_classification_request(text: str, timeout: int = 120) -> str:
    """Performs a classification request to the RAG service with the given text."""
    payload = {"text": text}
    response = requests.post(CLASSIFY_TEXT_ENDPOINT_URL, json=payload, timeout=timeout)
    response.raise_for_status()
    return response.json()["classification"]
