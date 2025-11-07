from evaluation.evaluate_model import evaluate_model
from pathlib import Path

ATTACK_EVALUATION_RESULTS_DIR: Path = Path(__file__).parent / "evaluation_results"


def evaluate_model_performance():
    """Evaluate the model performance after a data poisoning attack."""
    evaluate_model(ATTACK_EVALUATION_RESULTS_DIR)

def evaluate_attack_success_rate():
    """Evaluate the success rate of the data poisoning attack."""
    # TODO
