# Data Poisoning Attacks in RAG Service

## Getting Started

### Precomputing the embeddings for the attack
To speed up the attack execution, the embeddings for the new entries to be ingested are precomputed and stored locally
under `src/rag-service/data_poisoning_attacks/<attack_name>/attack_data/`.

When necessary to recompute the embeddings (e.g. after when changing the embedding model or the dataset), this can be done
by running the Data Preprocessor, as described in the [General README](../README.md).

### Prerequisites
Before running the attacks, make sure that the RAG service is already up and running. If not, start it by running the
following command from the `src/rag-service` directory:
```bash
fastapi run rag_service/main.py
```
## Available Data Poisoning Attacks
### [1. Label Flipping Attack](./label_flipping/README.md)
### [2. Keyword Attack](./keyword_attack/README.md)
