from typing import Dict

from detection_strategies_evaluation_experiments.experiment_scripts.utils.dataset_embeddings_loading import load_dataset_embeddings
from rag_service.config import get_settings
from detection_strategies_evaluation_experiments.experiment_scripts.enums.datasets import Dataset
from detection_strategies_evaluation_experiments.experiment_scripts.enums.attack_types import AttackType
from detection_strategies_evaluation_experiments.experiment_scripts.enums.batch_poisoning_mix_percentage import BatchPoisoningMixPercentage
from logger.logging_config import get_logger

settings = get_settings()
logger = get_logger("ExperimentDatasetsSplitPreparation")

def _add_ground_truth_labels_to_entries(entries: list[Dict], is_poisoned: bool) -> list[Dict]:
    """
    Adds ground truth labels to each entry in the given list of entries.
    The label indicates whether the entry is poisoned or not.
    """
    for entry in entries:
        entry['ground_truth_is_poisoned'] = is_poisoned
    return entries

def _combine_legit_and_poisoned_data_in_split(
    legit_data: list[Dict], poisoned_data: list[Dict],
    legit_per_split,
    poisoned_per_split,
    split_i,
    legit_entries_percentage
) -> list[Dict]:
    """
    Combines legit and poisoned data into a single batch for the given split index.
    The specified percentage of legit entries is maintained in the entry distribution of the batch.
    """
    start_legit = split_i * legit_per_split
    end_legit = start_legit + legit_per_split
    start_poisoned = split_i * poisoned_per_split
    end_poisoned = start_poisoned + poisoned_per_split

    batch = []
    legit_index = start_legit
    poisoned_index = start_poisoned

    for i in range(legit_per_split + poisoned_per_split):
        if (i % 100) < legit_entries_percentage and legit_index < end_legit:
            batch.append(legit_data[legit_index])
            legit_index += 1
        elif poisoned_index < end_poisoned and poisoned_index < len(poisoned_data):
            batch.append(poisoned_data[poisoned_index])
            poisoned_index += 1
        elif legit_index < end_legit and legit_index < len(legit_data):
            batch.append(legit_data[legit_index])
            legit_index += 1

    return batch


def _split_data_into_n_batches(legit_data: list[Dict], poisoned_data: list[Dict], batch_poisoning_percentage: BatchPoisoningMixPercentage, n_splits: int) -> list[list[Dict]]:
    """
    Computes n splits using the given legit and poisoned data. batch poisoning percentage.
    Each split contains the specified percentage of poisoned data examples according to the batch poisoning percentage, the rest being
    legit data examples.
    """
    batches = []

    _add_ground_truth_labels_to_entries(legit_data, is_poisoned=False)
    _add_ground_truth_labels_to_entries(poisoned_data, is_poisoned=True)

    total_legit = len(legit_data)
    total_poisoned = len(poisoned_data)

    legit_entries_percentage = 100 - batch_poisoning_percentage.value
    poisoned_entries_percentage = batch_poisoning_percentage.value

    max_legit = (total_poisoned * legit_entries_percentage) // poisoned_entries_percentage if poisoned_entries_percentage > 0 else total_legit
    max_poisoned = (total_legit * poisoned_entries_percentage) // legit_entries_percentage if legit_entries_percentage > 0 else total_poisoned

    legit_data = legit_data[:min(total_legit, max_legit)]
    poisoned_data = poisoned_data[:min(total_poisoned, max_poisoned)]
    total_legit = len(legit_data)
    total_poisoned = len(poisoned_data)

    if legit_entries_percentage > poisoned_entries_percentage:
        legit_per_split = (total_legit // n_splits)
        poisoned_per_split = (legit_per_split * poisoned_entries_percentage) // legit_entries_percentage
    else:
        poisoned_per_split = (total_poisoned // n_splits)
        legit_per_split = (poisoned_per_split * legit_entries_percentage) // poisoned_entries_percentage

    logger.info("Preparing %d splits with %d percent of poisoned entries per split.", n_splits, batch_poisoning_percentage.value)

    for split_i in range(n_splits):
        batch = _combine_legit_and_poisoned_data_in_split(legit_data, poisoned_data, legit_per_split, poisoned_per_split, split_i, legit_entries_percentage)
        batches.append(batch)

    logger.info("Prepared %d splits each containing %d legit entries and %d poisoned entries.", n_splits, legit_per_split, poisoned_per_split)

    return batches


def prepare_experiment_splits(dataset: Dataset, attack_type: AttackType, batch_poisoning_percentage: BatchPoisoningMixPercentage, n_splits: int =10) -> list[list[Dict]]:
    """
    Prepares the experiment splits based on the dataset, attack type and batch poisoning mix percentage.
    Loads the precomputed embeddings for the given dataset and attack type.
    Mixes the legit data ingestion embeddings with the poisoned embeddings based on the batch poisoning mix percentage.
    Prepares n_splits splits of the mixed data.
    """
    legit_data_embeddings, attack_data_embeddings = load_dataset_embeddings(dataset, attack_type)
    splits = _split_data_into_n_batches(legit_data_embeddings, attack_data_embeddings, batch_poisoning_percentage, n_splits)
    return splits
