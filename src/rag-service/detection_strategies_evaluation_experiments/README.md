# Evaluation Setup for Detection Strategies
This evaluation setup can be used to evaluate the detection strategies.
It allows to run automated experiments with configurable parameters to evaluate the effectiveness of the data poisoning
detection strategies in various attack scenarios.

The evaluation results and computed metrics are automatically stored at ```/evaluation_results```.

## How to use

### Configurable Parameters

#### Detection Strategies
The evaluation setup currently supports the following detection strategies:
- 'embedding_similarity_entry_level' (Embedding Space Similarity based Detection at Entry Level)
- 'embedding_similarity_batch_level' (Embedding Space Similarity based Detection at Batch Level)
- 'embeddings_cluster_analysis' (Embedding Space Cluster Analysis based Detection)
- 'knn_label_consistency' (Neighbour Label Consistency based Detection using K-Nearest Neighbours)
- 'ann_label_consistency' (Neighbour Label Consistency based Detection using Approximate Nearest Neighbours)

For more information on the individual detection strategies, please refer to the [respective documentation](../data_poisoning_detection_strategies/README.md)

#### Attack Types
The following attack types are supported:
- 'label_flipping' (Label Flipping Attack)
- 'keyword_injection' (Keyword Injection Attack)
- 'targeted_label_flipping' (Targeted Label Flipping Attack)

For more information about the attack types, please refer to the [respective documentation](../data_poisoning_attacks/README.md)

#### Batch Poisoning Percentage
The following batch poisoning percentages are configurable:
- 0% (No poisoning)
- 10% (10% of the data in the batch to be ingested is poisoned)
- 40% (40% of the data in the batch to be ingested is poisoned)
- 70% (70% of the data in the batch to be ingested is poisoned)
- 100% (Full poisoning)

#### Dataset
Four different datasets from Huggingface can be used for the evaluation:
- 'enron' ("Enron Spam Email Dataset" from the Enron Corpus)
- 'spam_assassin' ("SpamAssassin" Dataset from Apache Public Datasets)
- 'deysi_spam_detection' ("Spam Detection Dataset" by Deysi)
- 'sms_spam' ("SMS Spam Collection Dataset" by UC Irvine)

For references to the datasets, please refer to the [Datasets](#datasets) section below.

The number of splits of the evaluation datasets can be freely configured and is set to 10 by default.
The higher the number of splits, the smaller the individual evaluation datasets become.

### Precomputing the embeddings
The embeddings for the datasets used in the evaluation have already been precomputed and stored locally under
```/experiment_data```. When necessary to recompute the embeddings (e.g. after changing the embeddings model or the dataset),
this can be done by running
```bash
python -m detection_strategies_evaluation_experiments.experiment_data_preparation.precompute_embeddings
```

### Running a single experiment
To run one single experiment, use the script located at ```/experiment_scripts/run_single_experiment.py```.
The following parameters can be configured:
    - the detection strategy to be evaluated
    - the attack type to be used for the evaluation
    - the dataset used for the evaluation
    - the number of splits, being 10 by default
    - the percentage of poisoned data per batch

The script will run the experiment for the given configuration, evaluating the performance of the detection strategy for
each split. Finally, the results across all splits will be aggregated and the metrics computed and stored.

For each individual experiment run, a local instance of the RAG service is automatically started and stopped to ensure a clean state.

### Running a full evaluation for one combination of detection strategy and attack type
To run a full evaluation for one combination of detection strategy and attack type, use the script located at
```/experiment_scripts/run_full_evaluation.py```.
The following parameters can be configured:
    - the detection strategy to be evaluated
    - the attack type to be used for the evaluation

For the given detection strategy and attack type, the script will run multiple experiments consecutively. For each dataset
five experiment runs are performed, each using different percentages of poisoned data (0%, 10%, 40%, 70%, 100%). Furthermore,
each experiment is run with multiple splits (10 by default). Finally, the results across all splits are aggregated and the metrics
computed and stored.

For each individual experiment run, a local instance of the RAG service is automatically started and stopped to ensure a clean state.

### Evaluation Results
The following metrics are computed for each experiment:
- True Positive Rate
- False Positive Rate
- True Negative Rate
- False Negative Rate
- Accuracy
- Precision
- Recall
- F1-Score

For each experiment run, the resulting metrics are stored in timestamped JSON files at ```/evaluation_results/<detection_strategy>/<attack_type>/```, along with additional information about the
experiment configuration.

## Datasets
The following datasets are used for the evaluation:
- Enron Spam Dataset
  - V. Metsis, I. Androutsopoulos and G. Paliouras, "Spam Filtering with
    Naive Bayes - Which Naive Bayes?". Proceedings of the 3rd Conference
    on Email and Anti-Spam (CEAS 2006), Mountain View, CA, USA, 2006.
  - The evaluation uses [this](https://huggingface.co/datasets/SetFit/enron_spam) version from Huggingface
- SMS Spam Collection Dataset
  - Almeida, T. & Hidalgo, J. (2011). SMS Spam Collection [Dataset]. UCI Machine Learning Repository. https://doi.org/10.24432/C5CC84.
  - The evaluation uses [this](https://huggingface.co/datasets/ucirvine/sms_spam) version from Huggingface
- [Spam Assassin Dataset](https://spamassassin.apache.org/old/publiccorpus/)
  - Spam Assassin Project (2015) Spam Assassin Public Corpus.
  - the evaluation uses [this](https://huggingface.co/datasets/bvk/SpamAssassin-spam) version from Huggingface
- The [Deysi Spam Detection Dataset](https://huggingface.co/datasets/Deysi/spam-detection-dataset) from Huggingface

## Data Preparation

### Dataset Usage
For the evaluation datasets, each dataset is used as follows:
- 50% for the base dataset (initial knowledge of the RAG service)
- 25% for the legitimate/clean dataset
- 25% for the attack/poisoned dataset
  - The same data portion is used for all attack types, however, different attack types manipulate the data differently.

### Experiment Splits
For the experiments, multiple attacks are performed using different splits of the legitimate and poisoned data.
The splits are created as follows, given n splits, a batch poisoning percentage of p%, as well as the attack and legitimate dataset:
    - n splits are created, where each split contains p% poisoned data and (100-p)% legitimate data
    - For each split, the specified percentage of legit entries is maintained in the entry distribution of the batch.
