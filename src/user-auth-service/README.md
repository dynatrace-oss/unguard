# User Auth Service

To install all dependencies with yarn (`npm install -g yarn`) run:

```
yarn install
```

This user-auth-service requires a running relational database MariaDB has been used for testing.
To run it locally using docker, you can run:

```bash
docker run --detach --name user-auth-db \
  --env MARIADB_PASSWORD=mariadb-root-password \
  --env MARIADB_DATABASE=my_database \
   -p 3306:3306 \
   mariadb:latest
```
And then update the environment variables for the user-auth-service to fit:
```bash
export MARIADB_PASSWORD=mariadb-root-password
export MARIADB_SERVICE=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' user-auth-db)
```

It is also recommended having a Jaeger agent running for reporting traces.

Adjust the following environment variables if you are running the two
other microservices on different ports/hosts:

| Name                 | Example Value         | Description                                                  |
|----------------------|-----------------------|--------------------------------------------------------------|
| SERVER_PORT          | 9091                  | The port that the server will run on                         |
| JAEGER_AGENT_HOST    | localhost             | Change to hostname/IP of your Jaeger agent                   |
| JAEGER_SERVICE_NAME  | user-auth-service     | Name that will be used for the service in the Jaeger traces  |
| JAEGER_SAMPLER_TYPE  | const                 | (optional) Set to const to get all traces                    |
| JAEGER_SAMPLER_PARAM | 1                     | (optional) Set to 1 while sampler is const to get all traces |
| MARIADB_SERVICE      | localhost             | Address of MariaDB database                                  |
| MARIADB_PASSWORD     | mariadb-root-password | Password of MariaDB database                                 |

## Running

To run the user-auth-service use:
```
yarn start
```

When developing, to have the server auto-restart on change of a file and use local .env variable, use:

```
yarn run dev
```
