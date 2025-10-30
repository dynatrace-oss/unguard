from fastapi import FastAPI
from contextlib import asynccontextmanager

from .config import settings
from .logging_config import get_logger
from .routers import healtz, ingestion, classification

_logger = get_logger(__name__)

@asynccontextmanager
async def lifespan(_app: FastAPI):
    _logger.info("rag-service starting")
    yield
    _logger.info("rag-service shutting down")

app = FastAPI(title=settings.app_name, description=settings.app_description, lifespan=lifespan)

app.include_router(classification.router)
app.include_router(ingestion.router)
app.include_router(healtz.router)

@app.get("/")
async def root():
    return {"message": "Hello World"}
