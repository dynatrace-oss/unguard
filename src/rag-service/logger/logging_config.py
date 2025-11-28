import logging
import os

from logger.custom_logger_formatter import CustomFormatter

_LOG_LEVEL = os.getenv("RAG_SERVICE_LOG_LEVEL", "INFO").upper()

def get_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)
    if not logger.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(CustomFormatter())
        logger.addHandler(handler)
    logger.setLevel(_LOG_LEVEL)
    logger.propagate = False
    return logger
