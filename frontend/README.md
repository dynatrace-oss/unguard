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
| MICROBLOG_SERVICE_ADDRESS  | localhost:8080 |
| PROXY_SERVICE_ADDRESS      | localhost:8081 |
| AD_SERVICE_ADDRESS         | localhost:8082 |
| AD_SERVICE_EXTERN_ADDRESS  | localhost:8082 |

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

When developing, to have the server auto-restart on change of a file, use:

```
yarn run dev
```

### Developing with Kubernetes services

For further development at the frontend it may be useful to start Unguard in
Kubernetes (general README.me) and forward every port to the local build&run frontend:
 
```sh
kubectl port-forward -n unguard service/unguard-microblog-service 8080:80
kubectl port-forward -n unguard service/unguard-proxy-service 8081:80
kubectl port-forward -n unguard service/unguard-ad-service 8082:80
kubectl port-forward -n unguard service/unguard-user-auth-service 9091:80
```