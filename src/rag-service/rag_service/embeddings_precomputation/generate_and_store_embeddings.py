from typing import List
from llama_index.core import Document
from pathlib import Path
from rich.console import Console
from rich.logging import RichHandler
from rich.progress import Progress, SpinnerColumn, BarColumn, TimeElapsedColumn, TimeRemainingColumn, TaskProgressColumn, MofNCompleteColumn
import logging

from logger.logging_config import get_logger
from rag_service.config import get_settings
from rag_service.embeddings_precomputation.utils.generate_embeddings import create_embedding_model, compute_embedding_for_doc
from rag_service.embeddings_precomputation.utils.write_embeddings_to_files import EmbeddingsWriter, compute_entry_id

logger = get_logger("EmbeddingsPreComputer")
settings = get_settings()
console = Console()
handler = RichHandler(console=console, show_time=False, show_path=False)
logging.basicConfig(level=logging.WARNING, handlers=[handler], format="%(message)s")

def generate_and_store_embeddings(docs: List[Document], embeddings_store_dir_path: Path) -> int:
    """Computes the embeddings for the provided docs and stores them in multiple files in the provided directory."""
    logger.info("Precomputing embeddings for %d documents...", len(docs))

    embedding_model = create_embedding_model()
    writer = EmbeddingsWriter(embeddings_store_dir_path)
    total_num_of_docs = len(docs)
    num_of_embedded_docs = 0

    with Progress(
        SpinnerColumn(),
        BarColumn(),
        MofNCompleteColumn(),
        TaskProgressColumn(),
        TimeElapsedColumn(),
        TimeRemainingColumn(),
        transient=True,
        console=console,
    ) as progress:
        task_id = progress.add_task("Precomputing embeddings for %d documents...", total=len(docs))

        for doc_index in range(0, total_num_of_docs):
            embedding = compute_embedding_for_doc(embedding_model, docs[doc_index])
            global_index = doc_index
            entry = {
                "id": compute_entry_id(docs[doc_index].text, docs[doc_index].metadata.get("label", ""), global_index),
                "text": docs[doc_index].text,
                "label": docs[doc_index].metadata.get("label", ""),
                "embedding": embedding
            }
            try:
                writer.write_entry_to_file(entry)
                num_of_embedded_docs += 1
                progress.advance(task_id)

            except Exception as e:
                progress.console.log(f"[yellow]Failed to write embedding for index {global_index}: {e}")
                progress.advance(task_id)

    writer.close()
    logger.info("Pre-computing complete: %d embeddings written across %d files at directory %s)",
        num_of_embedded_docs, writer.file_index - 1, embeddings_store_dir_path)
    return num_of_embedded_docs
