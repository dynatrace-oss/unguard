# frontend

To install all dependencies with yarn (`npm install -g yarn`) run:

```
yarn install
```

This frontend is dependent on the MICROBLOG service and the PROXY service to be also
available. It is also recommended to have a Jaeger agent running for reporting traces.

Adjust the following environment variables if you are running the two
other microservices on different ports/hosts:

|            Name            |  Default Value |
|----------------------------|----------------|
| MICROBLOG_SERVICE_ADDRESS  | localhost:8080 |
| PROXY_SERVICE_ADDRESS      | localhost:8081 |
| JAEGER_AGENT_HOST          | localhost      |

## Running

To run the frontend locally on [localhost:3000](http://localhost:3000), execute:

```
yarn start
```

If you want to change the override values with the environment variables set in .env, run:

```
set -o allexport; source .env; set +o allexport; yarn start
```

When developing, to have the server auto-restart on change of a file, use:

```
yarn run dev
```
