from detection_strategies_evaluation_experiments.experiment_scripts.enums.attack_types import AttackType
from detection_strategies_evaluation_experiments.experiment_scripts.enums.batch_poisoning_mix_percentage import \
    BatchPoisoningMixPercentage
from detection_strategies_evaluation_experiments.experiment_scripts.enums.datasets import Dataset
from detection_strategies_evaluation_experiments.experiment_scripts.utils.metrics_computation import compute_metrics
from detection_strategies_evaluation_experiments.experiment_scripts.utils.prepare_experiment_splits import \
    prepare_experiment_splits
from detection_strategies_evaluation_experiments.experiment_scripts.utils.rag_service_ingestion import ingest_into_rag
from detection_strategies_evaluation_experiments.experiment_scripts.utils.rag_service_process_handling import \
    start_rag_service, stop_rag_service
from evaluation.utils.print_and_store_results import store_results_in_file
from rag_service.config import DataPoisoningDetectionStrategy
from rag_service.schemas import DetailedIngestionResult
from logger.logging_config import get_logger
from rag_service.config import get_settings

DETECTION_STRATEGY = DataPoisoningDetectionStrategy.EMBEDDINGS_CLUSTER_ANALYSIS
DATASET_NAME = Dataset.ENRON
BATCH_POISONING_PERCENTAGE = BatchPoisoningMixPercentage.ONLY_POISONED
N_SPLITS = 10
ATTACK_TYPE = AttackType.KEYWORD_INJECTION

settings = get_settings()

logger = get_logger("EvaluationExperimentRunner")

def run_evaluation_experiment(detection_strategy, attack_type, dataset_name, batch_poisoning_percentage, n_splits):
    experiment_splits = prepare_experiment_splits(dataset_name, attack_type, batch_poisoning_percentage, n_splits)

    process = start_rag_service(detection_strategy=detection_strategy, dataset=dataset_name)

    try:
        ingestion_results_aggregated_over_splits: list[DetailedIngestionResult] = []
        for split in experiment_splits:
            ingestion_results = ingest_into_rag(split)
            ingestion_results_aggregated_over_splits.extend(ingestion_results)

        id_to_ground_truth_of_entries = {}
        for split in experiment_splits:
            for entry in split:
                id_to_ground_truth_of_entries[entry['id']] = entry['ground_truth_is_poisoned']

        results = compute_metrics(ingestion_results_aggregated_over_splits, id_to_ground_truth_of_entries)

        results['experiment_configuration'] = {
            'detection_strategy': detection_strategy.value,
            'attack_type': attack_type.value,
            'dataset_name': dataset_name.value,
            'batch_poisoning_percentage': batch_poisoning_percentage.value,
            'n_splits': n_splits
        }

        evaluation_results_path = settings.detection_evaluation_experiment_results_store_path
        store_results_in_file(evaluation_results_path, results, logger, filename="evaluation_results")
    finally:
        stopped_successfully = stop_rag_service(process)
        if not stopped_successfully:
            print("RAG service did not stop successfully.")
        else:
            print("RAG service stopped successfully.")


if __name__ == "__main__":
    run_evaluation_experiment(DETECTION_STRATEGY, ATTACK_TYPE, DATASET_NAME, BATCH_POISONING_PERCENTAGE, N_SPLITS)
