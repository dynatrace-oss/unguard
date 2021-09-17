# microblog-service

Contains a RESTful web-service that exposes functionality to login/register, view/create posts and follow other users.

## Getting started

### Requirements

- You have a Redis instance running
- You have a Jaeger agent running (see global README)


The Simplest way to start a Redis instance is with Docker:

```
docker run -d --name unguard-redis -p 6379:6379 redis
```

### Running

To simply run this service, optionally adjust the ```.env``` file for 
your Jaeger/Redis config and then run:

``` bash
# either set env variables manually or set them from .env file by running:
export $(xargs -a .env)                  # linux
for /F "tokens=*" %A in (.env) do set %A # windows-cmd
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
java -jar build/libs/microblog-service-{{VERSION}}.jar
```

Before running it, make sure to start a Redis instance in the same network and set all the required environment variables.

Running the application should start a webserver accessible on [localhost:8080](http://localhost:8080)

## Environment variables

To get more information about the JAEGER config options, see https://www.jaegertracing.io/docs/1.19/client-features/

|         Name          | Example Value     | Description                                |
|-----------------------|-------------------|--------------------------------------------|
| SERVER_PORT           | 8080              | The port that the server will run on
| REDIS_SERVICE_ADDRESS | localhost         | Change to hostname/IP of your Redis instance
| JAEGER_AGENT_HOST     | localhost         | Change to hostname/IP of your Jaeger agent
| JAEGER_SERVICE_NAME   | microblog-service | Name that will be used for the service in the Jaeger traces
| JAEGER_SAMPLER_TYPE   | const             | (optional) Set to const to get all traces
| JAEGER_SAMPLER_PARAM  | 1                 | (optional) Set to 1 while sampler is const to get all traces
| USER_AUTH_SERVICE_ADDRESS | unguard-user-auth-service | Change to hostname/IP of user-auth-service instance
