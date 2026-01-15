from typing import Dict

from detection_strategies_evaluation_experiments.experiment_scripts.enums.datasets import Dataset
from rag_service.config import get_settings
from rag_service.rag_pipeline.utils.read_precomputed_embeddings import validate_embeddings_directory
from rag_service.rag_pipeline.utils.read_precomputed_embeddings import (
    get_list_of_embeddings_files,
    read_embeddings_files
)
from detection_strategies_evaluation_experiments.experiment_scripts.enums.attack_types import AttackType
from logger.logging_config import get_logger

settings = get_settings()
logger = get_logger("DatasetEmbeddingsLoader")


def _load_experiment_data_embeddings(embeddings_store_path) -> list[Dict]:
    """
    Loads the precomputed embeddings for the legit data ingestion dataset from settings.le
    """
    validate_embeddings_directory(embeddings_store_path, logger)
    logger.info("Reading precomputed experiment data embeddings from %s ...", embeddings_store_path)
    files = get_list_of_embeddings_files(embeddings_store_path)
    entries = list(read_embeddings_files(files, logger))
    logger.info("Loaded %d entries.", len(entries))
    return entries


def _load_sms_spam_dataset_embeddings(attack_type: AttackType) -> tuple[list[Dict], list[Dict]]:
    """
    Loads the required precomputed embeddings of the SMS spam detection dataset for the given attack type.
    """
    legit_data_embeddings = _load_experiment_data_embeddings(settings.sms_spam_legit_embeddings_store_path)

    if attack_type == AttackType.LABEL_FLIPPING:
        attack_embeddings_store_path = settings.label_flipping_experiment_dataset_store_path_for_sms_spam_dataset
    elif attack_type == AttackType.KEYWORD_INJECTION:
        attack_embeddings_store_path = settings.keyword_attack_experiment_dataset_store_path_for_sms_spam_dataset
    elif attack_type == AttackType.TARGETED_LABEL_FLIPPING:
        attack_embeddings_store_path = settings.targeted_label_flipping_experiment_dataset_store_path_for_sms_spam_dataset
    else:
        raise ValueError(f"Unsupported attack type: {attack_type}")
    attack_data_embeddings = _load_experiment_data_embeddings(attack_embeddings_store_path)

    return legit_data_embeddings, attack_data_embeddings

def _load_enron_dataset_embeddings(attack_type: AttackType) -> tuple[list[Dict], list[Dict]]:
    """
    Loads the required precomputed embeddings of the Enron spam detection dataset for the given attack type.
    """
    legit_data_embeddings = _load_experiment_data_embeddings(settings.enron_legit_embeddings_store_path)

    if attack_type == AttackType.LABEL_FLIPPING:
        attack_embeddings_store_path = settings.label_flipping_experiment_dataset_store_path_for_enron_dataset
    elif attack_type == AttackType.KEYWORD_INJECTION:
        attack_embeddings_store_path = settings.keyword_attack_experiment_dataset_store_path_for_enron_dataset
    elif attack_type == AttackType.TARGETED_LABEL_FLIPPING:
        attack_embeddings_store_path = settings.targeted_label_flipping_experiment_dataset_store_path_for_enron_dataset
    else:
        raise ValueError(f"Unsupported attack type: {attack_type}")
    attack_data_embeddings = _load_experiment_data_embeddings(attack_embeddings_store_path)

    return legit_data_embeddings, attack_data_embeddings


def _load_spam_assassin_dataset_embeddings(attack_type: AttackType) -> tuple[list[Dict], list[Dict]]:
    """
    Loads the required precomputed embeddings of the SpamAssassin spam detection dataset for the given attack type.
    """
    legit_data_embeddings = _load_experiment_data_embeddings(settings.spam_assassin_legit_embeddings_store_path)

    if attack_type == AttackType.LABEL_FLIPPING:
        attack_embeddings_store_path = settings.label_flipping_experiment_dataset_store_path_for_spam_assassin_dataset
    elif attack_type == AttackType.KEYWORD_INJECTION:
        attack_embeddings_store_path = settings.keyword_attack_experiment_dataset_store_path_for_spam_assassin_dataset
    elif attack_type == AttackType.TARGETED_LABEL_FLIPPING:
        attack_embeddings_store_path = settings.targeted_label_flipping_experiment_dataset_store_path_for_spam_assassin_dataset
    else:
        raise ValueError(f"Unsupported attack type: {attack_type}")
    attack_data_embeddings = _load_experiment_data_embeddings(attack_embeddings_store_path)

    return legit_data_embeddings, attack_data_embeddings

def _load_deysi_dataset_embeddings(attack_type: AttackType) -> tuple[list[Dict], list[Dict]]:
    """
    Loads the required precomputed embeddings of the Deysi spam detection dataset for the given attack type.
    """
    legit_data_embeddings = _load_experiment_data_embeddings(settings.deysi_spam_detection_legit_embeddings_store_path)

    if attack_type == AttackType.LABEL_FLIPPING:
        attack_embeddings_store_path = settings.label_flipping_experiment_dataset_store_path_for_deysi_spam_detection_dataset
    elif attack_type == AttackType.KEYWORD_INJECTION:
        attack_embeddings_store_path = settings.keyword_attack_experiment_dataset_store_path_for_deysi_spam_detection_dataset
    elif attack_type == AttackType.TARGETED_LABEL_FLIPPING:
        attack_embeddings_store_path = settings.targeted_label_flipping_experiment_dataset_store_path_for_deysi_spam_detection_dataset
    else:
        raise ValueError(f"Unsupported attack type: {attack_type}")
    attack_data_embeddings = _load_experiment_data_embeddings(attack_embeddings_store_path)

    return legit_data_embeddings, attack_data_embeddings

def load_dataset_embeddings(dataset: Dataset, attack_type: AttackType) -> tuple[list[Dict], list[Dict]]:
    """
    Loads the required precomputed embeddings of the given dataset for the given attack type.
    """
    if dataset == Dataset.SMS_SPAM:
        return _load_sms_spam_dataset_embeddings(attack_type)
    elif dataset == Dataset.ENRON:
        return _load_enron_dataset_embeddings(attack_type)
    elif dataset == Dataset.SPAM_ASSASSIN:
        return _load_spam_assassin_dataset_embeddings(attack_type)
    elif dataset == Dataset.DEYSI_SPAM_DETECTION:
        return _load_deysi_dataset_embeddings(attack_type)
    else:
        raise ValueError(f"Unsupported dataset: {dataset}")
