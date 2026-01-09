from logger.logging_config import get_logger
from rag_service.config import get_settings
from rag_service.data_loader.parquet_data_loader import DataLoader
from rag_service.embeddings_precomputation.generate_and_store_embeddings import generate_and_store_embeddings

logger = get_logger("TargetedLabelFlippingDataPreprocessor")
settings = get_settings()


def prepare_targeted_label_flipping_dataset():
    """Precomputes the embeddings for the attack and evaluation datasets for the targeted label flipping attack"""
    attack_docs = DataLoader().load_targeted_label_flipping_attack_data()
    generate_and_store_embeddings(attack_docs, settings.targeted_label_flipping_attack_embeddings_store_path)
