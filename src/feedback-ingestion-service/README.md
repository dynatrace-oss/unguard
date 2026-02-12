# Feedback Ingestion Service
Java Spring Boot Application that collects incoming user feedback for the spam predictions, buffers it in a queue and then
periodically sends a request to the RAG service to ingest a batch of feedback data into its knowledge base.

## Running it locally

### Getting started
- The RAG service should be running and accessible (see its [README](../rag-service/README.md) for details)
- If necessary, adjust the environment variables in the ```.env``` file for the address and port of your RAG service instance

### Building & Running
- To package this project into a runnable jar, run:

```
./gradlew build
```

which will generate the jar in ```build/libs```
- Start the application by running:
```
java -jar build/libs/microblog-service-{{VERSION}}.jar
```
- The feedback ingestion service should then be accessible on [localhost:8080](http://localhost:8080).

### Testing
- Use Bruno, Postman or a similar tool to send requests to the service for testing purposes
- Example request body for the /addToQueue endpoint:

```
{
  "text": "Sign up here to win!",
  "label": "spam"
}
```

## Environment variables

| Name                      | Example Value             | Description                                                  |
|---------------------------|---------------------------|--------------------------------------------------------------|
| SERVER_PORT               | 8080                      | The port that the server will run on                         |
| RAG_SERVICE_ADDRESS       | unguard-rag-service       | Change to hostname/IP of rag-service instance                |
| RAG_SERVICE_PORT          | 8000                      | Change to port number of rag-service instance                |
