from fastapi import FastAPI
from config import settings
from logging_config import get_logger

from routers import healtz, ingestion, classification

app = FastAPI(title=settings.app_name, description=settings.app_description)
_logger = get_logger(__name__)

@app.on_event("startup")
async def startup():
    _logger.info("rag-service starting")

@app.on_event("shutdown")
async def shutdown():
    _logger.info("rag-service shutting down")

app.include_router(classification.router)
app.include_router(ingestion.router)
app.include_router(healtz.router)

@app.get("/")
async def root():
    return {"message": "Hello World"}
