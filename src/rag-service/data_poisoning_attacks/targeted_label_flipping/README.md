# Targeted Label Flipping Attack
The targeted label flipping attack performs a data poisoning attack on the RAG service by ingesting new entries with flipped
labels into the Knowledge Base (KB) of the RAG service.
In contrast to the general label flipping attack, only few poisoned entries for a very specific semantic context are
ingested. Instead of decreasing the general model performance, the goal is to manipulate the model's behavior to
produce poisoned outputs only for very specific queries.
The effects of the attack are then evaluated by measuring the performance of the model on the test-set after the attack.

## Label Flipping Attack
The preparation of the data for the label flipping attack is handled by the Data Preprocessor and involves flipping the
labels of the entries in the attack dataset (i.e. spam to non-spam and vice versa).

## Running the attack and evaluation
To run the attack, including the subsequent evaluation of the model's performance and attack success rate after the attack,
run the following command from the `src/rag-service` directory:

```bash
python -m data_poisoning_attacks.targeted_label_flipping.targeted_label_flipping_attack
```

The evaluation results will be stored under `src/rag-service/data_poisoning_attacks/targeted_label_flipping/evaluation_results/`.

## Note
The dataset used for the targeted label flipping attack was generated using Gpt-5.
