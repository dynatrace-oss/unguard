from .utils.load_test_data import load_test_data
from .utils.print_and_store_results import print_and_store_results
from ..rag_pipeline.rag import rag_classifier
from ..logging_config import get_logger

logger = get_logger("ModelEvaluation")

def evaluate_test_docs(docs):
    tp = fp = tn = fn = 0

    errors = 0
    for index, doc in enumerate(docs):
        ground_truth = str(doc.metadata.get("label", "")).lower().strip()
        if ground_truth not in ("spam", "not_spam"):
            continue
        try:
            predicted_label = rag_classifier.classify_text(doc.text)["classification"]
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

    print_and_store_results(tp, fp, tn, fn, errors)


def evaluate():
    docs = load_test_data()
    if not docs:
        return
    logger.info("Starting evaluation on %d samples...", len(docs))
    evaluate_test_docs(docs)

if __name__ == "__main__":
    evaluate()
