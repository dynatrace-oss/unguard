from pathlib import Path

import requests
from evaluation.utils.check_connection import check_connection
from evaluation.utils.load_test_data import load_test_data
from evaluation.utils.print_and_store_results import print_and_store_results
from logger.logging_config import get_logger

logger = get_logger("ModelEvaluation")

RAG_SERVICE_PORT = 8000
LOCALHOST = "http://127.0.0.1"
RAG_SERVICE_LOCAL_URL = f"{LOCALHOST}:{RAG_SERVICE_PORT}"
CLASSIFY_TEXT_ENDPOINT = "/classifyPost"

EVALUATION_RESULTS_DEFAULT_DIR: Path = Path(__file__).parent / "evaluation_results"
EVALUATION_BATCH_SIZE = 50


def evaluate_test_docs(docs):
    tp = fp = tn = fn = 0
    errors = 0

    for index, doc in enumerate(docs):
        ground_truth = str(doc.metadata.get("label", "")).lower().strip()
        if ground_truth not in ("spam", "not_spam"):
            continue
        payload = {"text": doc.text}
        try:
            response = requests.post(RAG_SERVICE_LOCAL_URL + CLASSIFY_TEXT_ENDPOINT, json=payload, timeout=60)
            response.raise_for_status()
            predicted_label = response.json()["classification"]
            if index % 50 == 0 and index > 0:
                logger.info("Evaluated %d/%d samples...", index, len(docs))
        except Exception as exception:
            errors += 1
            logger.warning("Error classifying sample %d: %s", index, exception)
            continue
        if ground_truth == "spam":
            if predicted_label == "spam":
                tp += 1
            else:
                fn += 1
        else:
            if predicted_label == "spam":
                fp += 1
            else:
                tn += 1

    return tp, fp, tn, fn, errors

def evaluate_model(evaluation_results_dir_path: Path = EVALUATION_RESULTS_DEFAULT_DIR):
    if not check_connection(RAG_SERVICE_LOCAL_URL):
        logger.info("RAG service not reachable at %s. Start it before running evaluation.", RAG_SERVICE_LOCAL_URL)
        return
    docs = load_test_data()
    if not docs:
        return

    logger.info("Starting evaluation on %d samples...", len(docs))

    tp, fp, tn, fn, errors = evaluate_test_docs(docs)
    print_and_store_results(tp, fp, tn, fn, errors, evaluation_results_dir_path, logger)

if __name__ == "__main__":
    evaluate_model()
