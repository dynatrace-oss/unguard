# Profile Service

A web service where biography information can be created, read and updated by authenticated users.
This service is vulnerable to SQL injection.

## Getting started

## Building

To package this project into a runnable jar, run:

```
./gradlew bootJar
```

which will generate the jar in ```build/libs``` which you can simply execute by running:

```
java -jar build/libs/unguard.profile-service-{{VERSION}}.jar
```

When running like this, don't forget to manually set the environment variables, see below for default values.

Running the application should start a webserver accessible on [localhost:8080](http://localhost:8080)

## Usage

To get the bio of a specific user, enter the url [localhost:8080/user/{id}/bio](http://localhost:8080/user/{id}/bio),
remember to replace `{id}` with the actual user id.

You can also post a bio by sending a POST request to the same url as above.
The request body could look like this:

```json
{
    "bioText": "test"
}
```

If you want to access the database directly, the H2 console is available
on [localhost:8080/h2-console](http://localhost:8080/h2-console).
When logging in, use the same values as the ones of the environment variables listed below.

## Environment variables

| Name                       | Default Value               | Description                                |
|----------------------------|-----------------------------|--------------------------------------------|
| SPRING_DATASOURCE_URL      | jdbc:h2:file:./database/bio | Location of the H2 database (memory/file)  |
| SPRING_DATASOURCE_USERNAME | sa                          | Database username                          |
| SPRING_DATASOURCE_PASSWORD | password                    | Database password                          |
