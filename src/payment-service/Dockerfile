FROM python:3.8.0-slim-buster

# Install Poetry
RUN pip install poetry==1.8.3

# Copy only requirements to cache them in docker layer
WORKDIR /poetry
COPY poetry.lock pyproject.toml /poetry/

# Project initialization:
RUN poetry config virtualenvs.create false \
  && poetry install --no-interaction --no-ansi

# Creating folders, and files for a project:
WORKDIR /app
COPY . /app

EXPOSE 8084

RUN poetry run opentelemetry-bootstrap -a install

ENTRYPOINT ["opentelemetry-instrument", "python", "payment_service/run.py"]

