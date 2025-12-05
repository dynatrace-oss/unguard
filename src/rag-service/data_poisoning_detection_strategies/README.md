# Data Poisoning Detection Strategies
The RAG service supports multiple data poisoning detection strategies to identify and mitigate potential poisoning attacks
at KB ingestion time. The detection is applied when ingesting new entries into the Knowledge Base (KB). Detected poisoned entries
are rejected and not added to the KB.
The available detection strategies are described below.

For information about how to enable data poisoning detection in the RAG service, please see the [RAG Service README](../README.md#data-poisoning-detection-strategies).
Please note, that while this detections strategy performs well for the label-flipping attack, it is not suitable fo
the keyword attack.

## 1. Embedding Space Similarity
This detection strategy analyzes the similarity of embeddings in the KB and of new entries per label (spam/non-spam).
Cosine similarity is used on the centroids of the embeddings for each label. A batch of new entries is considered poisoned,
when its embeddings centroid for a label is more similar to the centroid of the opposite label in the KB than to the centroid
of its own label.

### Batch-level detection
The centroids of the batch of embeddings per label are computed for both the current KB contents and the new entries. A batch of new entries
is considered poisoned, when its embeddings centroid for a label is more similar to the centroid of the opposite label in
the KB than to the centroid of its own label.

This strategy is more coarse-grained compare to entry-level detection, as it only considers the batch as a whole and not
individual entries. This might lead to the whole batch being rejected, even when only a subset of the new entries are poisoned.
Furthermore, this strategy is less suitable for mixed batches of poisoned and clean entries, as it might not detect poisoning
when the majority of the entries are clean. However, the detection is more robust against individual outliers.
Thus, this strategy should be preferred, when data poisoning is expected to affect a significant portion of the new entries.

### Entry-level detection
This strategy computes the similarity of the embedding of each new entry to the centroids of both labels in the KB
individually. An entry is considered poisoned, when its embedding is more similar to the centroid of the opposite label
in the KB than to the centroid of its own label.

This strategy allows for more fine-grained detection of poisoned entries, as it evaluates each entry individually,
thus being applicable to mixed batches of poisoned and clean entries. However, it is less robust against individual outliers,
which might lead to higher false positive and false negative rates.
Thus, this strategy should be preferred, when data poisoning is expected to affect only a subset portion of the new entries.
