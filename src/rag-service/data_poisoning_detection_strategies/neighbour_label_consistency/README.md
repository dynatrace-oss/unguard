# Neighbour label consistency based Detection
This detection strategy analyzes the labels of the nearest neighbors in the embedding space for each new entry to identify
inconsistencies that might indicate potential data poisoning, thus analyzing the **local consistency** of new entries.

The detection strategy supports two modes for neighbour search, as well as three different variants for the label decision.

Please Note: This strategy is not suitable for the keyword attack, as the local label consistency is not affected by the attack.

## Neighbour Search Modes
To find the nearest neighbours of a new entry among the knowledge base contents, two different modes are supported
(configurable via the `DATA_POISONING_DETECTION_STRATEGY` environment variable):

### KNN
In this mode, KNN (k-nearest neighbours) is used to find the nearest neighbours of the new entry among the knowledge base
contents.

This strategy uses the NearestNeighbors model from the sklearn library with cosine distance as distance metric.

### ANN
In this mode, ANN (approximate nearest neighbours) is used to find the nearest neighbours of the new entry among the
knowledge base contents. To determine if the new entry is poisoned, the labels of the nearest neighbours are analyzed.

This strategy uses NNDescent from the PyNNDescent library with cosine distance as distance metric.

While ANN might lead to slightly less accurate neighbour search results compared to KNN, it scales better and is thus
faster for larger knowledge bases.

## Label Decision Variants
To determine if the new entry is poisoned, the labels of the nearest neighbours are analyzed. Three different variants
for the label decision are supported
(configurable via the `LABEL_CONSISTENCY_DETECTION_DECISION_VARIANT` environment variable):

### Majority Voting
When the majority of the nearest neighbours have a different label than the new entry, it is considered poisoned.

### Distance-weighted Voting
Similar to majority voting, but taking into account the distance of the neighbours. Votes of nearer neighbours are weighted
more heavily than those of further neighbours.

### Threshold-based Decision
Only the nearest neighbours within a certain distance threshold are considered for the label decision.
Majority voting is then applied the selected neighbours.
