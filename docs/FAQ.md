# FAQ

This document answers common questions which can occur when running Unguard.

**I get a `kustomize` error during deployment**

```sh
running [kubectl --context unguard kustomize ./k8s-manifests/localdev/minikube]
 - stdout: ""
 - stderr: "Error: rawResources failed to read Resources: Load from path ../../base failed: '../../base' must be a file
 ```

Upgrade `kubectl` to the latest version (at least >= `v1.21.0`). See this [stackoverflow answer](https://stackoverflow.com/questions/67071962/kubectl-apply-k-throws-error-rawresources-failed-to-read-resources-load-from).

**How can I avoid ImagePullBackOff errors in Kubernetes?**

Due to the great number of image pulls required you might need to set secrets for
an authenticated image repository to avoid being [rate-limited by DockerHub](https://www.docker.com/increase-rate-limits).

```sh
kubectl create secret docker-registry unguard-docker-hub-secrets
    --docker-server=docker.io \
    --docker-username=DUMMY_USERNAME \
    --docker-password=DUMMY_DOCKER_ACCESS_TOKEN \
    --docker-email=DUMMY_DOCKER_EMAIL
```

Patch the default service account (and the one used by the Jaeger operator) to use these pull secrets.

🐧🍎 On Linux and macOS, use the following

```sh
kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "unguard-docker-hub-secrets"}]}'
kubectl patch serviceaccount jaeger-operator -p '{"imagePullSecrets": [{"name": "unguard-docker-hub-secrets"}]}'
```

💻 On Windows, use the following

```sh
kubectl patch serviceaccount default -p '{\"imagePullSecrets\": [{\"name\": \"unguard-docker-hub-secrets\"}]}'
kubectl patch serviceaccount jaeger-operator -p '{\"imagePullSecrets\": [{\"name\": \"unguard-docker-hub-secrets\"}]}'
```

> Note: This needs to be done every time you recreate the cluster. You might need to repeat those steps once you deploy additional charts, e.g. for `jaeger`, `jaeger-operator`, `unguard-mariadb` at the moment.

**How can I expose Unguard deployed on Minikube to the internet?**

Use the [`k8s-manifests/localdev/ingress.yaml`](../k8s-manifests/localdev/ingress/ingress.yaml) as a template
and possibly change the `unguard.kube` hostname to match the hostname of your deployment before applying it.

```sh
kubectl apply -f k8s-manifests/localdev/ingress.yaml
 ```

Finally, you have to forward incoming requests to your machine on port 80 to your Minikube on port 80.
One way to do this is with the help of `socat` that you can start in a background `tmux` sessions.
Make sure that your local firewall also allows connections on port 80, if you have one.

```sh
sudo socat TCP-LISTEN:80,fork TCP:$(minikube ip):80
```

> Note: This will not expose the proxy-service.

## License

Copyright 2023 Dynatrace LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
