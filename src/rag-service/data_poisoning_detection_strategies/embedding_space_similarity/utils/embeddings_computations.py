import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def compute_embeddings_centroid(embeddings: np.ndarray) -> np.ndarray:
    if embeddings is None or embeddings.size == 0:
        raise ValueError("Cannot compute centroid of empty embeddings.")
    if embeddings.ndim == 1:
        embeddings = embeddings.reshape(1, -1)
    return np.mean(embeddings, axis=0, keepdims=True)

def compute_cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
    """ Computes cosine similarity between two embedding vectors """
    vec1_reshaped = vec1.reshape(1, -1)
    vec2_reshaped = vec2.reshape(1, -1)
    similarity = cosine_similarity(vec1_reshaped, vec2_reshaped)[0][0]
    return similarity
