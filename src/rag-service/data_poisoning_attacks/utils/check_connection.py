import time
import requests

def check_connection(url: str, retries: int = 3) -> bool:
    """ Checks if the RAG service is reachable locally. """
    for _ in range(retries):
        try:
            request = requests.get(url, timeout=2)
            if request.status_code == 200:
                return True
        except requests.RequestException:
            pass
        time.sleep(0.3)
    return False
