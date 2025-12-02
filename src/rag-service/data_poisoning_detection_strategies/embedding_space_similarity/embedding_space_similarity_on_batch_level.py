from typing import List, Dict
import numpy as np

from data_poisoning_detection_strategies.embedding_space_similarity.utils.embeddings_computations import \
    compute_cosine_similarity, compute_embeddings_centroid
from data_poisoning_detection_strategies.embedding_space_similarity.utils.embeddings_extraction import \
    extract_spam_entries, extract_non_spam_entries
from rag_service.config import get_settings

settings = get_settings()

def _batch_is_poisoned(
        spam_new_entries_centroid: np.ndarray, non_spam_new_entries_centroid: np.ndarray,
        spam_in_kb_centroid: np.ndarray, non_spam_in_kb_centroid: np.ndarray, logger
) -> bool:
    if non_spam_new_entries_centroid is not None:
        non_spam_centroid_similarity = compute_cosine_similarity(non_spam_new_entries_centroid, non_spam_in_kb_centroid)
        non_spam_to_spam_centroid_similarity = compute_cosine_similarity(non_spam_new_entries_centroid, spam_in_kb_centroid)

        if non_spam_to_spam_centroid_similarity > non_spam_centroid_similarity:
            logger.warn(
                "Detected potential data poisoning based on non-spam centroid similarity."
                "(Non-spam to spam centroid similarity: %.4f > Non-spam centroid similarity: %.4f)",
                non_spam_to_spam_centroid_similarity,
                non_spam_centroid_similarity,
            )
            return True

    if spam_new_entries_centroid is not None:
        spam_centroid_similarity = compute_cosine_similarity(spam_new_entries_centroid, spam_in_kb_centroid)
        spam_to_non_spam_centroid_similarity = compute_cosine_similarity(spam_new_entries_centroid, non_spam_in_kb_centroid)

        if spam_to_non_spam_centroid_similarity > spam_centroid_similarity:
            logger.warn(
                "Detected potential data poisoning based on spam centroid similarity"
                "(Spam to non-spam centroid similarity: %.4f > Spam centroid similarity: %.4f)",
                spam_to_non_spam_centroid_similarity,
                spam_centroid_similarity,
            )
            return True

    return False


def detect_data_poisoning_using_embedding_similarity_in_batch(
    new_entries: List[Dict],
    kb_contents: List[Dict],
    logger
) -> bool:
    """
    Data Poisoning Detection Strategy using Embedding Space Similarity at Batch Level.

    Uses cosine similarity on centroids of embeddings.
    A batch of new entries is considered as poisoned, when its embeddings centroid for a label is more similar to the
    centroid of the opposite label in the KB than to the centroid of its own label.

    Returns true if poisoned data is detected among new entries.
    """
    logger.info("Running data poisoning detections strategy using embedding space similarity...")

    if not kb_contents or not new_entries:
        logger.info("Detection skipped: KB or new entries empty.")
        return False

    spam_embeddings_in_kb = extract_spam_entries(kb_contents)
    non_spam_embeddings_in_kb = extract_non_spam_entries(kb_contents)
    spam_embeddings_new_entries = extract_spam_entries(new_entries)
    non_spam_embeddings_new_entries = extract_non_spam_entries(new_entries)

    if spam_embeddings_in_kb.size == 0 or non_spam_embeddings_in_kb.size == 0:
        logger.info("Detection skipped: KB lacks spam or non-spam embeddings.")
        return False
    if spam_embeddings_new_entries.size == 0 and non_spam_embeddings_new_entries.size == 0:
        logger.info("Detection skipped: New entries lack spam and non-spam embeddings.")
        return False

    try:
        spam_in_kb_centroid = compute_embeddings_centroid(spam_embeddings_in_kb)
        non_spam_in_kb_centroid = compute_embeddings_centroid(non_spam_embeddings_in_kb)
        spam_new_entries_centroid = compute_embeddings_centroid(spam_embeddings_new_entries) if spam_embeddings_new_entries.size > 0 else None
        non_spam_new_entries_centroid = compute_embeddings_centroid(non_spam_embeddings_new_entries) if non_spam_embeddings_new_entries.size > 0 else None
    except ValueError as e:
        logger.warning("Error computing embedding centroids: %s. Detection aborted", e)
        return False

    return _batch_is_poisoned(spam_new_entries_centroid, non_spam_new_entries_centroid, spam_in_kb_centroid, non_spam_in_kb_centroid, logger)

