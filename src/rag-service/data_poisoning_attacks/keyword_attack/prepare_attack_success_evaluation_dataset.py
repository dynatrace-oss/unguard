from typing import List
from llama_index.core import Document

from rag_service.data_loader.parquet_data_loader import DataLoader
from data_preprocessing.utils.store_dataset_as_parquet_file import store_dataset_as_parquet_file
from evaluation.utils.perform_classification_request import perform_classification_request
from rag_service.config import get_settings
from logger.logging_config import get_logger

logger = get_logger("KeywordAttackEvaluationDatasetPreparation")
settings = get_settings()

def prepare_keyword_attack_success_evaluation_dataset(attack_docs_subset: List[Document]) -> None:
    """
    Prepares the keyword attack dataset by applying the following steps:
        1. Select all spam documents from the dataset subset to be used for the keyword attack.
        2. For each spam document, cut the text to the first 20 tokens.
        3. To verify that the (cut, otherwise unmodified) spam documents are still classified as spam, perform a test
        classification.
        4. All cut documents which are still classified as spam are added to the keyword attack dataset and stored
        as a parquet file.
    """

    spam_docs = [doc for doc in attack_docs_subset if doc.metadata.get("label") == "spam"]
    logger.info("Preparing keyword attack success evaluation dataset for %d spam docs", len(spam_docs))

    cut_docs = []

    for doc in spam_docs:
        tokens = doc.text.split()[:20]
        cut_text = ' '.join(tokens)
        cut_docs.append(Document(text=cut_text, metadata=doc.metadata))

    cut_docs_classified_as_spam = []

    for index, cut_doc in enumerate(cut_docs):
        try:
            predicted_label = perform_classification_request(cut_doc.text)
            if predicted_label == settings.spam_label:
                cut_docs_classified_as_spam.append(cut_doc)
            if index % 50 == 0 and index > 0:
                logger.info("Classified %d/%d samples...", index, len(cut_docs))
        except Exception as exception:
            logger.warning("Error classifying sample %d: %s", index, exception)
            continue

    logger.info("Storing %d prepared documents for keyword attack dataset as parquet file at %s",
                len(cut_docs_classified_as_spam),
                get_settings().keyword_attack_evaluation_parquet_dataset_path)
    store_dataset_as_parquet_file(cut_docs, get_settings().keyword_attack_evaluation_parquet_dataset_path)


if __name__ == "__main__":
    """
    Prepares the keyword attack dataset.
    Please ensure that the RAG service is running before executing this script.
    """

    docs = DataLoader().load_initial_kb_data()
    attack_docs = docs[len(docs)//2:]
    logger.info("Extracted %d documents for keyword attack dataset preparation.", len(attack_docs))

    prepare_keyword_attack_success_evaluation_dataset(attack_docs)
