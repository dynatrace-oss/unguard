import logging
from datetime import datetime


LEVEL_COLORS = {
    "DEBUG": "\033[36m",
    "INFO": "\033[32m",
    "WARNING": "\033[33m",
    "ERROR": "\033[31m",
    "CRITICAL": "\033[35m"
}
RESET = "\033[0m"

class CustomFormatter(logging.Formatter):
    def __init__(self):
        super().__init__(datefmt="%Y-%m-%d %H:%M:%S")

    def formatTime(self, record, datefmt=None):
        ct = datetime.fromtimestamp(record.created)
        return ct.strftime("%Y-%m-%d %H:%M:%S") + f".{int(record.msecs):03d}"

    def format(self, record):
        level = record.levelname
        color = LEVEL_COLORS.get(level, "")
        name = record.name.split(".")[0]
        level_pad = level.ljust(4)
        name_pad = name.ljust(16)
        log_message = super().format(record)
        return f"{self.formatTime(record)} | {color}{level_pad}{RESET} | {name_pad} | {log_message}"
