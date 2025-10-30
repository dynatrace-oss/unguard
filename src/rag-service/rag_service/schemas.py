from pydantic import BaseModel, Field
from typing import List, Literal

class TextPost(BaseModel):
    text: str = Field(..., description="Text post to classify")

class BatchOfTextPosts(BaseModel):
    posts: List[str] = Field(..., description="List of text posts to classify")

class ClassificationResult(BaseModel):
    classification: Literal["spam", "not_spam"]

class BatchOfClassificationResult(BaseModel):
    results: List[ClassificationResult]

class KnowledgeBaseEntry(BaseModel):
    text: str = Field(..., description="Text post")
    label: Literal["spam", "not_spam"] = Field(..., description="Spam label")

class BatchOfKnowledgeBaseEntries(BaseModel):
    entries: List[KnowledgeBaseEntry]

class IngestionResponse(BaseModel):
    success: bool
    message: str
    count: int = Field(default=0, description="Number of entries ingested")

class KnowledgeBaseDump(BaseModel):
    entries: List[KnowledgeBaseEntry]
