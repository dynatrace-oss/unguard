from fastapi import APIRouter, HTTPException

from rag_service.rag_pipeline.rag import rag_classifier
from rag_service.schemas import (
    KnowledgeBaseEntry,
    BatchOfKnowledgeBaseEntries,
    IngestionResponse,
    KnowledgeBaseDump,
    BatchOfPrecomputedKBEntries,
)
from logger.logging_config import get_logger

router = APIRouter()
_logger = get_logger(__name__)

@router.post("/ingestEntry", response_model=IngestionResponse)
async def ingest_entry(entry: KnowledgeBaseEntry):
    """Ingest a single new entry into the KB."""
    _logger.info("Received POST /ingestEntry request")
    try:
        success = rag_classifier.ingest_entry_to_kb(entry.text, entry.label)
        if success:
            return IngestionResponse(
                success=True,
                message="New entry was successfully ingested",
                count=1
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to ingest new entry")
    except Exception as e:
        _logger.error("Error ingesting new entry: %s", str(e))
        raise HTTPException(status_code=500, detail=f"Error ingesting new entry: {str(e)}")

@router.post("/ingestBatch", response_model=IngestionResponse)
async def ingest_batch(entries: BatchOfKnowledgeBaseEntries):
    """Ingest a batch of new entries into the KB."""
    _logger.info("Received POST /ingestBatch request with %d entries", len(entries.entries))
    try:
        entries_list = [
            {"text": entry.text, "label": entry.label}
            for entry in entries.entries
        ]
        count = rag_classifier.ingest_batch_to_kb(entries_list)
        return IngestionResponse(
            success=True,
            message=f"{count} new entries were successfully ingested",
            count=count
        )
    except Exception as e:
        _logger.error("Error ingesting new entries: %s", str(e))
        raise HTTPException(status_code=500, detail=f"Error ingesting new entries: {str(e)}")

@router.post("/ingestBatchWithEmbeddingsPrecomputed", response_model=IngestionResponse)
async def ingest_precomputed_batch(entries: BatchOfPrecomputedKBEntries):
    """
    Ingest a batch of entries with already precomputed embeddings.
    This route is useful for bypassing the overhead of computing embeddings during ingestion
    when ingesting a large amount of entries e.g. to simulate & evaluate data poisoning attacks
    """
    _logger.info("Received POST /ingestBatchWithEmbeddingsPrecomputed request with %d entries", len(entries.entries))
    try:
        count = rag_classifier.ingest_precomputed_embeddings(
            [e.model_dump() for e in entries.entries]
        )
        return IngestionResponse(
            success=True,
            message=f"{count} entries with precomputed embeddings were successfully ingested",
            count=count
        )
    except Exception as e:
        _logger.error("Error ingesting precomputed embeddings: %s", str(e))
        raise HTTPException(status_code=500, detail=f"Error ingesting precomputed embeddings: {str(e)}")

@router.get("/kb", response_model=KnowledgeBaseDump)
async def get_kb():
    """Retrieves the entire knowledge base content."""
    _logger.info("Received GET /kb request")
    try:
        entries = rag_classifier.get_all_kb_entries()
        return KnowledgeBaseDump(
            entries=[KnowledgeBaseEntry(**e) for e in entries]
        )
    except Exception as e:
        _logger.exception("Error retrieving knowledge base: %s", str(e))
        raise HTTPException(status_code=500, detail=f"Error retrieving knowledge base: {str(e)}")
