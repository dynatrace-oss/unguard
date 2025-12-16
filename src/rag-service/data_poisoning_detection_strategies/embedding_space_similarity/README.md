# Embedding Space Similarity based Detection

This detection strategy analyzes the similarity of embeddings in the KB and of new entries per label (spam/non-spam)
based on their centroids per label, thus analyzing the **global consistency** of new entries with the existing KB contents.

Cosine similarity is used as a similarity measure. A batch of new entries is considered poisoned,
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
