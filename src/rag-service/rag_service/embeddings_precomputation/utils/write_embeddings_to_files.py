import json
import hashlib
from pathlib import Path
from typing import Dict, Any

from logger.logging_config import get_logger
from rag_service.config import get_settings

logger = get_logger("EmbeddingsWriter")
settings = get_settings()

FILE_SIZE_LIMIT = 90 * 1024 * 1024  # 90MB to stay below 100MB file size limit in GitHub

def compute_entry_id(text: str, label: str, index: int) -> str:
    """Generates an entry ID based on text, label and index."""
    return hashlib.sha256(f"{index}::{text}::{label}".encode("utf-8")).hexdigest()[:32]

class EmbeddingsWriter:
    """Writes embeddings into multiple JSONL files in the provided directory, according to file size limit."""
    def __init__(self, directory_path: Path):
        self.model_provider = (settings.model_provider or "").strip().lower()
        self.directory_path = directory_path
        self.file_index = 1
        self.current_file = None
        self.current_file_size = 0
        self._prepare_dir()
        self._create_new_file()

    def _prepare_dir(self):
        """Creates the output directory and removes old remaining files for the currently set model"""
        self.directory_path.mkdir(parents=True, exist_ok=True)
        if self.model_provider:
            filename_pattern = f"embeddings_part_*_{self.model_provider}.jsonl"
        else:
            filename_pattern = "embeddings_part_*.jsonl"
        for old in self.directory_path.glob(filename_pattern):
            old.unlink()

    def _create_new_file(self):
        """Creates a new JSONL file for writing embeddings for the currently set model into the provided directory."""
        if self.current_file:
            self.current_file.close()

        model_suffix = f"_{self.model_provider}" if self.model_provider else ""
        new_file_name = f"embeddings_part_{self.file_index:04d}{model_suffix}.jsonl"
        new_file_path = self.directory_path / new_file_name
        self.current_file = new_file_path.open("w", encoding="utf-8")
        self.current_file_size = 0

        logger.info("Created new embeddings file at %s", new_file_path)
        self.file_index += 1

    def write_entry_to_file(self, entry: Dict[str, Any]):
        """Writes an embedding entry to the current file. Creates a new file if size limit is exceeded."""
        json_line = json.dumps(entry) + "\n"
        line_size = len(json_line.encode("utf-8"))

        if self.current_file_size + line_size > FILE_SIZE_LIMIT:
            self._create_new_file()

        if self.current_file is not None:
            self.current_file.write(json_line)
            self.current_file_size += line_size
        else:
            raise ValueError("Error writing to file: File not open")

    def close(self):
        """Closes the current file."""
        if self.current_file:
            self.current_file.close()
            self.current_file = None
