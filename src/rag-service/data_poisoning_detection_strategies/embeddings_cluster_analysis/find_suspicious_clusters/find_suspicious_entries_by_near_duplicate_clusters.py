import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from typing import Dict, List

from rag_service.config import get_settings

settings = get_settings()

# the threshold above which two entries are considered near duplicates (tuned)
SUSPICIOUS_SIMILARITY_THRESHOLD = 0.87

# the threshold proportion for near duplicates for an entry above which it is considered suspicious
NEAR_DUPLICATES_MAX_PROPORTION_THRESHOLD = 0.1

def find_suspicious_entries_by_near_duplicate_clusters(
    new_entries: List[Dict]
) -> List[str]:
    """
    Analyzes embeddings of the new entries to find near duplicate clusters indicating potential targeted data poisoning attacks.
    Returns a list of ids of suspicious entries.
    """

    suspicious_entries_ids = set()

    new_entries_embeddings = [entry.get("embedding") for entry in new_entries if "embedding" in entry]
    if new_entries_embeddings:
        new_entries_embeddings_array = np.array(new_entries_embeddings)
        similarity_between_new_entries = cosine_similarity(new_entries_embeddings_array)

        near_duplicates_max_proportion_threshold = (len(new_entries) * NEAR_DUPLICATES_MAX_PROPORTION_THRESHOLD)

        for i in range(len(new_entries)):
            near_duplicates_count = sum(1 for j in range(len(new_entries)) if i != j
                                        and similarity_between_new_entries[i][j] > SUSPICIOUS_SIMILARITY_THRESHOLD)
            if near_duplicates_count >= near_duplicates_max_proportion_threshold:
                suspicious_entries_ids.add(new_entries[i].get("id"))

    return list(suspicious_entries_ids)
