from typing import List
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.embeddings.ollama import OllamaEmbedding
from llama_index.core import Document

from rag_service.config import get_settings
from rag_service.constants import PROVIDER_OLLAMA, PROVIDER_LANGDOCK
from rag_service.rag_pipeline.utils.init_ollama_models import init_ollama_embedding
from rag_service.rag_pipeline.utils.init_langdock_models import init_langdock_embedding

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

def compute_embedding_for_doc(embed_model: OpenAIEmbedding, doc: Document) -> List[float]:
    """Computes the embedding for a single document."""
    if not doc.text or not isinstance(doc.text, str):
        raise ValueError("Document text is invalid. Ensure it is a non-empty string.")
    try:
        return embed_model.get_text_embedding(doc.text)
    except Exception as e:
        raise RuntimeError(f"Failed to compute embedding for document. Error: {e}")
