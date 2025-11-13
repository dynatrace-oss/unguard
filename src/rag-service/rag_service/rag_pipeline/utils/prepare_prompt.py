from typing import Iterable, Any, List

__all__ = ["prepare_prompt"]

def _format_retrieved_examples(retrieved_examples: Iterable[Any], logger) -> str:
    """Prepares and formats the retrieved examples as strings and return them in a list."""
    if not retrieved_examples:
        return "No retrieved examples available."

    prepared_examples: List[str] = []
    for index, example in enumerate(retrieved_examples):
        try:
            metadata = getattr(example.node, "metadata", {}) or {}
            label = str(metadata.get("label", "")).lower()
            if label not in ("spam", "not_spam"):
                continue
            score = getattr(example, "score", None)
            text = getattr(example.node, "text", "").strip()
            prepared_examples.append(f"Example {index+1} | label={label} | score={score} | text: {text}")
        except Exception as e:
            logger.warning("Error formatting retrieved example %d: %s", index, e)
            continue
    return "\n".join(prepared_examples) if prepared_examples else "No retrieved examples available."

def prepare_prompt(retrieved_examples: Iterable[Any], user_post: str, prompt_template, logger) -> str:
    """Builds the prompt using the given template with prepared retrieved examples and the user post."""
    prepared_retrieved_examples = _format_retrieved_examples(retrieved_examples, logger)
    prompt = prompt_template.substitute({"retrieved_examples": prepared_retrieved_examples, "user_post": user_post})
    return prompt
