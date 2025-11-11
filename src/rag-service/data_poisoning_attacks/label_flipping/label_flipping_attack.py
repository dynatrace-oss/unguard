from pathlib import Path

from data_poisoning_attacks.utils.run_data_poisoning_attack import run_data_poisoning_attack
from evaluation.evaluate_model import evaluate_model
from logger.logging_config import get_logger
from rag_service.config import get_settings

LABEL_FLIPPED_EMBEDDINGS_DIR = Path(__file__).parent / "attack_data"
ATTACK_EVALUATION_RESULTS_DIR: Path = Path(__file__).parent / "evaluation_results"

logger = get_logger("LabelFlippingAttackSimulation")
settings = get_settings()


def simulate_label_flipping_attack():
    """ Simulates a label flipping attack on the RAG service using precomputed embeddings with flipped labels"""
    run_data_poisoning_attack(LABEL_FLIPPED_EMBEDDINGS_DIR, logger)
    evaluate_model(ATTACK_EVALUATION_RESULTS_DIR)


if __name__ == "__main__":
    simulate_label_flipping_attack()
