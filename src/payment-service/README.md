# Payment Service

A REST service that allows to either create or get a credit card associated with a user.

## Local development

### Prerequisites

To set up the development environment, you need to:

1) Have Python 3.8.0 installed (you can use `pyenv` to manage multiple Python versions)
   1) Install [pyenv](https://github.com/pyenv/pyenv)
   2) You need to have `libsqlite3-dev` installed e.g. on Ubuntu with `sudo apt install libsqlite3-dev`
   3) Install Python 3.8.0 with `pyenv install 3.8.0`
   4) Set Python 3.8.0 as the version with `pyenv local 3.8.0`
2) Install [poetry](https://python-poetry.org/docs/) for dependency management and packaging
   1) The `poetry` version used in the docker container is `1.8.3`
   2) If you want ot install it via the installer script:
      ```bash
      export POETRY_VERSION=1.8.3
      curl -sSL https://install.python-poetry.org | python3 -
      ```
   3) Or you can install it via `pipx`:
        ```bash
        pipx install poetry==1.8.3
        ```
3) Run `poetry shell` to activate the virtual environment
4) Run `poetry install` to install all dependencies
5) Run `export SERVER_PORT=8084` to set the port for the flask server
6) Run `poetry run python payment_service/run.py` to start the flask server


### Usage

The service offers the following endpoints:

- `GET /payment-service/1`: Returns the credit card information for the user with the ID 1. The response has the following structure:
    ```json
    {
        "cardHolderName": "John Doe",
        "cardNumber": "4556737586899855",
        "expirationDate": "12/23",
        "cvv": "123"
    }
    ```
If the user does not exist, the service will return a 404 status code.

- `POST /payment-service/1`: Adds the payment information for user with the ID 1. The request body should have the following structure:
    ```json
    {
        "cardHolderName": "John Doe",
        "cardNumber": "4556737586899855",
        "expirationDate": "12/23",
        "cvv": "123"
    }
    ```
If the user already has payment information, the service will update it and return a 200 status code. If the user does not exist, the service will create a new user with the provided payment information and return a 201 status code.
If either the card number, the expiry date or the cvv is invalid, the service will return a 400 status code and a message indicating which fields are invalid.


### Environment Variables


| Name                                             | Example Value                        | Description                             |
|--------------------------------------------------|--------------------------------------|-----------------------------------------|
| SERVER_PORT                                      | 8084                                 | The port that the server will run on    |
| API_PATH                                         | /payment-service                     | Api entrypoint path                     |
| OTEL_LOGS_EXPORTER                               | console                              | The logs exporter to use                |
| OTEL_TRACES_EXPORTER                             | jaeger                               | The traces exporter to use              |
| OTEL_METRICS_EXPORTER                            | console                              | The metrics exporter to use             |
| OTEL_RESOURCE_ATTRIBUTES                         | service.name=unguard-payment-service | The service name for the traces         |
| OTEL_EXPORTER_OTLP_ENDPOINT                      | http://localhost:4317                | The endpoint for the OTLP exporter      |
| OTEL_EXPORTER_OTLP_PROTOCOL                      | http/protobuf                        | The protocol for the OTLP exporter      |
| OTEL_PROPAGATORS                                 | jaeger                               | The propagators to use for the traces   |
| OTEL_PYTHON_LOGGING_AUTO_INSTRUMENTATION_ENABLED | true                                 | Enable auto instrumentation for logging |
