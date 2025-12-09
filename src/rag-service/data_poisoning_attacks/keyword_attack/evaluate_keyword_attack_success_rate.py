from rich.progress import Progress, SpinnerColumn, BarColumn, TimeElapsedColumn, TimeRemainingColumn, TaskProgressColumn, MofNCompleteColumn
from evaluation.utils.perform_classification_request import perform_classification_request
from evaluation.utils.print_and_store_results import store_results_in_file
from logger.logging_config import get_logger
from rag_service.config import get_settings


logger = get_logger("KeywordAttackSuccessEvaluation")
settings = get_settings()


def evaluate_attack_effect(docs, evaluation_results_dir_path):
    """
    Evaluates the success rate of the keyword attack.
    An attack is considered successful, when a spam document is classified as non_spam after the attack.
    """
    successful_attacks = 0
    docs_evaluated = 0
    errors = 0

    with Progress(
        SpinnerColumn(),
        BarColumn(),
        MofNCompleteColumn(),
        TaskProgressColumn(),
        TimeElapsedColumn(),
        TimeRemainingColumn(),
        transient=True
    ) as progress:
        task_id = progress.add_task("Evaluating attack...", total=len(docs))

        for index, doc in enumerate(docs):
            try:
                predicted_label = perform_classification_request(doc.text)
                if index % 50 == 0 and index > 0:
                    logger.info("Evaluated %d/%d samples...", index, len(docs))
                docs_evaluated += 1
            except Exception as exception:
                errors += 1
                logger.warning("Error classifying sample %d: %s", index, exception)
                progress.advance(task_id)
                continue

            if predicted_label == settings.not_spam_label:
                successful_attacks += 1

            progress.advance(task_id)

    return _print_and_store_results(docs_evaluated, successful_attacks, errors, evaluation_results_dir_path)

def _print_and_store_results(total, successful_attacks, errors, evaluation_results_dir_path):
    """Prints the evaluation results and stores them in a file"""
    attack_success_rate = (successful_attacks / total) if total > 0 else 0

    logger.info("------------------------------------------------\n"
                "Evaluation Results:\n"
                "Testset size: %d entries\n"
                "Successful Attacks: %d\n"
                "Attack Success Rate: %.2f\n"
                "Classification errors: %d\n"
                "------------------------------------------------\n",
                total, successful_attacks, attack_success_rate, errors)

    results = {
        "total": total,
        "successful_attacks": successful_attacks,
        "attack_success_rate": attack_success_rate,
        "errors": errors,
    }
    store_results_in_file(evaluation_results_dir_path, results, logger, "attack_success_evaluation")
