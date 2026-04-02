from fastapi import APIRouter, HTTPException

from rag_service.rag_pipeline.rag import rag_classifier
from rag_service.schemas import (
    TextPost,
    BatchOfTextPosts,
    ClassificationResult,
    BatchOfClassificationResult
)
from logger.logging_config import get_logger

router = APIRouter()
_logger = get_logger(__name__)

@router.post("/classifyPost", response_model=ClassificationResult)
async def classify_text(post: TextPost):
    """Classify a single text post as spam or not_spam."""
    _logger.info("Received POST /classifyPost request")
    try:
        result = rag_classifier.classify_text(post.text)
        classification = result["classification"]
        if classification not in ("spam", "not_spam"):
            raise ValueError(f"Invalid classification result: {classification}")
        return ClassificationResult(classification=classification)
    except Exception as e:
        _logger.error("Error during classification: %s", str(e))
        raise HTTPException(status_code=500, detail=f"Error during classification: {str(e)}")

@router.post("/classifyBatchOfPosts", response_model=BatchOfClassificationResult)
async def classify_batch(posts: BatchOfTextPosts):
    """Classify multiple text posts."""
    _logger.info("Received POST /classifyBatchOfPosts request with %d posts", len(posts.posts))
    try:
        results = rag_classifier.classify_batch(posts.posts)
        batch_results = []
        for result in results:
            classification = result["classification"]
            if classification not in ("spam", "not_spam"):
                raise ValueError(f"Invalid classification result: {classification}")
            batch_results.append(ClassificationResult(classification=classification))
        return BatchOfClassificationResult(results=batch_results)
    except Exception as e:
        _logger.error("Error during batch classification: %s", str(e))
        raise HTTPException(status_code=500, detail=f"Error during batch classification: {str(e)}")
