from llama_index.core import Document

from data_poisoning_attacks.keyword_attack.evaluate_keyword_attack_success_rate import evaluate_attack_docs
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
    return DataLoader().load_keyword_attack_evaluation_data()

def evaluate_attack_success_rate():
    """Evaluate the success rate of the keyword attack."""
    docs = load_attack_success_evaluation_data()
    evaluate_attack_docs(docs, settings.keyword_attack_evaluation_results_store_path)

def simulate_keyword_attack():
    """ Simulates a keyword attack on the RAG service using precomputed embeddings with flipped labels"""
    run_data_poisoning_attack(settings.keyword_attack_embeddings_store_path, logger)
    evaluate_model(settings.keyword_attack_evaluation_results_store_path)
    evaluate_attack_success_rate()


if __name__ == "__main__":
    simulate_keyword_attack()
