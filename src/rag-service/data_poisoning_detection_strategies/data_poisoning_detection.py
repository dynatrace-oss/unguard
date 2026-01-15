from typing import List, Dict

from data_poisoning_detection_strategies.embedding_space_similarity.embedding_space_similarity_on_batch_level import \
    detect_data_poisoning_using_embedding_similarity_in_batch

from data_poisoning_detection_strategies.embedding_space_similarity.embedding_space_similarity_on_entry_level import \
    detect_data_poisoning_using_embedding_similarity_on_entry_level
from data_poisoning_detection_strategies.embeddings_cluster_analysis.embeddings_cluster_analysis import \
    detect_data_poisoning_via_embeddings_cluster_and_pattern_analysis
from data_poisoning_detection_strategies.neighbour_label_consistency.neighbour_label_consistency_with_ann import \
    detect_data_poisoning_using_approximate_neighbour_label_analysis
from data_poisoning_detection_strategies.neighbour_label_consistency.neighbour_label_consistency_with_knn import \
    detect_data_poisoning_using_neighbour_label_analysis
from rag_service.config import DataPoisoningDetectionStrategy


def _return_all_ids_as_list(new_entries: List[Dict]) -> List[str]:
    ids_list: List[str] = [entry["id"] for entry in new_entries if "id" in entry and entry["id"] is not None]
    return ids_list

def run_data_poisoning_detection(
    detection_strategy: DataPoisoningDetectionStrategy,
    new_entries: List[Dict],
    kb_contents: List[Dict],
    logger
) -> List[str]:
    """
    Runs the selected data poisoning detection strategy.
    Returns a list of poisoned entries.
    """

    if detection_strategy == DataPoisoningDetectionStrategy.EMBEDDING_SPACE_SIMILARITY_ON_BATCH_LEVEL:
        is_poisoned = detect_data_poisoning_using_embedding_similarity_in_batch(new_entries, kb_contents, logger)
        if is_poisoned:
            return _return_all_ids_as_list(new_entries)
        else:
            return []

    elif detection_strategy == DataPoisoningDetectionStrategy.EMBEDDING_SPACE_SIMILARITY_ON_ENTRY_LEVEL:
        return detect_data_poisoning_using_embedding_similarity_on_entry_level(new_entries, kb_contents, logger)

    elif detection_strategy == DataPoisoningDetectionStrategy.EMBEDDINGS_CLUSTER_ANALYSIS:
        return detect_data_poisoning_via_embeddings_cluster_and_pattern_analysis(new_entries, logger)
    elif detection_strategy == DataPoisoningDetectionStrategy.K_NEAREST_NEIGHBOURS_LABEL_CONSISTENCY:
        return detect_data_poisoning_using_neighbour_label_analysis(new_entries, kb_contents, logger)
    elif detection_strategy == DataPoisoningDetectionStrategy.APPROXIMATE_K_NEAREST_NEIGHBOURS_LABEL_CONSISTENCY:
        return detect_data_poisoning_using_approximate_neighbour_label_analysis(new_entries, kb_contents, logger)
    else:
        logger.warn("Unknown data poisoning detection strategy: %s. "
                    "Falling back to default strategy 'embedding_similarity_entry_level'", detection_strategy)
        return detect_data_poisoning_using_embedding_similarity_on_entry_level(new_entries, kb_contents, logger)
