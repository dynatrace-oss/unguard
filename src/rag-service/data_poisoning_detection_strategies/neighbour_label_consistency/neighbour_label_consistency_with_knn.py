from typing import List, Dict
import numpy as np
from sklearn.neighbors import NearestNeighbors

from data_poisoning_detection_strategies.neighbour_label_consistency.utils.decision_strategies import \
    use_distance_weighted_voting, use_majority_voting, use_threshold_based_knn
from data_poisoning_detection_strategies.neighbour_label_consistency.utils.fit_model import fit_knn
from rag_service.config import get_settings, NNLabelDecisionVariant

settings = get_settings()

N_NEIGHBOURS = 10
DISTANCE_THRESHOLD = 0.2


def _entry_is_poisoned(
    new_entry: Dict,
    knn: NearestNeighbors,
    kb_labels: List[str],
    knn_variant: NNLabelDecisionVariant = settings.label_consistency_detection_decision_variant or NNLabelDecisionVariant.MAJORITY_VOTING,
) -> bool:
    """
    Uses KNN to find the nearest neighbours of the new entry among the knowledge base contents.
    Analyzes the labels of the nearest neighbours to determine if the new entry is poisoned.

    Different strategies for the neighbour label analysis can be applied (configured via knn_variant):
    - Majority Voting
    - Distance-Weighted Voting
    - Threshold-Based KNN
    """
    new_entry_embedding = np.array(new_entry["embedding"], dtype=float).reshape(1, -1)
    new_entry_label = str(new_entry.get("label", "")).lower().strip()

    distances, nearest_neighbors = knn.kneighbors(new_entry_embedding, return_distance=True)

    neighbour_labels = [kb_labels[i] for i in nearest_neighbors[0]]

    if knn_variant == NNLabelDecisionVariant.DISTANCE_WEIGHTED_VOTING:
        return use_distance_weighted_voting(neighbour_labels, distances, new_entry_label)
    if knn_variant == NNLabelDecisionVariant.THRESHOLD_BASED_KNN:
        return use_threshold_based_knn(neighbour_labels, distances, new_entry_label, distance_threshold = DISTANCE_THRESHOLD)
    else:
        return use_majority_voting(neighbour_labels, new_entry_label)


def detect_data_poisoning_using_neighbour_label_analysis(
    new_entries: List[Dict],
    kb_contents: List[Dict],
    logger,
) -> List[str]:
    """
    Data Poisoning Detection Strategy using KNN to detect label inconsistencies among nearest neighbours.
    Returns a list of IDs of poisoned entries.
    """
    logger.info("Running data poisoning detection strategy using KNN label consistency...")

    if not kb_contents or not new_entries:
        return []

    kb_labels: List[str] = [str(entry.get("label")).lower().strip() for entry in kb_contents]

    knn = fit_knn(kb_contents, number_of_neighbours=N_NEIGHBOURS)

    suspicious_entries_ids: List[str] = []
    for new_entry in new_entries:
        if _entry_is_poisoned(new_entry, knn, kb_labels):
            suspicious_entry_id = new_entry.get("id")
            if suspicious_entry_id is not None:
                suspicious_entries_ids.append(suspicious_entry_id)

    return suspicious_entries_ids
