import numpy as np
from typing import Tuple
from sklearn.metrics.pairwise import cosine_similarity
from collections import defaultdict
from typing import Dict, List, DefaultDict

from rag_service.config import get_settings

settings = get_settings()

SUSPICIOUS_SIMILARITY_THRESHOLD = 0.87 # the treshold above which two entries are considered near duplicates (tuned)
NEAR_DUPLICATES_MAX_PROPORTION_THRESHOLD = 0.1 # the threshold proportion for near duplicates over which an entry is considered suspicious

MAX_NGRAM = 10  # max n-gram size for phrase extraction
MIN_OCCURRENCES_OF_PATTERN = 5 # min number of occurrences of the pattern across entries for it to be considered consistent
PERCENTAGE_OF_PATTERN_OCCURRENCES_THRESHOLD = 0.15 # min percentage of new entries containing the pattern for it to be considered suspicious
POSITION_STD_THRESHOLD = 0.10 # max standard deviation of normalized positions for suspicious phrase


def _get_ngrams_with_position(tokens: List[str]) -> List[Tuple[str, int]]:
    """
    Computes all n-grams (from 1 to MAX_NGRAM) from the list of tokens.
    Returns all n-gram phrases and their positions in the text.
    """
    ngrams: List[Tuple[str, int]] = []

    for n in range(1, MAX_NGRAM + 1):
        if len(tokens) < n:
            break
        for start_index in range(len(tokens) - n + 1):
            ngram_tokens = tokens[start_index : start_index + n]
            phrase = " ".join(ngram_tokens)
            ngrams.append((phrase, start_index))

    return ngrams

def _get_phrase_statistics_for_entry(tokens: List[str]) -> Dict[str, List[float]]:
    """
    Extracts phrases in an entry using n-grams and analyzes their positions in the text.
    Returns a dictionary mapping each phrase to a list of its normalized positions in the text.
    """
    phrase_statistics: Dict[str, List[float]] = {}

    for phrase, start_index in _get_ngrams_with_position(tokens):
        phrase_position_in_text = start_index / len(tokens)
        if phrase not in phrase_statistics:
            phrase_statistics[phrase] = []
        phrase_statistics[phrase].append(phrase_position_in_text)

    return phrase_statistics

def _analyze_phrase_patterns(
    new_entries: List[Dict]
) -> Dict[str, Dict[str, List[float]]]:
    """
    Extracts phrases using n-grams from new entries and analyzes their occurrence patterns by:
        - Calculating the number of occurrences of each phrase.
        - Calculating the variance of positions for each phrase across entries to identify consistent patterns.

    Returns a dictionary mapping each phrase to its statistics and a list of entry IDs where it occurs.
    """
    phrase_statistics: DefaultDict[str, Dict[str, List[float|str]]] = defaultdict(
        lambda: {
            "entry_ids": [],
            "number_of_occurrences": [],
            "variance_of_pattern_position_in_text": [],
        }
    )

    for entry in new_entries:
        text = (entry.get("text")).strip()
        tokens = text.split()
        entry_id: str = entry.get("id")
        if not tokens or entry_id is None:
            continue

        phrase_statistics_for_current_entry: Dict[str, List[float|str]] = _get_phrase_statistics_for_entry(tokens)

        for phrase, phrase_positions_in_text in phrase_statistics_for_current_entry.items():
            variance_of_phrase_position_in_text = np.std(phrase_positions_in_text)
            statistics_for_current_phrase = phrase_statistics[phrase]
            statistics_for_current_phrase["entry_ids"].append(entry_id)
            statistics_for_current_phrase["number_of_occurrences"].append(len(phrase_positions_in_text))
            statistics_for_current_phrase["variance_of_phrase_position_in_text"] = variance_of_phrase_position_in_text

    return phrase_statistics


def _extract_suspicious_phrases(suspicious_phrase_patterns: Dict[str, Dict[str, list[float]]]) -> List[str]:
    """
    Extracts suspicious phrases from the identified consistent phrase patterns across entries, based on defined thresholds.
    """
    representative_phrase = max(
        suspicious_phrase_patterns.keys(), key=len
    )
    if len(suspicious_phrase_patterns[representative_phrase]["entry_ids"]) >= PERCENTAGE_OF_PATTERN_OCCURRENCES_THRESHOLD * len(suspicious_phrase_patterns) and \
        len(suspicious_phrase_patterns[representative_phrase]["entry_ids"]) >= MIN_OCCURRENCES_OF_PATTERN:
            return list(str(representative_phrase).split())
    else:
        return []

def _identify_consistent_phrase_patterns_across_entries(phrase_statistics: Dict[str, Dict[str, List[float]]], new_entries_total, logger) -> Dict[str, Dict[str, List[float]]]:
    """
    Identifies phrases that occur in a consistent manner across multiple new entries.
    Returns a dictionary of suspicious phrase patterns that may indicate targeted data poisoning attacks.
    """
    consistent_phrase_patterns: Dict[str, Dict[str, List[float]]] = {}

    for phrase, statistics in phrase_statistics.items():
        entry_ids = statistics["entry_ids"]
        if len(entry_ids) < PERCENTAGE_OF_PATTERN_OCCURRENCES_THRESHOLD * len(new_entries_total):
            continue

        variance_of_pattern_position_in_text = np.array(statistics["variance_of_phrase_position_in_text"], dtype=float)

        if variance_of_pattern_position_in_text <= POSITION_STD_THRESHOLD:
            logger.debug(
                "Detected phrase with highly consistent pattern over multiple entries: '%s'"
                "(entries_with_this_phrase=%d, variance_of_phrase_position_in_entries=%.4f).",
                phrase, len(entry_ids), variance_of_pattern_position_in_text,
            )
            consistent_phrase_patterns[phrase] = statistics
    return  consistent_phrase_patterns


def _detect_suspicious_phrase_patterns(
    new_entries: List[Dict],
    logger,
) -> List[str]:
    """
    Detects phrases that occur in a consistent manner across multiple new entries and may indicate targeted data poisoning
    attacks, such as keyword attacks.

    Returns a list of suspicious phrase patterns that may indicate targeted data poisoning attacks.
    """
    phrase_statistics = _analyze_phrase_patterns(new_entries)
    consistent_phrase_patterns_across_entries= _identify_consistent_phrase_patterns_across_entries(
        phrase_statistics, new_entries, logger)

    if consistent_phrase_patterns_across_entries:
        suspicious_phrases = _extract_suspicious_phrases(consistent_phrase_patterns_across_entries)
        return suspicious_phrases
    else:
        return []

def _find_near_duplicate_clusters(
    new_entries: List[Dict]
) -> List[str]:
    """
    Analyzes embeddings of the new entries to find near duplicate clusters indicating potential targeted data poisoning attacks.
    Returns a list of ids of suspicious entries.
    """

    suspicious_entries_ids = set()

    new_entries_embeddings = [entry.get("embedding") for entry in new_entries if "embedding" in entry]
    if new_entries_embeddings:
        new_entries_embeddings_array = np.array(new_entries_embeddings)
        similarity_between_new_entries = cosine_similarity(new_entries_embeddings_array)

        near_duplicates_max_proportion_threshold = (len(new_entries) * NEAR_DUPLICATES_MAX_PROPORTION_THRESHOLD)

        for i in range(len(new_entries)):
            near_duplicates_count = sum(1 for j in range(len(new_entries)) if i != j
                                        and similarity_between_new_entries[i][j] > SUSPICIOUS_SIMILARITY_THRESHOLD)
            if near_duplicates_count >= near_duplicates_max_proportion_threshold:
                suspicious_entries_ids.add(new_entries[i].get("id"))

    return list(suspicious_entries_ids)

def detect_data_poisoning_via_embeddings_cluster_analysis(
    new_entries: List[Dict],
    logger
) -> List[str]:
    """
    Data Poisoning Detection Strategy for targeted Data Poisoning Attacks, such as Keyword Attacks.

    Applies two subsequent analyses:
    1. Embeddings Cluster Analysis to find near duplicate clusters.
    2. Phrase Pattern Analysis using n-grams on the suspicious subset found in step 1 to identify suspicious phrase patterns.

    Logs warnings for suspicious phrase patterns if detected.
    Returns a list of ids of suspicious entries.
    """

    logger.info("Running data poisoning detections strategy using embeddings cluster analysis and phrase pattern analysis...")

    suspicious_entries_ids = _find_near_duplicate_clusters(new_entries)
    suspicious_subset = [entry for entry in new_entries if entry.get("id") in suspicious_entries_ids]

    if suspicious_subset:
        suspicious_phrase_patterns = _detect_suspicious_phrase_patterns(suspicious_subset, logger)

        if suspicious_phrase_patterns:
            logger.warning("Suspicious phrase patterns detected in suspicious entries, indicating potential data "
                           "poisoning: %s", suspicious_phrase_patterns)
        else:
            logger.info(
                "No consistent suspicious phrase patterns detected in suspicious entries."
            )

    return list(suspicious_entries_ids)
