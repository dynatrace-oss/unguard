import logging

from logger.custom_logger_formatter import CustomFormatter
from logger.logging_config import get_logger

_logger = get_logger(__name__)

def set_custom_uvicorn_logger_config():
    root = get_logger("rag_service.logging")
    level = root.level

    for name in ["uvicorn", "uvicorn.error", "uvicorn.access", "fastapi"]:
        lg = logging.getLogger(name)
        lg.handlers = []
        h = logging.StreamHandler()
        h.setFormatter(CustomFormatter())
        lg.addHandler(h)
        lg.setLevel(level)
        lg.propagate = False
