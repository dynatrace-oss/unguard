from llama_index.llms.openai import OpenAI
from llama_index.embeddings.openai import OpenAIEmbedding

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

def init_langdock_models(settings) -> tuple[OpenAI, OpenAIEmbedding]:
    return init_langdock_llm(settings), init_langdock_embedding(settings)
