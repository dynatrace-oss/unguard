from __future__ import annotations
from pathlib import Path
from typing import Iterable, Iterator, List, Dict, Any
import json
from chromadb.api.types import Documents, Embeddings, Metadatas, IDs

__all__ = [
    "validate_embeddings_directory",
    "get_list_of_embeddings_files",
    "load_embeddings_into_collection",
    "read_embeddings_files"
]

def validate_embeddings_directory(embeddings_dir: Path, logger) -> None:
    """Checks if the embeddings directory exists."""
    if not (embeddings_dir.exists() and embeddings_dir.is_dir()):
        logger.error("Error: Precomputed embeddings directory not found: %s", embeddings_dir)
        raise FileNotFoundError(f"Error: Precomputed embeddings directory not found at {embeddings_dir}")

def get_list_of_embeddings_files(embeddings_dir: Path) -> List[Path]:
    """Returns a list containing all files with the precomputed embeddings in the given directory."""
    list_of_files = sorted(embeddings_dir.glob("embeddings_part_*.jsonl"))
    if not list_of_files:
        raise FileNotFoundError(f"Error: Could not find valid files embeddings_part_*.jsonl in {embeddings_dir}")
    return list_of_files

def read_embeddings_files(embedding_files: list[Path], logger) -> Iterator[Dict[str, Any]]:
    """Reads the JSON records from each embedding file"""
    for embedding_file in embedding_files:
        logger.info("Reading %s", embedding_file.name)
        with embedding_file.open("r", encoding="utf-8") as file:
            for line in file:
                if not line.strip():
                    continue
                yield json.loads(line)

def get_batch_of_records(records_iter: Iterable[Dict[str, Any]], batch_size: int) -> Iterator[List[Dict[str, Any]]]:
    """Returns a batch of records with size <= batch_size"""
    batch: List[Dict[str, Any]] = []
    for record in records_iter:
        batch.append(record)
        if len(batch) >= batch_size:
            yield batch
            batch = []
    if batch:
        yield batch

def load_embeddings_into_collection(collection, list_of_embedding_files: list[Path], logger, batch_size: int = 2000) -> int:
    """Loads contents of embeddings files into a Chroma collection in batches."""
    doc_embeddings_added = 0
    for batch in get_batch_of_records(read_embeddings_files(list_of_embedding_files, logger), batch_size):
        texts: Documents = [r["text"] for r in batch]
        embeddings: Embeddings = [r["embedding"] for r in batch]
        metadatas: Metadatas = [{"label": r["label"]} for r in batch]
        ids: IDs = [r["id"] for r in batch]
        collection.add(
            documents=texts,
            embeddings=embeddings,
            metadatas=metadatas,
            ids=ids
        )
        doc_embeddings_added += len(batch)
    return doc_embeddings_added
