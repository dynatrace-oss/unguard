from rag_service.schemas import DetailedIngestionResult


def print_metrics_to_console(accuracy, precision, recall, f1_score, true_positives, false_positives, true_negatives, false_negatives):
    print(f"True Positives: {true_positives}")
    print(f"False Positives: {false_positives}")
    print(f"True Negatives: {true_negatives}")
    print(f"False Negatives: {false_negatives}")

    print("Accuracy: {:.4f}".format(accuracy))
    print("Precision: {:.4f}".format(precision))
    print("Recall: {:.4f}".format(recall))
    print("F1-Score: {:.4f}".format(f1_score))


def compute_metrics(ingestion_results: list[DetailedIngestionResult], id_to_ground_truth) -> dict:
    true_positives = 0
    false_positives = 0
    true_negatives = 0
    false_negatives = 0

    ingested_ids = {result['id'] for result in ingestion_results}
    for entry_id, is_poisoned in id_to_ground_truth.items():
        if entry_id in ingested_ids:
            if is_poisoned:
                false_negatives += 1 # poisoned but ingested
            else:
                true_negatives += 1 # legit and ingested
        else:
            if is_poisoned:
                true_positives += 1 # poisoned and not ingested
            else:
                false_positives += 1 # legit but not ingested

    accuracy = (true_positives + true_negatives) / len(id_to_ground_truth) if len(id_to_ground_truth) > 0 else 0
    precision = true_positives / (true_positives + false_positives) if (true_positives + false_positives) > 0 else 0
    recall = true_positives / (true_positives + false_negatives) if (true_positives + false_negatives) > 0 else 0
    f1_score = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0

    print_metrics_to_console(accuracy, precision, recall, f1_score, true_positives, false_positives, true_negatives, false_negatives)

    return {
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "f1_score": f1_score,
        "true_positives": true_positives,
        "false_positives": false_positives,
        "true_negatives": true_negatives,
        "false_negatives": false_negatives
    }
