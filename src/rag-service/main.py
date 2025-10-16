from fastapi import FastAPI
from config import settings

app = FastAPI(title=settings.app_name, description=settings.app_description)

@app.get("/")
async def root():
    return {"message": "Hello World"}

