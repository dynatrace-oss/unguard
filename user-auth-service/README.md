# user-auth-service

To install all dependencies with yarn (`npm install -g yarn`) run:

```
yarn install
```

This user-auth-service requires a running relational database MariaDB has been used for testing.
It is also recommended having a Jaeger agent running for reporting traces.

Adjust the following environment variables if you are running the two
other microservices on different ports/hosts:

|         Name          | Example Value     | Description                                |
|-----------------------|-------------------|--------------------------------------------|
| SERVER_PORT           | 9091              | The port that the server will run on
| JAEGER_AGENT_HOST     | localhost         | Change to hostname/IP of your Jaeger agent
| JAEGER_SERVICE_NAME   | microblog-service | Name that will be used for the service in the Jaeger traces
| JAEGER_SAMPLER_TYPE   | const             | (optional) Set to const to get all traces
| JAEGER_SAMPLER_PARAM  | 1                 | (optional) Set to 1 while sampler is const to get all traces

## Running

To run the user-auth-service use.
```
yarn start
```

If you want to change the override values with the environment variables set in .env 
and then run the frontend, run:

```
export $(xargs -a .env); yarn start
```

When developing, to have the server auto-restart on change of a file, use:

```
yarn run dev
```