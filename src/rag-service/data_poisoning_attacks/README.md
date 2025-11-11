# Data Poisoning Attacks in RAG Service

## 1. Label Flipping Attack
The label flipping attack performs a data poisoning attack on the RAG service by ingesting new entries with flipped
labels into the KB of the RAG service.
The effects of the attack are then evaluated by measuring the performance of the model on the test-set after the attack.

### Running the attack and evaluation

Before running, the attack, make sure that the RAG service is already running. If not, first start it by running the following command from the `src/rag-service` directory:
```bash
fastapi run rag_service/main.py
```

To run the attack, including the subsequent evaluation of the model's performance after the attack, run the following
command from the `src/rag-service` directory:

```bash
python -m data_poisoning_attacks.label_flipping.label_flipping_attack
```

The evaluation results will be stored under `src/rag-service/data_poisoning_attacks/label_flipping/evaluation_results/`.
