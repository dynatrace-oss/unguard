from datetime import datetime, UTC
import json

from ...logging_config import get_logger
from ...config import get_settings

logger = get_logger("ModelEvaluation")
settings = get_settings()

def print_and_store_results(tp, fp, tn, fn, errors):
    """Prints the evaluation results and stores them in a file"""
    total = tp + fp + tn + fn
    if total == 0:
        logger.warning("No evaluation results available")
        return

    accuracy = (tp + tn) / total if total else 0
    precision_den = tp + fp
    recall_den = tp + fn
    precision = tp / precision_den if precision_den else 0
    recall = tp / recall_den if recall_den else 0
    f1 = (2 * precision * recall / (precision + recall)) if (precision + recall) else 0

    print("------------------------------------------------")
    print("Evaluation Results:")
    print(f"Testset size: {total} entries")
    print(f"TP: {tp}  FP: {fp}  TN: {tn}  FN: {fn}")
    print(f"Accuracy:  {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall:    {recall:.4f}")
    print(f"F1 Score:  {f1:.4f}")
    print(f"Classification errors: {errors}")
    print("------------------------------------------------")

    settings.evaluation_results_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now(UTC).strftime("%Y%m%d_%H%M%S")
    results = {
        "total": total,
        "tp": tp,
        "fp": fp,
        "tn": tn,
        "fn": fn,
        "errors": errors,
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "f1": f1,
    }
    output_file = settings.evaluation_results_dir / f"evaluation_{timestamp}.json"
    try:
        with output_file.open("w", encoding="utf-8") as f:
            json.dump(results, f, indent=2)
        logger.info("Stored evaluation results at %s", output_file)
    except Exception as e:
        logger.error("Failed to write evaluation results: %s", e)

