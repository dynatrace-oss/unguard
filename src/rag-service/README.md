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
export OPENAI_API_KEY="your_openai_api_key"
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

The service will be available at http://localhost:8000.


## API Docs

Automatically generated API documentation available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc


## Attribution

This project uses the [Deysi/spam-detection-dataset](https://huggingface.co/datasets/Deysi/spam-detection-dataset) dataset from Huggingface.
