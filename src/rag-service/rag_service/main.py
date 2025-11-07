from fastapi import FastAPI, Response
from contextlib import asynccontextmanager

from rag_service.config import settings
from logger.logging_config import get_logger
from rag_service.routers import healthz, ingestion, classification

_logger = get_logger(__name__)

@asynccontextmanager
async def lifespan(_app: FastAPI):
    _logger.info("rag-service starting")
    yield
    _logger.info("rag-service shutting down")

app = FastAPI(title=settings.app_name, description=settings.app_description, lifespan=lifespan)

app.include_router(classification.router)
app.include_router(ingestion.router)
app.include_router(healthz.router)

@app.get("/")
async def root():
    return Response(status_code=200)
