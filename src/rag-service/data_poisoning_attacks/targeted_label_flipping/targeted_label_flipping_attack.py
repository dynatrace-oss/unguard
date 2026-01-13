from llama_index.core import Document

from data_poisoning_attacks.utils.evaluate_attack_success_rate import evaluate_targeted_attack
from data_poisoning_attacks.utils.run_data_poisoning_attack import run_data_poisoning_attack
from evaluation.evaluate_model import evaluate_model
from logger.logging_config import get_logger
from rag_service.config import get_settings
from rag_service.data_loader.parquet_data_loader import DataLoader

logger = get_logger("LabelFlippingAttackSimulation")
settings = get_settings()


def _load_attack_success_evaluation_data() -> list[Document]:
    """Loads the test documents for evaluating the attack success rate."""
    logger.info("Loading test data for attack success rate evaluation...")
    return DataLoader().load_targeted_label_flipping_attack_success_evaluation_dataset()

def _evaluate_attack_success():
    """Evaluate the success rate of the targeted label flipping attack."""
    docs = _load_attack_success_evaluation_data()
    evaluate_targeted_attack(docs, settings.targeted_label_flipping_attack_evaluation_results_store_path)

def simulate_targeted_label_flipping_attack(evaluate_after_attack: bool = True):
    """
    Simulates a targeted label flipping attack on the RAG service using precomputed embeddings with flipped labels.
    """
    run_data_poisoning_attack(settings.targeted_label_flipping_attack_embeddings_store_path, logger)
    if evaluate_after_attack:
        _evaluate_attack_success()
        evaluate_model(settings.targeted_label_flipping_attack_evaluation_results_store_path)


if __name__ == "__main__":
    simulate_targeted_label_flipping_attack(settings.evaluate_after_attack)
