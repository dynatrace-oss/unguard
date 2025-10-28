# RAG Service

A microservice for spam classification using Retrieval-Augmented Generation (RAG).

## Architecture

- **FastAPI**: REST API framework
- **LlamaIndex**: RAG pipeline
- **ChromaDB**: Vector database for knowledge base of RAG System
- **OpenAI**: LLM and embeddings

## Getting Started

Before starting, you need to add your OpenAI API key to your environment variables:

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
You can run the RAG service locally with:

```bash
fastapi dev main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

When starting, the vector database will be created automatically under /vector-stores/chroma_db.
The service will be available at http://localhost:8000.

## Running the RAG Service locally with using a local open source LLM
To run the RAG service with a local open source model, you need to modify the `config.py` file to use a local model instead of OpenAI.

For example, the `llama3` model for the LLM and `nomic-embed-text` model for computing the embeddings can be used, or any other compatible model.
For setting up the models locally, follow the official documentation of [Ollama](https://github.com/ollama/ollama).

## API Docs

Automatically generated API documentation available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

Those can be used to explore and test the API endpoints of the RAG service.


## Attribution

This project uses the [Deysi/spam-detection-dataset](https://huggingface.co/datasets/Deysi/spam-detection-dataset) dataset from Huggingface.
