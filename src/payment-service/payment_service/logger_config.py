import logging
from logging.config import dictConfig

dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '[%(asctime)s] %(levelname)-8s: %(message)s',
    }},
    'handlers': {'default-handler': {
        'class': 'logging.StreamHandler',
        'stream': 'ext://flask.logging.wsgi_errors_stream',
        'formatter': 'default'
    }},
    'root': {
        'level': 'ERROR',
        'handlers': ['default-handler']
    }
})

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
