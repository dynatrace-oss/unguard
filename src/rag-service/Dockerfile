FROM python:3.11-slim AS base

RUN apt-get update -y && apt-get install -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . ./

RUN pip install -r requirements.txt

EXPOSE 8000
CMD ["uvicorn", "rag_service.main:app", "--host", "0.0.0.0", "--port", "8000"]
