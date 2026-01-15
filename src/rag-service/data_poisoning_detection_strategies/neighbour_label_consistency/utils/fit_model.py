from typing import List, Dict
import numpy as np
from sklearn.neighbors import NearestNeighbors
from pynndescent import NNDescent


def extract_all_embeddings(entries: List[Dict]) -> np.ndarray:
    """ Extracts embeddings of all entries from the given list"""
    all_embeddings = [
        np.array(entry["embedding"])
        for entry in entries
    ]
    return np.array(all_embeddings)


def fit_knn(kb_contents: List[Dict], number_of_neighbours: int) -> NearestNeighbors:
    """
    Fits the NearestNeighbors model from sklearn on the embeddings of the current KB contents.
    Returns the fitted KNN model.

    N_NEIGHBOURS defines how many nearest neighbours are retrieved for each new entry.
    --> For smaller N_NEIGHBOURS, the detection is more sensitive to local inconsistencies.
    --> For larger N_NEIGHBOURS, the detection is more robust to noise but may have a higher false negative rate.
    """
    kb_embeddings = np.array(extract_all_embeddings(kb_contents), dtype=float)

    knn = NearestNeighbors(
        n_neighbors=min(number_of_neighbours, len(kb_embeddings)),
        metric="cosine",
        algorithm="auto"
    )
    knn.fit(kb_embeddings)
    return knn

def fit_ann(
    kb_contents: List[Dict],
    number_of_neighbours: int,
) -> NNDescent:
    """
    Fits the NNDescent model on the embeddings of the current KB contents.
    Used for approximate nearest neighbor search (faster than KNN for large KBs).
    Returns the fitted NNDescent index.
    """
    embeddings_matrix = extract_all_embeddings(kb_contents)

    index = NNDescent(
        embeddings_matrix,
        n_neighbors=number_of_neighbours,
        metric="cosine",
    )
    index.prepare()

    return index
