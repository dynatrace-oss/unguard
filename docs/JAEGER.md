# Jaeger

> A distributed tracing platform created by Uber Technologies and donated to Cloud Native Computing Foundation.

## ⚙️ Installation

Use the `jaeger` profile when calling Skaffold.

```sh
skaffold run -p jaeger
```

## 🖥️ Usage

1. Port-forward the Jaeger UI

```sh
kubectl port-forward -n unguard service/jaeger-query 16686:16686
```

3. Open [localhost:16686](localhost:16686)

![](images/jaeger-ui.png)