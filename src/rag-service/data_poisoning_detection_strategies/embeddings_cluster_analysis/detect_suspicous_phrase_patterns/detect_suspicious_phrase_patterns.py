import numpy as np
from typing import Tuple
from collections import defaultdict
from typing import Dict, List, DefaultDict

from rag_service.config import get_settings

settings = get_settings()

# max n-gram size for phrase extraction
MAX_NGRAM = 10

# min percentage of new entries containing the pattern for it to be considered suspicious
PERCENTAGE_OF_PATTERN_OCCURRENCES_THRESHOLD = 0.15

# max standard deviation of normalized positions for suspicious phrase
POSITION_STD_THRESHOLD = 0.05


def _get_ngrams_with_position(tokens: List[str], max_n: int = MAX_NGRAM) -> List[Tuple[str, int]]:
    """
    Computes all n-grams (from 1 to MAX_NGRAM) from the list of tokens.
    Returns all n-gram phrases and their positions in the text.
    """
    ngrams: List[Tuple[str, int]] = []

    for n in range(1, max_n + 1):
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
    Returns a dictionary with all n g-grams of that entry, mapped to a list of its normalized positions in the text.
    """
    phrase_statistics: Dict[str, List[float]] = {}

    for phrase, start_index in _get_ngrams_with_position(tokens):
        phrase_position_in_text = start_index / len(tokens)
        if phrase not in phrase_statistics:
            phrase_statistics[phrase] = []
        phrase_statistics[phrase].append(phrase_position_in_text)

    return phrase_statistics


def _extract_suspicious_phrases(suspicious_phrase_patterns: Dict[str, Dict[str, list[float]]]) -> List[str]:
    """
    Extracts suspicious phrases from the identified consistent phrase patterns by applying the following steps:
    1. Sort phrases by length in descending order.
    2. Iterate through the sorted phrases and select only phrases that are not a substring of any already selected phrase,
       unless they occur in more entries than the selected phrase.

    Returns a list of suspicious phrases that may indicate targeted data poisoning attacks.
    """
    suspicious_phrase_patterns_sorted_by_length = sorted(suspicious_phrase_patterns.keys(), key=len, reverse=True)

    disjoint_phrases_from_suspicious_patterns: List[str] = []
    for phrase in suspicious_phrase_patterns_sorted_by_length:
        is_substring = False
        for selected_phrase in disjoint_phrases_from_suspicious_patterns:
            if phrase in selected_phrase:
                occurrences_of_phrase = len(suspicious_phrase_patterns[phrase]["entry_ids"])
                occurrences_of_selected_phrase = len(suspicious_phrase_patterns[selected_phrase]["entry_ids"])
                if occurrences_of_phrase <= occurrences_of_selected_phrase:
                    is_substring = True
                    break
        if not is_substring:
            disjoint_phrases_from_suspicious_patterns.append(phrase)

    return disjoint_phrases_from_suspicious_patterns


def _identify_suspicious_phrase_patterns_across_entries(phrase_statistics: Dict[str, Dict[str, List[float]]], new_entries_total, logger) -> Dict[str, Dict[str, List[float]]]:
    """
    Identifies suspicious phrases that occur in a consistent manner across multiple new entries.
    Returns a dictionary of suspicious phrase patterns that may indicate targeted data poisoning attacks.
    """
    suspicious_phrase_patterns: Dict[str, Dict[str, List[float]]] = {}

    for phrase, statistics in phrase_statistics.items():
        entry_ids = statistics["entry_ids"]
        if len(entry_ids) < PERCENTAGE_OF_PATTERN_OCCURRENCES_THRESHOLD * len(new_entries_total):
            continue

        if statistics["variance_of_pattern_position_in_text"] <= POSITION_STD_THRESHOLD:
            logger.debug(
                "Detected phrase with highly consistent pattern over multiple entries: '%s'"
                "(entries_with_this_phrase=%d, variance_of_pattern_position_in_text=%.4f).",
                phrase, len(entry_ids), statistics["variance_of_pattern_position_in_text"],
            )
            suspicious_phrase_patterns[phrase] = statistics

    return  suspicious_phrase_patterns

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
            "phrase_position_in_text": [],
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
            statistics_for_current_phrase = phrase_statistics[phrase]
            statistics_for_current_phrase["entry_ids"].append(entry_id)
            statistics_for_current_phrase["phrase_position_in_text"].append(np.mean(phrase_positions_in_text))

    for phrase, statistics in phrase_statistics.items():
        positions_of_phrase_in_text = np.array(statistics["phrase_position_in_text"], dtype=float)
        variance_of_positions_in_text = np.std(positions_of_phrase_in_text)
        statistics["variance_of_pattern_position_in_text"] = variance_of_positions_in_text

    return phrase_statistics


def detect_suspicious_phrase_patterns(
    new_entries: List[Dict],
    logger,
) -> List[str]:
    """
    Detects phrases that occur in a consistent manner across multiple new entries and may indicate targeted data poisoning
    attacks, such as keyword attacks.

    Algorithm:
    1. Extract phrases using n-grams from new entries and analyze their occurrence patterns.
    2. Identify phrases that occur in a consistent manner across multiple new entries based on defined
         thresholds.
    3. Extract suspicious phrases from the identified consistent phrase patterns.

    Returns a list of suspicious phrase patterns that may indicate targeted data poisoning attacks.
    """
    phrase_statistics = _analyze_phrase_patterns(new_entries)
    suspicious_phrase_patterns= _identify_suspicious_phrase_patterns_across_entries(
        phrase_statistics, new_entries, logger)

    if suspicious_phrase_patterns:
        suspicious_phrases = _extract_suspicious_phrases(suspicious_phrase_patterns)
        return suspicious_phrases
    else:
        return []
