# Jaeger

> A distributed tracing platform created by Uber Technologies and donated to Cloud Native Computing Foundation.

## ⚙️ Installation

Use the `jaeger` profile when calling Skaffold to deploy the scalable Jaeger stack with an Elasticsearch backend.
This is not recommended for local development, due to the high memory / CPU demand.

```sh
skaffold run -p jaeger
```

For local development, the jaeger all-in-one deployment can be used as a drop-in replacement for the more production ready
Jaeger stack. This can be deployed using the `jaeger-dev` Skaffold profile.

```sh
skaffold run -p jaeger-dev
```

## 🖥️ Usage

1. Port-forward the Jaeger UI

```sh
kubectl port-forward -n unguard service/jaeger-query 16686:16686
```

3. Open [localhost:16686](localhost:16686)

![](images/jaeger-ui.png)
