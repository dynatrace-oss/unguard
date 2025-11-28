# RAG Service

A microservice for spam classification using Retrieval-Augmented Generation (RAG).

## Architecture

- **[FastAPI](https://fastapi.tiangolo.com/)**: REST API framework
- **[LlamaIndex](https://www.llamaindex.ai/)**: RAG pipeline
- **[ChromaDB](https://www.trychroma.com/)**: Vector database for knowledge base of RAG System
- **[Langdock](https://www.langdock.com)**: OpenAI LLM and embeddings
- **[Ollama](https://ollama.com/)**: Local open-source LLM and embeddings

## Getting Started for running the RAG Service locally

When starting for the first time, you need to create a Virtual Environment, activate it and install the dependencies:

```bash
python3 -m venv venv
source ./venv/bin/activate
pip install -r requirements.txt
```

Further, you need to decide which LLM and embeddings models you want to use.
Currently, the RAG service supports OpenAI models via Langdock and local open-source models via Ollama.

### Using OpenAI models via Langdock

First, rename the `.env.langdock` file to `.env` and adapt the configuration values as needed.
Before starting, you need to add your Langdock API Key and Base URL.
Now, when running the service it will automatically use the OpenAI models via Langdock for the LLM and embeddings.

### Using local open-source models via Ollama

First, you need to install Ollama and set up the models you want to use locally by following the official documentation of [Ollama](https://github.com/ollama/ollama).
Then, rename the `.env.local` file to `.env` and adapt the configuration values as needed.

## Starting the service
To run the RAG service locally, inside the `/src/rag-service` directory run:

```bash
fastapi run rag_service/main.py
```
or for auto-reload on code changes during development:

```bash
fastapi dev rag_service/main.py
```

Or using uvicorn directly:
```bash
uvicorn rag_service.main:app --reload --host 0.0.0.0 --port 8000
```

When starting, the vector database will be created automatically under `rag_service/vector-store/`.
The service will be available at http://localhost:8000.

## Running the evaluation script
To evalute the performance of the model, you can run the evaluation script as follows:

```bash
python -m evaluation.evaluate_model
```

The evaluation results will be stored under `rag_service/evaluation_results/`.
To limit the sample size used for evaluation, set the `EVALUATION_SAMPLE_SIZE` environment variable in the `.env` file.

## Data Preprocessing and Pre-computed Embeddings
To reduce the startup time of the RAG service and avoid recomputing the embeddings for the initial KB content on each startup, the embeddings for the initial data of the KB are pre-computed and stored under `rag_service/data/base_data_embeddings/`.
Furthermore, the datasets for the data poisoning attacks are prepared and their embeddings pre-computed and stored under `data_poisoning_attacks/[attack-type]/attack_data/`.

Furthermore, the Data Preprocessor also takes care of preparing the datasets for the data poisoning attacks (more info
in the [Data Poisoning Attacks README](./data_poisoning_attacks/README.md)).

When necessary to recompute the embeddings (e.g. when changing the embeddings model or dataset), you can run the following script:

```bash
python -m data_preprocessing.prepare_datasets
```

## Running and evaluating the Data Poisoning Attacks
To run and evaluate the data poisoning attacks, see the [Data Poisoning Attacks README](./data_poisoning_attacks/README.md).

## API Docs

Automatically generated API documentation available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

Those can be used to explore and test the API endpoints of the RAG service.

## Attribution

This project uses the [Deysi/spam-detection-dataset](https://huggingface.co/datasets/Deysi/spam-detection-dataset) dataset from Huggingface.
