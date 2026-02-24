from typing import List, Dict

from data_poisoning_detection_strategies.embedding_space_similarity.embedding_space_similarity_on_entry_level import \
    detect_data_poisoning_using_embedding_similarity_on_entry_level
from data_poisoning_detection_strategies.embeddings_cluster_analysis.embeddings_cluster_analysis import \
    detect_data_poisoning_via_embeddings_cluster_and_pattern_analysis
from data_poisoning_detection_strategies.neighbour_label_consistency.neighbour_label_consistency_with_ann import \
    detect_data_poisoning_using_approximate_neighbour_label_analysis
from rag_service.config import get_settings

settings = get_settings()


def detect_data_poisoning_using_combined_strategy(
    new_entries: List[Dict],
    kb_contents: List[Dict],
    logger
) -> List[str]:
    """
    Data Poisoning Detection Strategy combining multiple strategies, namely embedding space similarity on entry level,
    embeddings cluster analysis and neighbour label consistency with approximate nearest neighbours, allowing to detect
    different types of data poisoning attacks, including label flipping and keyword injection attacks.

    Returns a list of ids of poisoned entries.
    """

    logger.info("Running data poisoning detections using combined detection strategies...")

    detection_results_embedding_similarity = detect_data_poisoning_using_embedding_similarity_on_entry_level(new_entries, kb_contents, logger)
    detection_results_cluster_analysis = detect_data_poisoning_via_embeddings_cluster_and_pattern_analysis(new_entries, logger)
    detection_results_approximate_neighbour_label_consistency = detect_data_poisoning_using_approximate_neighbour_label_analysis(new_entries, kb_contents, logger)

    detection_results_aggregated: List[str] = []

    for detection_result in [detection_results_embedding_similarity, detection_results_cluster_analysis, detection_results_approximate_neighbour_label_consistency]:
        for entry_id in detection_result:
            if entry_id not in detection_results_aggregated:
                detection_results_aggregated.append(entry_id)

    return detection_results_aggregated
