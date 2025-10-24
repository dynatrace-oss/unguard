from typing import List
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core import Document

from config import get_settings

settings = get_settings()

def create_embedding_model() -> OpenAIEmbedding:
    """Create embedding model instance using global settings."""
    return OpenAIEmbedding(
        model=settings.embeddings_model,
        api_key=settings.langdock_api_key.get_secret_value(),
        api_base=settings.langdock_api_base_url,
    )

def compute_embeddings_for_batch(embed_model: OpenAIEmbedding, batch_of_docs: List[Document]) -> List[List[float]]:
    """Compute embeddings for a batch of Documents."""
    return [embed_model.get_text_embedding(d.text) for d in batch_of_docs]
