from pathlib import Path
from typing import List
from llama_index.core import Document
import pandas as pd

from logger.logging_config import get_logger

logger = get_logger("ParquetWriter")


def store_dataset_as_parquet_file(docs: List[Document], store_path: Path):
    resolved_path = store_path if store_path.is_absolute() else (Path.cwd() / store_path).resolve()
    resolved_path.parent.mkdir(parents=True, exist_ok=True)

    rows = [{"text": doc.text, "label": doc.metadata.get("label", "")} for doc in docs]
    df = pd.DataFrame(rows)

    try:
        df.to_parquet(resolved_path, index=False)
    except Exception as e:
        logger.error("Failed to write dataset to parquet file at %s: %s", resolved_path, e)
        raise
    logger.info("Dataset written to parquet file at: %s", resolved_path)
