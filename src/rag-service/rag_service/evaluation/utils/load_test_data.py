from xml.dom.minidom import Document

from ...logging_config import get_logger
from ...data_loader.parquet_data_loader import DataLoader

logger = get_logger("ModelEvaluation")

def load_test_data() -> list[Document]:
    """Loads the test documents for the evaluation."""
    logger.info("Loading test data for evaluation...")
    docs = DataLoader().load_test_data()
    if not docs:
        logger.error("No test data found")
        return []
    return docs

