import pandas as pd
from typing import List
from llama_index.core import Document

from rag_service.config import get_settings
from logger.logging_config import get_logger

settings = get_settings()
logger = get_logger("ExperimentDatasetLoader")


def _load_dataset(
    file_path: str,
    text_col: str,
    label_col: str,
    file_type: str = "parquet",
) -> pd.DataFrame:
    """
    Loads parquet, jsonl or csv datasets from a given file path into a pandas DataFrame.
    """
    if file_type == "parquet":
        df = pd.read_parquet(file_path)
    elif file_type == "jsonl":
        df = pd.read_json(file_path, lines=True)
    elif file_type == "csv":
        df = pd.read_csv(file_path)
    else:
        raise ValueError(f"Unsupported file type: {file_type}")

    if text_col not in df.columns or label_col not in df.columns:
        raise ValueError(f"File must contain columns {text_col} and {label_col}")

    return df

def _balance_dataset(documents: List[Document]) -> List[Document]:
    """
    Balances the dataset to have equal number of spam and not spam entries.
    Any excess entries are dropped.
    """
    spam_docs = [doc for doc in documents if doc.metadata.get("label") == settings.spam_label]
    not_spam_docs = [doc for doc in documents if doc.metadata.get("label") == settings.not_spam_label][:len(spam_docs)]

    balanced_dataset = []
    for spam_doc, not_spam_doc in zip(spam_docs, not_spam_docs):
        balanced_dataset.append(spam_doc)
        balanced_dataset.append(not_spam_doc)

    return balanced_dataset

def _parse_numeric_label(label: str) -> str:
    if label == "0":
        return settings.not_spam_label
    elif label == "1":
        return settings.spam_label
    else:
        raise ValueError(f"Unknown label value: {label}")

def _sanitize_text(text) -> str:
    """ Sanitizes the text by removing new lines from the beginning and end to avoid issues during embedding generation."""
    return str(text).strip()


def _load_and_prepare_dataset(file_path: str, text_col: str, label_col: str, file_type: str = "parquet") -> List[Document]:
    """
    Loads additional datasets for the evaluation experiments.
    Parses the entries into a consistent format of Documents with text and label metadata.
    Entries exceeding max_length_for_entries are dropped.
    """
    df = _load_dataset(file_path, text_col, label_col, file_type)

    documents: List[Document] = []
    dropped_entries = 0
    for _, row in df.iterrows():
        text = str(row[text_col])
        text = _sanitize_text(text)
        if len(text) > settings.max_length_for_entries or len(text) == 0:
            dropped_entries += 1
            continue
        label = _parse_numeric_label(str(row[label_col]))
        documents.append(Document(text=text, metadata={"label": label}))

    if dropped_entries:
        logger.info(f"Dropped {dropped_entries} entries exceeding {settings.max_length_for_entries} chars")

    return _balance_dataset(documents)

def load_sms_spam_dataset() -> List[Document]:
    dataset = _load_and_prepare_dataset(
        "hf://datasets/ucirvine/sms_spam/plain_text/train-00000-of-00001.parquet",
        text_col="sms",
        label_col="label",
        file_type="parquet"
    )
    logger.info("Loaded SMS Spam Dataset with %d documents (%d spam, %d not spam)",
        len(dataset),
        len([d for d in dataset if d.metadata.get("label") == settings.spam_label]),
        len([d for d in dataset if d.metadata.get("label") == settings.not_spam_label])
    )
    return dataset

def load_enron_spam_dataset() -> List[Document]:
    dataset = _load_and_prepare_dataset(
        "hf://datasets/SetFit/enron_spam/train.jsonl",
        text_col="text",
        label_col="label",
        file_type="jsonl"
    )
    logger.info("Loaded Enron Spam Dataset with %d documents (%d spam, %d not spam)",
        len(dataset),
        len([d for d in dataset if d.metadata.get("label") == settings.spam_label]),
        len([d for d in dataset if d.metadata.get("label") == settings.not_spam_label])
    )
    return dataset

def load_spam_assassin_dataset() -> List[Document]:
    dataset = _load_and_prepare_dataset(
        "hf://datasets/bvk/SpamAssassin-spam/SA_SubTxt_fn.csv",
        text_col="data",
        label_col="label",
        file_type="csv"
    )
    logger.info("Loaded SpamAssassin Dataset with %d documents (%d spam, %d not spam)",
    len(dataset),
        len([d for d in dataset if d.metadata.get("label") == settings.spam_label]),
        len([d for d in dataset if d.metadata.get("label") == settings.not_spam_label])
    )
    return dataset

def load_deysi_spam_detection_dataset() -> List[Document]:
    splits = {'train': 'data/train-00000-of-00001-daf190ce720b3dbb.parquet', 'test': 'data/test-00000-of-00001-fa9b3e8ade89a333.parquet'}
    dataset_train = pd.read_parquet("hf://datasets/Deysi/spam-detection-dataset/" + splits["train"])
    dataset_test = pd.read_parquet("hf://datasets/Deysi/spam-detection-dataset/" + splits["test"])
    dataset = pd.concat([dataset_train, dataset_test], ignore_index=True)

    documents: List[Document] = []
    dropped_entries = 0
    for _, row in dataset.iterrows():
        text = str(row["text"])
        if len(text) > settings.max_length_for_entries:
            dropped_entries += 1
            continue
        label = (str(row["label"]))
        documents.append(Document(text=text, metadata={"label": label}))
    if dropped_entries:
        logger.info(f"Dropped {dropped_entries} entries exceeding {settings.max_length_for_entries} chars")
    dataset = _balance_dataset(documents)


    logger.info("Loaded Deysi Spam Classification Dataset with %d documents (%d spam, %d not spam)",
        len(dataset),
        len([d for d in dataset if d.metadata.get("label") == settings.spam_label]),
        len([d for d in dataset if d.metadata.get("label") == settings.not_spam_label])
    )
    return dataset

if __name__ == "__main__":
    sms_spam_docs = load_sms_spam_dataset()
    enron_spam_docs = load_enron_spam_dataset()
    spam_assassin_docs = load_spam_assassin_dataset()
    load_deysi_spam_detection_dataset()
