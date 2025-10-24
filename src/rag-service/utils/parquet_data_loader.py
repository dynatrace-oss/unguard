import pandas as pd
from typing import List, Union
from pathlib import Path
from config import get_settings
from llama_index.core import Document
from logging_config import get_logger

logger = get_logger("DataLoader")

class DataLoader:
    def __init__(self):
        self.settings = get_settings()

    def load_initial_kb_data(self) -> List[Document]:
        """Loads base data from parquet file and returns as list of Documents."""
        return self._load_parquet(self.settings.base_data_path)

    def load_test_data(self) -> List[Document]:
        """Loads test data from parquet file and returns as list of Documents."""
        return self._load_parquet(self.settings.test_data_path)

    def _load_parquet(self, file_path: Union[str, Path]) -> List[Document]:
        """Loads data from a parquet file and converts rows to Documents. Entries with length > 2793 are dropped."""
        path = Path(file_path)

        if not path.exists():
            raise FileNotFoundError(f"Error: Data file not found: {file_path}")

        df = pd.read_parquet(path)

        if "text" not in df.columns or "label" not in df.columns:
            raise ValueError("Parquet file must contain columns text and label")

        documents: List[Document] = []
        dropped_entries = 0
        for _, row in df.iterrows():
            text = str(row["text"])
            if len(text) > self.settings.max_length_for_entries:
                dropped_entries += 1
                continue
            label = str(row["label"])
            documents.append(Document(text=text, metadata={"label": label}))

        if dropped_entries:
            logger.info(f"Dropped {dropped_entries} entries exceeding {self.settings.max_length_for_entries} chars from {file_path}")

        return documents

if __name__ == "__main__":
    """Only for testing purposes"""
    loader = DataLoader()
    docs = loader.load_initial_kb_data()
    logger.info(f"Loaded {len(docs)} documents from base data")
    if docs:
        logger.info("First 3 document texts:", [d.text for d in docs[:3]])
