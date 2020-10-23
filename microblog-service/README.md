# microblog-service

Contains a RESTful web-service that exposes functionality to login/register, view/create posts and follow other users.

## Building with gradle

To package this project to a jar, run:
```
./gradlw bootJar
```
which will generate the jar in ```build/libs``` which you can simply execute by running:

```
java -jar build/libs/microblog-service-{{VERSION}}.jar
```

Before running it, make sure to start a Redis instance in the same network and set all the required environment variables.

## Environment variables

To get more information about the JAEGER config options, see https://www.jaegertracing.io/docs/1.19/client-features/

|         Name         | Example Value | Description |
|----------------------|-------|-------------|
| REDIS_SERVICE_ADDRESS | localhost     | Change to hostname/IP of your Redis instance
| JAEGER_SERVICE_NAME  | microblog-service |
| JAEGER_SAMPLER_TYPE  | const | (optional)
| JAEGER_SAMPLER_PARAM | 1     | (optional)

