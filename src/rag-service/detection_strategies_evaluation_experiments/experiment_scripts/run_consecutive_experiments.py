from detection_strategies_evaluation_experiments.experiment_scripts.enums.attack_types import AttackType
from detection_strategies_evaluation_experiments.experiment_scripts.enums.datasets import Dataset
from detection_strategies_evaluation_experiments.experiment_scripts.enums.batch_poisoning_mix_percentage import \
    BatchPoisoningMixPercentage
from rag_service.config import DataPoisoningDetectionStrategy
from detection_strategies_evaluation_experiments.experiment_scripts.run_single_evaluation_experiment import run_evaluation_experiment
from logger.logging_config import get_logger

logger = get_logger("ConsecutiveExperimentsRunner")

DETECTION_STRATEGY = DataPoisoningDetectionStrategy.EMBEDDING_SPACE_SIMILARITY_ON_ENTRY_LEVEL
Attack_TYPE = AttackType.LABEL_FLIPPING
N_SPLITS = 10

def run_consecutive_experiments(n_splits: int, detection_strategy=DETECTION_STRATEGY, attack_type=Attack_TYPE):
    """ For a given detection strategy and dataset, run multiple experiments with varying datasets and data poisoning levels"""
    logger.info("Starting consecutive experiments with detection strategy: %s, attack type: %s, n_splits: %d", detection_strategy.value, attack_type.value, n_splits)
    datasets = []
    for dataset in Dataset:
        datasets.append(dataset)

    batch_poisoning_percentages = []
    for percentage in BatchPoisoningMixPercentage:
        batch_poisoning_percentages.append(percentage)

    for dataset in datasets:
        for batch_poisoning_percentage in batch_poisoning_percentages:
                logger.info("Running experiment for dataset: %s, batch poisoning percentage: %s", dataset.value, batch_poisoning_percentage.value)
                run_evaluation_experiment(detection_strategy, attack_type, dataset, batch_poisoning_percentage, n_splits)

if __name__ == "__main__":
    run_consecutive_experiments(n_splits=N_SPLITS, detection_strategy=DETECTION_STRATEGY, attack_type=Attack_TYPE)
