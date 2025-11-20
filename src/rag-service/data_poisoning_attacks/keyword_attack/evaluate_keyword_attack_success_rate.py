import requests

from evaluation.utils.print_and_store_results import store_results_in_file
from logger.logging_config import get_logger
from rag_service.config import get_settings
from rag_service.constants import RAG_SERVICE_LOCAL_URL, CLASSIFY_TEXT_ENDPOINT


logger = get_logger("KeywordAttackSuccessEvaluation")
settings = get_settings()


def evaluate_attack_docs(docs, evaluation_results_dir_path):
    successful_attacks = 0
    docs_evaluated = 0
    errors = 0

    for index, doc in enumerate(docs):
        payload = {"text": doc.text}
        try:
            response = requests.post(RAG_SERVICE_LOCAL_URL + CLASSIFY_TEXT_ENDPOINT, json=payload, timeout=60)
            response.raise_for_status()
            predicted_label = response.json()["classification"]
            if index % 50 == 0 and index > 0:
                logger.info("Evaluated %d/%d samples...", index, len(docs))
            docs_evaluated = docs_evaluated + 1
        except Exception as exception:
            errors += 1
            logger.warning("Error classifying sample %d: %s", index, exception)
            continue
        if predicted_label == "non_spam":
            successful_attacks += 1

    return _print_and_store_results(docs_evaluated, successful_attacks, errors, evaluation_results_dir_path)

def _print_and_store_results(total, successful_attacks, errors, evaluation_results_dir_path):
    """Prints the evaluation results and stores them in a file"""
    attack_success_rate = (successful_attacks / total) * 100 if total > 0 else 0

    logger.info("------------------------------------------------\n"
                "Evaluation Results:\n"
                "Testset size: %d entries\n"
                "Successful Attacks: %d\n"
                "Attack Success Rate: %d  FP: %d  TN: %d  FN: %d\n"
                "Classification errors: %d\n"
                "------------------------------------------------\n",
                total, successful_attacks, attack_success_rate, errors)

    results = {
        "total": total,
        "successful_attacks": successful_attacks,
        "attack_success_rate": attack_success_rate,
        "errors": errors,
    }
    store_results_in_file(evaluation_results_dir_path, results, logger)

