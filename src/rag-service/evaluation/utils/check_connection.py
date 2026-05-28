import time
import requests

from rag_service.constants import RAG_SERVICE_LOCAL_URL


def check_connection(logger, retries: int = 3) -> bool:
    """ Checks if the RAG service is reachable locally. """
    for _ in range(retries):
        try:
            request = requests.get(RAG_SERVICE_LOCAL_URL, timeout=2)
            if request.status_code == 200:
                return True
        except requests.RequestException:
            pass
        time.sleep(0.3)
    logger.info("RAG service not reachable at %s.", RAG_SERVICE_LOCAL_URL)
    return False
