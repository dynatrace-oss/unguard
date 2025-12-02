from typing import List, Dict
import numpy as np

from rag_service.config import get_settings

settings = get_settings()

def extract_spam_entries(entries: List[Dict]) -> np.ndarray:
    """ Extracts embeddings of spam entries from the given list"""
    spam_embeddings = [
        np.array(entry["embedding"])
        for entry in entries
        if entry.get("label", "").lower().strip() == settings.spam_label
    ]
    return np.array(spam_embeddings)

def extract_non_spam_entries(entries: List[Dict]) -> np.ndarray:
    """ Extracts embeddings of non-spam entries from the given list"""
    non_spam_embeddings = [
        np.array(entry["embedding"])
        for entry in entries
        if entry.get("label", "").lower().strip() == settings.not_spam_label
    ]
    return np.array(non_spam_embeddings)
