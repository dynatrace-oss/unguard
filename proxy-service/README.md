# proxy-service

Contains a SSRF vulnerable web service that proxies requests and returns the result.
Can be abused to contact internal services (network internal, localhost).

The ```/``` endpoint is also vulnerable to HTTP header injection which can be used to do CPS.

The ```/curl``` endpoint can be used to create non-http requests (can do anything that curl supports).

## Getting started

### Requirements

- You have a Jaeger agent running (see global README)

### Running

To simply run this service, optionally adjust the ```.env``` file for 
your Jaeger config and then run:

```
# either set env variables manually or set them from .env file by running:
export $(xargs -a .env)
# start the application
./gradlew bootRun
```

## Building

To package this project into a runnable jar, run:
```
./gradlew build
```
which will generate the jar in ```build/libs``` which you can simply execute by running:

```
java -jar build/libs/proxy-service-{{VERSION}}.jar
```

Before running it, make sure to set all the required environment variables.

Running the application should start a webserver accessible on [localhost:8081](http://localhost:8081)

## Environment variables

To get more information about the JAEGER config options, see https://www.jaegertracing.io/docs/1.19/client-features/

|         Name         | Example Value | Description                               |
|----------------------|---------------|-------------------------------------------|
| SERVER_PORT          | 8081          | The port that the server will run on
| JAEGER_AGENT_HOST    | localhost     | Change to hostname/IP of your Jaeger agent
| JAEGER_SERVICE_NAME  | proxy-service |
| JAEGER_SAMPLER_TYPE  | const         | (optional) Set to const to get all traces
| JAEGER_SAMPLER_PARAM | 1             | (optional) Set to 1 while sampler is const to get all traces

