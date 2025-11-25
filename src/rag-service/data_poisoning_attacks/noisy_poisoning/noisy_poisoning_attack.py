from data_poisoning_attacks.utils.run_data_poisoning_attack import run_data_poisoning_attack
from evaluation.evaluate_model import evaluate_model
from logger.logging_config import get_logger
from rag_service.config import get_settings


logger = get_logger("NoisyPoisoningAttackSimulation")
settings = get_settings()

def simulate_noisy_poisoning_attack():
    """ Simulates a noisy poisoning flipping attack on the RAG service using precomputed embeddings of noisy data"""
    run_data_poisoning_attack(settings.noisy_poisoning_attack_embeddings_store_path, logger)
    evaluate_model(settings.noisy_poisoning_evaluation_results_store_path)


if __name__ == "__main__":
    simulate_noisy_poisoning_attack()
