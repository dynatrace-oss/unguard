from pathlib import Path

from data_poisoning_attacks.utils.run_data_poisoning_attack import run_data_poisoning_attack
from data_poisoning_attacks.utils.evaluate_data_poisoning_attack import evaluate_model_performance
from logger.logging_config import get_logger

LABEL_FLIPPED_EMBEDDINGS_DIR = Path(__file__).parent / "attack_data_label_flipping"

logger = get_logger("LabelFlippingAttackSimulation")


def simulate_label_flipping_attack():
    """ Simulates a label flipping attack on the RAG service using precomputed embeddings with flipped labels"""
    run_data_poisoning_attack(LABEL_FLIPPED_EMBEDDINGS_DIR, logger)
    evaluate_model_performance()


if __name__ == "__main__":
    simulate_label_flipping_attack()
