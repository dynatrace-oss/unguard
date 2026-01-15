from typing import Dict

from detection_strategies_evaluation_experiments.experiment_scripts.utils.dataset_embeddings_loading import load_dataset_embeddings
from rag_service.config import get_settings
from detection_strategies_evaluation_experiments.experiment_scripts.enums.datasets import Dataset
from detection_strategies_evaluation_experiments.experiment_scripts.enums.attack_types import AttackType
from detection_strategies_evaluation_experiments.experiment_scripts.enums.batch_poisoning_mix_percentage import BatchPoisoningMixPercentage
from logger.logging_config import get_logger

settings = get_settings()
logger = get_logger("ExperimentDatasetsSplitPreparation")


def _split_data_into_n_batches(legit_data: list[Dict], poisoned_data: list[Dict], batch_poisoning_percentage: BatchPoisoningMixPercentage, n_splits: int) -> list[list[Dict]]:
    """
    Computes n splits using the given legit and poisoned data. batch poisoning percentage.
    Each split contains the specified percentage of poisoned data examples according to the batch poisoning percentage, the rest being
    legit data examples.
    """
    batches = []
    total_legit = len(legit_data)
    total_poisoned = len(poisoned_data)

    legit_entries_percentage = 100 - batch_poisoning_percentage.value
    poisoned_entries_percentage = batch_poisoning_percentage.value

    if legit_entries_percentage > poisoned_entries_percentage:
        legit_per_split = (total_legit // n_splits)
        poisoned_per_split = (legit_per_split * poisoned_entries_percentage) // legit_entries_percentage
    else:
        poisoned_per_split = (total_poisoned // n_splits)
        legit_per_split = (poisoned_per_split * legit_entries_percentage) // poisoned_entries_percentage

    logger.info("Preparing %d splits with %d percent of poisoned entries per split.", n_splits, batch_poisoning_percentage.value/100)

    for split_i in range(n_splits):
        start_legit = split_i * legit_per_split
        end_legit = start_legit + legit_per_split
        start_poisoned = split_i * poisoned_per_split
        end_poisoned = start_poisoned + poisoned_per_split

        batch = legit_data[start_legit:end_legit] + poisoned_data[start_poisoned:end_poisoned]
        batches.append(batch)

    return batches

def prepare_experiment_splits(dataset: Dataset, attack_type: AttackType, batch_poisoning_percentage: BatchPoisoningMixPercentage, n_splits: int =10) -> list[list[Dict]]:
    """
    Prepares the experiment splits based on the dataset, attack type and batch poisoning mix percentage.
    Loads the precomputed embeddings for the given dataset and attack type.
    Mixes the legit data ingestion embeddings with the poisoned embeddings based on the batch poisoning mix percentage.
    Prepares n_splits splits of the mixed data.
    """
    legit_data_embeddings, attack_data_embeddings = load_dataset_embeddings(dataset, attack_type)
    return _split_data_into_n_batches(legit_data_embeddings, attack_data_embeddings, batch_poisoning_percentage, n_splits)
