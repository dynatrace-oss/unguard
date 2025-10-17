from fastapi import FastAPI
from config import settings

from routers import healtz, ingestion, classification

app = FastAPI(title=settings.app_name, description=settings.app_description)

app.include_router(classification.router)
app.include_router(ingestion.router)
app.include_router(healtz.router)

@app.get("/")
async def root():
    return {"message": "Hello World"}
