# Tracing

Most of the services contain different jaeger-client libraries to export traces that can be collected using Jaeger.

## Enable tracing in services

By using the default Skaffold deployment tracing would be disabled for all services. To enable it, the corresponding
environment variables has to be set by e.g. specifying the `tracing` Skaffold profile during deployment:

```sh
skaffold run -p tracing
```

If tracing is enabled, it is assumed that a Jaeger instance is running.

## ⚙️ Jaeger Installation

Specifying the `jaeger` Skaffold profile deploys the scalable Jaeger stack with an Elasticsearch backend.
This is not recommended for local development, due to the high memory / CPU demand.

```sh
skaffold run -p jaeger
```

For local development, the Jaeger all-in-one deployment can be used as a drop-in replacement for the more production
ready Jaeger stack. This can be deployed using the `jaeger-dev` Skaffold profile.

```sh
skaffold run -p jaeger-dev
```

To deploy Jaeger and enable tracing for all the supported services, both profiles have to be specified:

```sh
skaffold run -p jaeger,tracing
# or for dev environments:
skaffold run -p jaeger-dev,tracing
```

## 🖥️ Usage

1. Port-forward the Jaeger UI

    ```sh
    kubectl port-forward -n unguard service/jaeger-query 16686:16686
    ```

2. Open [localhost:16686](http://localhost:16686)

   ![Jaeger UI](../images/jaeger-ui.png)
