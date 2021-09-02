# frontend

To install all dependencies with yarn (`npm install -g yarn`) run:

```
yarn install
```

This frontend is dependent on the MICROBLOG service, and the PROXY service to be also
available. It is also recommended having a Jaeger agent running for reporting traces.

Adjust the following environment variables if you are running the
other microservices on different ports/hosts:

|            Name            |  Default Value |
|----------------------------|----------------|
| JAEGER_SERVICE_NAME        | frontend       |
| JAEGER_AGENT_HOST          | localhost      |
| JAEGER_SAMPLER_TYPE        | const          |
| JAEGER_SAMPLER_PARAM       | 1              |
| MICROBLOG_SERVICE_ADDRESS  | localhost:8080 |
| PROXY_SERVICE_ADDRESS      | localhost:8081 |
| AD_SERVICE_ADDRESS         | localhost:8082 |
| USER_AUTH_SERVICE_ADDRESS  | localhost:9091 |
| FRONTEND_BASE_PATH         | /ui            |
| AD_SERVICE_BASE_PATH       | /ad-service    |

## Running

To run the frontend locally on [localhost:3000](http://localhost:3000), execute:

```
yarn start
```

If you want to change the override values with the environment variables set in .env 
and then run the frontend, run:

```
export $(xargs -a .env); yarn start
```

When developing, to have the server auto-restart (and apply .env) on change of a file, use:

```
yarn run dev
```

### Developing with Kubernetes services

For further development at the frontend it may be useful to start Unguard in
Kubernetes (general README.me) and forward every port to the local build&run frontend.  
Note that the iframe which loads the ad won't run with manual execution, since the ingress 
would normally root it over the frontend ```host address``` + AD_SERVICE_BASE_PATH.

Port forwarding: 
```sh
kubectl port-forward -n unguard service/unguard-microblog-service 8080:80
kubectl port-forward -n unguard service/unguard-proxy-service 8081:80
kubectl port-forward -n unguard service/unguard-ad-service 8082:80
kubectl port-forward -n unguard service/unguard-user-auth-service 9091:80
```