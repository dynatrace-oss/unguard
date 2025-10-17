from fastapi import APIRouter, HTTPException
from rag_pipeline.rag import rag_classifier
from schemas import (
    TextPost,
    BatchOfTextPosts,
    ClassificationResult,
    BatchOfClassificationResult
)

router = APIRouter()

@router.post("/classify", response_model=ClassificationResult)
async def classify_text(post: TextPost):
    """Classify a single text post as spam or not_spam."""
    try:
        result = rag_classifier.classify_text(post.text)
        return ClassificationResult(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during classification: {str(e)}")

@router.post("/classify/batch", response_model=BatchOfClassificationResult)
async def classify_batch(posts: BatchOfTextPosts):
    """Classify multiple text posts."""
    try:
        results = rag_classifier.classify_batch(posts.posts)
        return BatchOfClassificationResult(
            results=[ClassificationResult(**r) for r in results]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during batch classification: {str(e)}")
