# Embeddings Cluster Analysis based and Suspicious Pattern Detection

This detection strategy analyzes the cluster structure of new entries to identify suspicious near-duplicate clusters that
might indicate a targeted data poisoning attack, thus analyzing the **intrinsic structure** of new entries.

Furthermore, pattern analysis using n-grams is applied on the suspicious clusters to identify repeated and consistent
patterns across multiple entries in order to identify the poisoning trigger.

This strategy is particularly effective against targeted data poisoning attacks, such as the keyword attack, where
multiple entries are crafted to include specific triggers while maintaining overall semantic similarity to legitimate entries.

The detection strategy is **not** suitable for the label-flipping attack, as the label consistency is not analyzed.
