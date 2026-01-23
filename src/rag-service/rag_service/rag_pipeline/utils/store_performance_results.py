from evaluation.utils.print_and_store_results import store_results_in_file
from rag_service.config import get_settings
from logger.logging_config import get_logger
from pathlib import Path

settings = get_settings()
logger = get_logger("DataPoisoningPerformanceMeasurer")


def _get_performance_results_store_path():
    project_root = Path(__file__).resolve().parents[4]
    perf_results_dir = (
        project_root
        / "rag-service"
        / "detection_strategies_evaluation_experiments"
        / "evaluation_results"
        / "performance"
        / str(settings.data_poisoning_detection_strategy.value)
    )
    return perf_results_dir


def store_performance_results(duration_seconds: float, entries: list, kb_contents: list):
    perf_result = {
        "detection_strategy": str(settings.data_poisoning_detection_strategy.value),
        "duration_in_seconds": duration_seconds,
        "num_new_entries": len(entries),
        "num_kb_entries": len(kb_contents),
    }

    try:
        store_results_in_file(
            evaluation_results_dir_path=_get_performance_results_store_path(),
            results_dict=perf_result,
            logger=logger,
            filename="data_poisoning_performance",
        )
    except Exception as e:
        logger.error(
            "Failed to store data poisoning performance results: %s", e
        )
