import requests
from rag_service.constants import RAG_SERVICE_LOCAL_URL, CLASSIFY_TEXT_ENDPOINT

def perform_classification_request(text: str, timeout: int = 60) -> str:
    """Performs a classification request to the RAG service with the given text."""
    payload = {"text": text}
    response = requests.post(RAG_SERVICE_LOCAL_URL + CLASSIFY_TEXT_ENDPOINT, json=payload, timeout=timeout)
    response.raise_for_status()
    return response.json()["classification"]
