# Data Poisoning Detection Strategies
The RAG service supports multiple data poisoning detection strategies to identify and mitigate potential poisoning attacks
at KB ingestion time. The detection is applied when ingesting new entries into the Knowledge Base (KB). Detected poisoned entries
are rejected and not added to the KB.

For information about how to enable data poisoning detection in the RAG service, please see the [RAG Service README](../README.md#data-poisoning-detection-strategies).
Please note, that while this detections strategy performs well for the label-flipping attack, it is not suitable fo
the keyword attack.

The following data poisoning detection strategies are currently available:

## 1. Embedding Space Similarity
See the [Embedding Space Similarity based Detection README](./embedding_space_similarity/README.md) for more information.

## 2. Embeddings Cluster and Pattern Analysis
See the [Embeddings Cluster and Pattern Analysis based Detection README](./embeddings_cluster_analysis/README.md)
for more information.

## 3. Neighbour Label Consistency
See the [Neighbour Label Consistency based Detection README](./neighbour_label_consistency/README.md) for more information.
