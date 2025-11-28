from datetime import datetime, UTC
import json

def print_and_store_results(true_positives, false_positives, true_negatives, false_negatives, errors, evaluation_results_dir_path, logger):
    """Prints the evaluation results and stores them in a file"""
    total = true_positives + false_positives + true_negatives + false_negatives
    if total == 0:
        logger.warning("No evaluation results available")
        return

    accuracy = (true_positives + true_negatives) / total
    precision_den = true_positives + false_positives
    recall_den = true_positives + false_negatives
    precision = true_positives / precision_den if precision_den else 0
    recall = true_positives / recall_den if recall_den else 0
    f1 = (2 * precision * recall / (precision + recall)) if (precision + recall) else 0

    logger.info("------------------------------------------------\n"
                "Evaluation Results:\n"
                "Testset size: %d entries\n"
                "TP: %d  FP: %d  TN: %d  FN: %d\n"
                "Accuracy:  %.4f\n"
                "Precision: %.4f\n"
                "Recall:    %.4f\n"
                "F1 Score:  %.4f\n"
                "Classification errors: %d\n"
                "------------------------------------------------\n",
                total, true_positives, false_positives, true_negatives, false_negatives, accuracy, precision, recall, f1, errors)

    results = {
        "total": total,
        "tp": true_positives,
        "fp": false_positives,
        "tn": true_negatives,
        "fn": false_negatives,
        "errors": errors,
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "f1": f1,
    }
    store_results_in_file(evaluation_results_dir_path, results, logger)


def store_results_in_file(evaluation_results_dir_path, results_dict, logger):
    """Stores the given results in a file at the given directory"""
    evaluation_results_dir_path.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now(UTC).strftime("%Y%m%d_%H%M%S")
    output_file = evaluation_results_dir_path / f"model_evaluation_{timestamp}.json"

    try:
        with output_file.open("w", encoding="utf-8") as f:
            json.dump(results_dict, f, indent=2)
        logger.info("Stored evaluation results at %s", output_file)
    except OSError as e:
        logger.error("Failed to write evaluation results to %s due to file error: %s", output_file, e)
    except TypeError as e:
        logger.error("Failed to serialize evaluation results to %s due to type error: %s", output_file, e)
    except Exception as e:
        logger.error("Failed to write evaluation results to %s: %s", output_file, e)
