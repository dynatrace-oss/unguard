from typing import List, Dict
import numpy as np


def use_majority_voting(nearest_neighbor_labels: List[str], new_entry_label: str) -> bool:
    """
    Determines if the new entry is poisoned using majority voting on the labels of its nearest neighbors.
    Returns true if the new entry is considered poisoned.
    """
    label_counts: Dict[str, int] = {}
    for label in nearest_neighbor_labels:
        label_counts[label] = label_counts.get(label, 0) + 1

    majority_label = max(label_counts, key=lambda k: label_counts[k])
    if majority_label != new_entry_label:
        return True

    return False

def use_distance_weighted_voting(nearest_neighbor_labels: List[str], distances: np.ndarray, new_entry_label: str) -> bool:
    """
    Determines if the new entry is poisoned using distance-weighted voting on the labels of its nearest neighbors.
    Returns true if the new entry is considered poisoned.
    """
    total_weight_per_label: Dict[str, float] = {}
    for label, distance in zip(nearest_neighbor_labels, distances[0]):
        weight = 1 / (distance + 1e-5)
        total_weight_per_label[label] = total_weight_per_label.get(label, 0) + weight

    majority_label = max(total_weight_per_label, key=lambda k: total_weight_per_label[k])
    if majority_label != new_entry_label:
        return True

    return False

def use_threshold_based_knn(nearest_neighbor_labels: List[str], distances: np.ndarray, new_entry_label: str, distance_threshold: float) -> bool:
    """
    Determines if the new entry is poisoned using threshold-based KNN.
    Consider only neighbors within a certain distance threshold.
    Returns true if the new entry is considered poisoned.
    """
    entries_in_threshold = [distance for distance in distances[0] if distance <= distance_threshold]
    if not entries_in_threshold:
        return False

    labels_of_entries_in_threshold = [nearest_neighbor_labels[i] for i, distance in enumerate(distances[0]) if distance <= distance_threshold]

    return use_majority_voting(labels_of_entries_in_threshold, new_entry_label)
