from typing import List, Dict
import numpy as np

from data_poisoning_detection_strategies.embedding_space_similarity.utils.embeddings_computations import \
    compute_cosine_similarity, compute_embeddings_centroid
from data_poisoning_detection_strategies.embedding_space_similarity.utils.embeddings_extraction import \
    extract_spam_entries, extract_non_spam_entries
from rag_service.config import get_settings

settings = get_settings()

def _entry_is_poisoned(
    new_entry: Dict,
    spam_in_kb_centroid: np.ndarray,
    non_spam_in_kb_centroid: np.ndarray,
) -> bool:
    """
    Compares an entry against KB contents using embedding space similarity to detect potential data poisoning.
    An entry is considered as poisoned, when its embedding is more similar to the centroid of the opposite label in the
    KB than to the centroid of its own label.
    Returns true if the new entry is detected as poisoned.
    """

    new_entry_embedding = np.array(new_entry["embedding"])
    new_entry_label = new_entry.get("label", "").lower().strip()

    new_entry_to_spam_similarity = compute_cosine_similarity(new_entry_embedding, spam_in_kb_centroid)
    new_entry_to_non_spam_similarity = compute_cosine_similarity(new_entry_embedding, non_spam_in_kb_centroid)

    if new_entry_label == settings.spam_label:
        if new_entry_to_non_spam_similarity > new_entry_to_spam_similarity:
            return True
    elif new_entry_label == settings.not_spam_label:
        if new_entry_to_spam_similarity > new_entry_to_non_spam_similarity:
            return True

    return False


def detect_data_poisoning_using_embedding_similarity_on_entry_level(
    new_entries: List[Dict],
    kb_contents: List[Dict],
    logger
) -> List[str]:
    """
    Data Poisoning Detection Strategy using Embedding Space Similarity at entry level.

    Uses cosine similarity on centroids of embeddings of spam and non-spam entries in the KB.
    Each new entry is compared against the centroids of spam and non-spam entries in the KB.
    Returns a list of ids of poisoned entries.
    """

    logger.info("Running data poisoning detections strategy using embedding space similarity on entry level...")

    if not kb_contents or not new_entries:
        return []

    spam_embeddings_in_kb = extract_spam_entries(kb_contents)
    non_spam_embeddings_in_kb = extract_non_spam_entries(kb_contents)

    try:
        spam_in_kb_centroid = compute_embeddings_centroid(spam_embeddings_in_kb)
        non_spam_in_kb_centroid = compute_embeddings_centroid(non_spam_embeddings_in_kb)
    except ValueError as e:
        logger.warning("Error computing embedding centroids of Knowledge Base content: %s. Detection aborted", e)
        return []

    detection_results: List[str] = []

    for new_entry in new_entries:
        poisoned = _entry_is_poisoned(new_entry, spam_in_kb_centroid, non_spam_in_kb_centroid)
        if poisoned:
            detection_results.append(new_entry.get("id"))

    return detection_results
