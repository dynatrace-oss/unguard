# RAG Service

A microservice for spam classification using Retrieval-Augmented Generation (RAG).

## Architecture

- **FastAPI**: REST API framework
- **LlamaIndex**: RAG pipeline
- **ChromaDB**: Vector database for knowledge base of RAG System
- **Langdock**: OpenAI LLM and embeddings

## Getting Started

Before starting, you need to add your Langdock API key to your environment variables:

```bash
export LANGDOCK_API_KEY="your_openai_api_key"
export LANGDOCK_API_BASE_URL="your_openai_api_base_url"
```

When starting for the first time, you need to create a Virtual Environment, activate it and install the dependencies:

```bash
python3 -m venv venv
source ./venv/bin/activate
pip install -r requirements.txt
```

## Running the RAG Service locally
To run the RAG service locally, inside the ```/src/rag-service``` directory run:

```bash
fastapi dev rag_service/main.py
```

Or using uvicorn directly:
```bash
uvicorn rag_service.main:app --reload --host 0.0.0.0 --port 8000
```

When starting, the vector database will be created automatically under rag_service/vector-store/.
The service will be available at http://localhost:8000.

## Running the evaluation script
To evalute the performance of the model, you can run the evaluation script as follows:

```bash
python -m rag_service.evaluation.evaluate_model
```

## Embeddings Pre-Computation
To reduce the startup time of the RAG service and avoid recomputing the embeddings for the initial KB content on each startup, the embeddings are pre-computed and stored under `rag_service/data/base_data_embeddings/`.

When necessary to recompute the embeddings (e.g. when changing the embeddings model), you can run the following script:

```bash
python -m rag_service.embeddings_precomputation.generate_and_store_embeddings
```

## Running the RAG Service locally using an open source LLM from Ollama
To run the RAG service with a local open source model, you need to modify the `config.py` file to use a local model instead of OpenAI.

For example, the `llama3` model for the LLM and `nomic-embed-text` model for computing the embeddings can be used, or any other compatible model.
For setting up the models locally, follow the official documentation of [Ollama](https://github.com/ollama/ollama).

Steps:
- Install ollama via ```curl -fsSL https://ollama.com/install.sh | sh```
- Pull the models you want to use: e.g. ```ollama pull llama3.1``` and ```ollama pull nomic-embed-text```
- Run ```ollama serve```. By default, the models will be served to ```localhost:11434```
- Adapt the ```config.py``` file to use the local models as follows:
```
llm_model: str = "llama3.1:latest"
embeddings_model: str = "nomic-embed-text"
ollama_base_url: str = "http://localhost:11434"
```
- Adapt the ```_init_models()``` method in ```rag.py``` file to use the Ollama models for LLM and embeddings by replacing the method as follows:
```
  def _init_models(self):
    """Initializes the LLM and Embeddings models"""
    self._llm_model = Ollama(model=self.settings.llm_model, request_timeout=120.0, context_window=8000,
        base_url=self.settings.ollama_base_url)
    self._embeddings_model = ollama_embedding = OllamaEmbedding(
        model_name="nomic-embed-text",
        base_url=self.settings.ollama_base_url)
    self._logger.info("Models initialized (llm=%s embeddings=%s)", self.settings.llm_model, self.settings.embeddings_model)
```

## API Docs

Automatically generated API documentation available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

Those can be used to explore and test the API endpoints of the RAG service.


## Attribution

This project uses the [Deysi/spam-detection-dataset](https://huggingface.co/datasets/Deysi/spam-detection-dataset) dataset from Huggingface.
