from llama_index.core import Document

from data_poisoning_attacks.utils.evaluate_attack_success_rate import evaluate_targeted_attack
from data_poisoning_attacks.utils.run_data_poisoning_attack import run_data_poisoning_attack
from evaluation.evaluate_model import evaluate_model
from logger.logging_config import get_logger
from rag_service.config import get_settings
from rag_service.data_loader.parquet_data_loader import DataLoader

logger = get_logger("KeywordAttackSimulation")
settings = get_settings()

def load_attack_success_evaluation_data() -> list[Document]:
    """Loads the test documents for evaluating the attack success rate."""
    logger.info("Loading test data for attack success rate evaluation...")
    return DataLoader().load_prepared_keyword_attack_success_evaluation_data()

def evaluate_attack_success_rate(limit_evaluation_samples: int = settings.limit_keyword_attack_success_evaluation_samples):
    """Evaluate the success rate of the keyword attack."""
    docs = load_attack_success_evaluation_data()

    if limit_evaluation_samples > 0:
        docs = docs[:limit_evaluation_samples]

    evaluate_targeted_attack(docs, settings.keyword_attack_evaluation_results_store_path)

def simulate_keyword_attack(evaluate_after_attack: bool = True):
    """ Simulates a keyword attack on the RAG service using precomputed embeddings with flipped labels"""
    run_data_poisoning_attack(settings.keyword_attack_embeddings_store_path, logger)
    if evaluate_after_attack:
        evaluate_model(settings.keyword_attack_evaluation_results_store_path)
        evaluate_attack_success_rate()


if __name__ == "__main__":
    simulate_keyword_attack(settings.evaluate_after_attack)
