from typing import Dict, List

from data_poisoning_detection_strategies.embeddings_cluster_analysis.detect_suspicous_phrase_patterns.detect_suspicious_phrase_patterns import \
    detect_suspicious_phrase_patterns
from data_poisoning_detection_strategies.embeddings_cluster_analysis.find_suspicious_clusters.find_near_duplicate_clusters import \
    find_near_duplicate_clusters
from rag_service.config import get_settings

settings = get_settings()

def detect_data_poisoning_via_embeddings_cluster_and_pattern_analysis(
    new_entries: List[Dict],
    logger
) -> List[str]:
    """
    Data Poisoning Detection Strategy for targeted Data Poisoning Attacks, such as Keyword Attacks.

    Applies two subsequent analyses:
    1. Embeddings Cluster Analysis to find near duplicate clusters.
    2. Phrase Pattern Analysis using n-grams on the suspicious subset found in step 1 to identify suspicious phrase patterns.

    Logs warnings for suspicious phrase patterns if detected.
    Returns a list of ids of suspicious entries.
    """

    logger.info("Running data poisoning detections strategy using embeddings cluster analysis and phrase pattern analysis...")

    suspicious_entries_ids = find_near_duplicate_clusters(new_entries)
    suspicious_subset = [entry for entry in new_entries if entry.get("id") in suspicious_entries_ids]

    if suspicious_subset:
        suspicious_phrase_patterns = detect_suspicious_phrase_patterns(suspicious_subset, logger)

        if suspicious_phrase_patterns:
            logger.warning("Suspicious phrase patterns detected in suspicious entries, indicating potential data "
                           "poisoning: %s", suspicious_phrase_patterns)
        else:
            logger.info(
                "No consistent suspicious phrase patterns detected in suspicious entries."
            )

    return list(suspicious_entries_ids)
