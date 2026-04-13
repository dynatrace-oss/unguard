# Combined Detection Strategy
This detection strategy combines the following three individual detection strategies by applying them sequentially:
- [Embedding Space Similarity](../embedding_space_similarity/README.md) at entry-level
- [Embeddings Cluster and Pattern Analysis](../embeddings_cluster_analysis/README.md)
- [Neighbour Label Consistency](../neighbour_label_consistency/README.md)

While this strategy can cover a broader range of data poisoning attacks, it is also more computationally expensive, thus
its application should be carefully considered.
