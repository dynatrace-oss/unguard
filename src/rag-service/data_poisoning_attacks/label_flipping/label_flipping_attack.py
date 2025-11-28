from data_poisoning_attacks.utils.run_data_poisoning_attack import run_data_poisoning_attack
from evaluation.evaluate_model import evaluate_model
from logger.logging_config import get_logger
from rag_service.config import get_settings

logger = get_logger("LabelFlippingAttackSimulation")
settings = get_settings()


def simulate_label_flipping_attack():
    """ Simulates a label flipping attack on the RAG service using precomputed embeddings with flipped labels"""
    run_data_poisoning_attack(settings.label_flipping_attack_embeddings_store_path, logger)
    if settings.evaluate_after_attack:
        evaluate_model(settings.label_flipping_evaluation_results_store_path)


if __name__ == "__main__":
    simulate_label_flipping_attack()
