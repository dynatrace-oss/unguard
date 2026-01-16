import subprocess
import time
import os

from evaluation.utils.check_connection import check_connection
from logger import logging_config
from rag_service.config import DataPoisoningDetectionStrategy, NNLabelDecisionVariant
from rag_service.config import get_settings
from detection_strategies_evaluation_experiments.experiment_scripts.enums.datasets import Dataset

logger = logging_config.get_logger("RAGServiceProcessHandler")
settings = get_settings()


def _wait_for_service_startup():
    time.sleep(10)

    max_retries = 5
    retry_count = 0
    while not check_connection(logger) and retry_count < max_retries:
        time.sleep(5)
        retry_count += 1

def start_rag_service(detection_strategy: DataPoisoningDetectionStrategy, dataset: Dataset) -> subprocess.Popen:
    logger.info("Starting RAG service...")

    dataset_to_path = {
        Dataset.SMS_SPAM: str(settings.sms_spam_base_embeddings_store_path),
        Dataset.ENRON: str(settings.enron_base_embeddings_store_path),
        Dataset.SPAM_ASSASSIN: str(settings.spam_assassin_base_embeddings_store_path),
        Dataset.DEYSI_SPAM_DETECTION: str(settings.deysi_spam_detection_base_embeddings_store_path),
    }

    base_embeddings_store_path = dataset_to_path.get(dataset)
    if not base_embeddings_store_path:
        raise ValueError(f"Unsupported dataset: {dataset}")

    env = dict(
        **os.environ,
        DATA_POISONING_DETECTION_STRATEGY=detection_strategy.value,
        LABEL_CONSISTENCY_DETECTION_DECISION_VARIANT=NNLabelDecisionVariant.MAJORITY_VOTING.value,
        USE_DATA_POISONING_DETECTION="true",
        BASE_EMBEDDINGS_STORE_PATH=base_embeddings_store_path,
    )

    process = subprocess.Popen(
        ["uvicorn", "rag_service.main:app", "--host", "0.0.0.0", "--port", "8000", "--log-level", "critical"],
        stdout=subprocess.DEVNULL,
        env=env,
    )
    _wait_for_service_startup()
    return process

def stop_rag_service(process) -> bool:
    logger.info("Stopping RAG service...")
    process.terminate()
    process.wait()
    if process.poll() is None:
        return False
    return True
