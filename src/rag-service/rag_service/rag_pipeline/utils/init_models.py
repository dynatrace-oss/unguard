from typing import Tuple
from llama_index.llms.openai import OpenAI
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.ollama import Ollama
from llama_index.embeddings.ollama import OllamaEmbedding

def init_langdock_llm(settings) -> OpenAI:
    return OpenAI(
        model=settings.llm_model,
        api_key=settings.langdock_api_key.get_secret_value(),
        api_base=settings.model_provider_base_url,
        timeout=120.0,
    )

def init_langdock_embedding(settings) -> OpenAIEmbedding:
    return OpenAIEmbedding(
        model=settings.embeddings_model,
        api_key=settings.langdock_api_key.get_secret_value(),
        api_base=settings.model_provider_base_url,
    )

def init_ollama_llm(settings) -> Ollama:
    return Ollama(
        model=settings.llm_model,
        request_timeout=120.0,
        context_window=8000,
        base_url=settings.model_provider_base_url,
    )

def init_ollama_embedding(settings) -> OllamaEmbedding:
    return OllamaEmbedding(
        model_name=settings.embeddings_model,
        base_url=settings.model_provider_base_url,
    )

def init_langdock_models(settings) -> tuple[OpenAI, OpenAIEmbedding]:
    return init_langdock_llm(settings), init_langdock_embedding(settings)

def init_ollama_models(settings) -> Tuple[Ollama, OllamaEmbedding]:
    return init_ollama_llm(settings), init_ollama_embedding(settings)
