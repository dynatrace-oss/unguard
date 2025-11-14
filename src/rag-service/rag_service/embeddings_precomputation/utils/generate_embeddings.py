from typing import List
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.embeddings.ollama import OllamaEmbedding
from llama_index.core import Document

from rag_service.config import get_settings
from rag_service.rag_pipeline.utils.init_models import init_ollama_embedding, init_langdock_embedding

settings = get_settings()

def create_embedding_model() -> OpenAIEmbedding | OllamaEmbedding:
    """Create embedding model instance using global settings."""
    if settings.model_provider == "Ollama":
        return init_ollama_embedding(settings)
    elif settings.model_provider == "LangDock":
        return init_langdock_embedding(settings)
    else:
        raise ValueError("Error: LLM Provider variable missing or invalid."
                         "Please set it to 'Ollama' or 'LangDock' in the .env file or environment variables.")

def compute_embeddings_for_batch(embed_model: OpenAIEmbedding, batch_of_docs: List[Document]) -> List[List[float]]:
    """Compute embeddings for a batch of Documents."""
    return [embed_model.get_text_embedding(d.text) for d in batch_of_docs]
