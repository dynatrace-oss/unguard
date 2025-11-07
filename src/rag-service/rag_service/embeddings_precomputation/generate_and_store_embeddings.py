from pathlib import Path
from typing import List
from llama_index.core import Document

from logger.logging_config import get_logger
from rag_service.config import get_settings
from rag_service.data_loader.parquet_data_loader import DataLoader
from rag_service.embeddings_precomputation.utils.generate_embeddings import create_embedding_model, compute_embeddings_for_batch
from rag_service.embeddings_precomputation.utils.write_embeddings_to_files import EmbeddingsWriter, compute_entry_id

logger = get_logger("EmbeddingsPreComputer")
settings = get_settings()

def generate_and_store_embeddings(docs: List[Document], embeddings_store_dir_path: Path, batch_size: int = 200) -> int:
    """Computes the embeddings for the provided docs and stores them in multiple files in the provided directory."""
    logger.info("Generating embeddings for %d documents (batch_size=%d)...", len(docs), batch_size)

    embedding_model = create_embedding_model()
    writer = EmbeddingsWriter(embeddings_store_dir_path)
    total_num_of_docs = len(docs)
    num_of_embedded_docs = 0

    for start in range(0, total_num_of_docs, batch_size):
        end_of_batch = min(start + batch_size, total_num_of_docs)
        batch_of_docs = docs[start:end_of_batch]
        batch_of_embeddings = compute_embeddings_for_batch(embedding_model, batch_of_docs)

        for offset, (doc, embedding) in enumerate(zip(batch_of_docs, batch_of_embeddings)):
            global_index = start + offset
            entry = {
                "id": compute_entry_id(doc.text, doc.metadata.get("label", ""), global_index),
                "text": doc.text,
                "label": doc.metadata.get("label", ""),
                "embedding": embedding
            }
            writer.write_entry_to_file(entry)
            num_of_embedded_docs += 1

        logger.info("Processed %d/%d entries", end_of_batch, total_num_of_docs)

    writer.close()
    logger.info("Pre-computing complete: %d embeddings written across %d files at directory %s)",
        num_of_embedded_docs, writer.file_index - 1, embeddings_store_dir_path)
    return num_of_embedded_docs

def precompute_base_embeddings() -> int:
    """Computes and stores embeddings for the initial KB data."""
    docs = DataLoader().load_initial_kb_data()
    return generate_and_store_embeddings(
        docs=docs,
        embeddings_store_dir_path=settings.base_embeddings_store_path,
        batch_size=settings.embeddings_computation_max_batch_size,
    )

if __name__ == "__main__":
    precompute_base_embeddings()
