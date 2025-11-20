from typing import List
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.embeddings.ollama import OllamaEmbedding
from llama_index.core import Document

from ...config import get_settings
from ...constants import PROVIDER_OLLAMA, PROVIDER_LANGDOCK
from ...rag_pipeline.utils.init_ollama_models import init_ollama_embedding
from ...rag_pipeline.utils.init_langdock_models import init_langdock_embedding

settings = get_settings()

def create_embedding_model() -> OpenAIEmbedding | OllamaEmbedding:
    """Create embedding model instance using global settings."""
    provider = (settings.model_provider or "").strip().lower()
    if provider == PROVIDER_OLLAMA:
        return init_ollama_embedding(settings)
    elif provider == PROVIDER_LANGDOCK:
        return init_langdock_embedding(settings)
    else:
        raise ValueError("Error: LLM Provider variable missing or invalid."
                         "Please set it to 'Ollama' or 'LangDock' in the .env file or environment variables.")

def compute_embeddings_for_batch(embed_model: OpenAIEmbedding, batch_of_docs: List[Document]) -> List[List[float]]:
    """Compute embeddings for a batch of Documents."""
    return [embed_model.get_text_embedding(d.text) for d in batch_of_docs]
