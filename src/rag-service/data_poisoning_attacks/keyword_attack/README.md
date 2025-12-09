# Keyword Attack
The keyword attack performs a targeted data poisoning attack on the RAG service by ingesting non-spam entries with an injected
keyword/keyphrase into the KB. As a result, this causes the model to wrongly classify spam entries containing the same
keyword/keyphrase as non-spam.

The effects of the attack are evaluated by measuring the performance of the model on the test-set after the attack,
as well as the attack success rate (ASR). The ASR describes how many spam entries with appended keyword/keyphrase are
classified as non-spam after the attack has been performed, while having been correctly identified as spam before the attack.

## Keyword Attack Success Evaluation Dataset
To evaluate the attack success rate, a separate evaluation dataset is used, which contains entries that were originally
classified as spam by the RAG service. This dataset is stored locally and used by the Data Preprocessor to prepare the
dataset for the attack success evaluation by appending the keyword.

If necessary to re-compute the attack success evaluation dataset (e.g. if the base dataset changes), run the following command:
```bash
python -m data_poisoning_attacks.keyword_attack.prepare_attack_success_evaluation_dataset
```
Please ensure that the RAG-service is running and its KB unpoisoned before executing the script.

The following steps are performed by the script:
1. Filter for spam documents.
2. Cut the text of each spam document to the first 20 tokens.
3. To verify that the cut, otherwise unmodified, spam documents are still classified as spam, perform a test
classification using the (unpoisoned!) RAG service.
4. All cut documents which are still classified as spam are added to the keyword attack dataset and stored
as a parquet file.

## Keyword Attack Data Preparation
For the Keyword Attack, the Data Preprocessor prepares two datasets:

1. The attack dataset, where a predefined keyword/keyphrase is injected to the beginning and end of non-spam entries.
2. The attack evaluation dataset, where the same keyword/keyphrase is appended to the end of the prepared spam
   entries stored in the keyword attack success evaluation dataset.

## Running the attack and evaluation
To run the attack, including the subsequent evaluation of the model's performance after the attack & attack success rate,
run the following command from the `src/rag-service` directory:
```bash
python -m data_poisoning_attacks.keyword_attack.keyword_attack
```

By setting the `EVALUATE_AFTER_ATTACK` environment variable in the `.env` file, it is possible to configure whether the
attack should be evaluated subsequently to its execution.

The evaluation results will be stored under `src/rag-service/data_poisoning_attacks/keyword_attack/evaluation_results/`.
