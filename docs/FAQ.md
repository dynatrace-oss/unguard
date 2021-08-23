# FAQ

This document answers common questions which can occur when running Unguard.

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

**Why is Unguard not recognized by Dynatrace anymore?**

Redeploying the ingress can result in a new frontend hostname. Therefore, you have to update the [application detection rule](https://rjc90872.sprint.dynatracelabs.com/#settings/rum/webappmonitoring) in Dynatrace manually.

To get the hostname run the following command:

```sh
kubectl get ingress -n unguard unguard-ingress -o=jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

**How can I push the images to the internal Dynatrace registry?**

Run the following command:

```sh
skaffold run --default-repo registry.lab.dynatrace.org/casp
```

**How can I expose Unguard deployed on Minikube to the internet?**

Use the [`k8s-manifests/extra/ingress.yaml`](./k8s-manifests/extra/ingress.yaml) as a template
and possibly change the `unguard.kube` hostname to match the hostname of your deployment before applying it.

```sh
kubectl apply -f k8s-manifests/extra/ingress.yaml
 ```

Finally, you have to forward incoming requests to your machine on port 80 to your Minikube on port 80.
One way to do this is with the help of `socat` that you can start in a background `tmux` sessions.
Make sure that your local firewall also allows connections on port 80, if you have one.

```sh
sudo socat TCP-LISTEN:80,fork TCP:$(minikube ip):80
```

> Note: This will not expose the proxy-service.