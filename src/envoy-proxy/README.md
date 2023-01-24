# Envoy Proxy

We use [envoy](https://www.envoyproxy.io) to have another reverse proxy after NGINX in our Unguard family.

If you want to develop this isolated from the rest of Unguard, do the following:

```sh
docker build -t envoy-proxy .
docker run -it -p 8080:8080 envoy-proxy
```

## Health endpoint

There is a custom health endpoint that can be used to check the availability of internal services.

```sh
curl -I http://unguard.kube/healthz?path=unguard-microblog-service
```

## Dynamic configuration

The proxy has a mix of static and dynamic configuration.

* The `listener_static` on port `8080` routes to other Unguard services.
* The `listener_dynamic` on port `8081` is dynamically configured by the file contents in `listener-ds.yaml`.
  Right now, it provides the health endpoint.

The dynamic configuration can be changed at runtime.
Just modify `listener-ds.yaml` in `/etc/envoy/unguard`.
After modifying the file, temporarily move it, because Envoy only watches for file moves and no content changes.

```sh
mv /etc/envoy/unguard/listener-ds.yaml /etc/envoy/unguard/listener-ds.bak.yaml
mv /etc/envoy/unguard/listener-ds.bak.yaml /etc/envoy/unguard/listener-ds.yaml
```
